# WhoOwsMe Backend

Node.js + TypeScript + Express + MongoDB backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Update .env with your configuration
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server

## Health Check

GET `/health` - Returns `{ status: "ok" }`
# who-owes-me-backend
