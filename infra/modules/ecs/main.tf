resource "aws_ecs_cluster" "this" {
  name = "backend-cluster"
}

data "aws_iam_policy_document" "task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "backend-task-exec"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "task" {
  name               = "backend-task-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}

data "aws_iam_policy_document" "dynamodb" {
  statement {
    actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"]
    resources = [var.data_table_arn]
  }
}

resource "aws_iam_role_policy" "task_dynamo" {
  name   = "backend-dynamodb-access"
  role   = aws_iam_role.task.id
  policy = data.aws_iam_policy_document.dynamodb.json
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = var.backend_image
      essential = true
      environment = [
        { name = "DATA_TABLE", value = var.data_table_name },
        { name = "AWS_REGION", value = var.region }
      ]
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_vpc" "this" {
  cidr_block = var.vpc_cidr
}

resource "aws_security_group" "service" {
  name        = "backend-sg"
  description = "Allow inbound HTTP to backend service"
  vpc_id      = aws_vpc.this.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Pull in all available AZs in your region
data "aws_availability_zones" "available" {}

# Create exactly two subnets, one in each of the first two AZs
resource "aws_subnet" "this" {
  count  = 2
  vpc_id = aws_vpc.this.id

  # This will carve two /24s out of your /16 VPC CIDR
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index)

  # Assign each subnet to a different AZ
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "${var.root_domain}-subnet-${count.index}"
  }
}

resource "aws_lb" "this" {
  name               = "${replace(var.root_domain, ".", "-")}-lb"
  load_balancer_type = "application"
  subnets            = aws_subnet.this[*].id
  security_groups    = [aws_security_group.service.id]
}

resource "aws_lb_target_group" "this" {
  name        = "backend-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.this.id

  health_check {
    path = "/"
  }
}

resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

resource "aws_ecs_service" "this" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.this[*].id
    security_groups  = [aws_security_group.service.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = "backend"
    container_port   = 8000
  }

  depends_on = [aws_lb_listener.this]
}
