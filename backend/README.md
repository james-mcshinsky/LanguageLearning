# Backend Services

Each service runs as an independent Express application. The default ports
are configured in `index.ts` (3001–3005).

## Auth Service
- `GET /health` – service status
- `POST /register` – create a user `{ username, password }`
- `POST /login` – authenticate and receive a mock token
- `GET /users` – list registered users
- `DELETE /users/:id` – remove a user

## Goal Service
- `GET /health`
- `GET /goals` – list goals via the Python goal manager
- `POST /goals` – add a goal `{ word, weight }`
- `PUT /goals/:word` – update an existing goal's weight
- `DELETE /goals/:word` – remove a goal

## Lesson Service
- `GET /health`
- `GET /lesson?topic=TOPIC` – generate a lesson using Python code

## Media Service
- `GET /health`
- `GET /media?word=WORD&level=LEVEL` – suggest media for a word using Python

## Analytics Service
- `GET /health`
- `GET /reports` – return mock analytics data
