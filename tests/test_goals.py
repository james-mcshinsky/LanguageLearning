from language_learning.goals import GoalManager, GoalItem


def test_goal_crud():
    manager = GoalManager()
    item = GoalItem(word="hello", weight=2.0)
    manager.create_goal(item)
    assert manager.read_goal("hello") == item

    manager.update_goal("hello", 3.0)
    assert manager.read_goal("hello").weight == 3.0

    assert manager.list_goals() == [GoalItem(word="hello", weight=3.0)]

    manager.delete_goal("hello")
    assert manager.read_goal("hello") is None
