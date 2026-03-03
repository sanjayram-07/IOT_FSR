# FSR Fitness — ESP8266 → WebSocket → React + Node + MongoDB

This project scaffolds a solution to collect FSR sensor readings from an ESP8266, process percentages for exercise variations, store them in MongoDB, and present a React dashboard. It also includes an AI prompt template to generate weekly workout and diet plans.

Quick start (backend)

1. Copy the example env: `cd backend` then `copy .env.example .env` and edit `MONGO_URI` and `AI_API_KEY`.
2. Install dependencies: `npm install` (run inside `backend`).
3. Start server: `npm start`.

Quick start (client)

1. `cd client` then `npm install`.
2. `npm run dev` to start Vite dev server.

ESP8266

See `esp8266/esp_snippet.md` for a connectivity snippet supporting multiple SSIDs and a fallback server IP.

Deployment notes

- For Azure: host the Node backend in an App Service or Container; set `AI_API_KEY` and `MONGO_URI` as App Settings. Build the React app and serve statically from the backend or a Storage Account + CDN. Use WebSocket-compliant setup (Azure Web Apps supports WebSockets).

Files added:

- `backend/` Node.js + WebSocket server and models
- `client/` Vite + React UI (simple dashboard)
- `esp8266/` ESP8266 snippet
- `ai_prompt.txt` AI prompt to generate plans
