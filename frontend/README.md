# Frontend

React web client built with Vite.

## Environment Variables

- `VITE_API_URL` – Base URL for the backend API. Defaults to `/api`.
  Set this to the backend's public endpoint when building for production.
  The value is read at build time and can be provided via a `.env` file or
  environment variables.

## Local Development

```bash
npm install
npm run dev
```

Optionally create a `.env` file to override the default API URL:

```bash
VITE_API_URL=http://localhost:8000
```

## Building

Build the production bundle, providing `VITE_API_URL` if the backend is not
served from the same origin:

```bash
VITE_API_URL=https://backend.example.com npm run build
```

Alternatively, define `VITE_API_URL` in a `.env.production` file.

## Deployment

When creating the Docker image, pass the backend endpoint as a build argument:

```bash
docker build --build-arg VITE_API_URL=https://backend.example.com -t language-learning-frontend .
```

This embeds the correct API URL into the built assets.
