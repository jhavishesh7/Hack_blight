# User Data Logger Backend

This backend API handles user data logging from the plant care app and saves it to `inputs.json` for the chatbot to use.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
Create a `.env` file in the backend directory:
```bash
# .env
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST `/api/user-data-log`
Receives user data from the frontend and saves it to `inputs.json`.

**Request Body:**
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "sessionId": "session_1234567890_abc123",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_sign_in_at": "2024-01-01T00:00:00.000Z",
    "user_metadata": {}
  },
  "profile": {},
  "plants": [],
  "careSchedules": [],
  "recentCareLogs": [],
  "userListings": [],
  "systemInfo": {},
  "appUsage": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "User data saved successfully"
}
```

### GET `/api/health`
Health check endpoint.

## File Structure

```
backend/
├── server.js              # Express server
├── userDataHandler.js     # User data processing logic
├── package.json           # Dependencies
├── inputs.json           # Generated file for chatbot
└── README.md             # This file
```

## Integration with Chatbot

The `inputs.json` file is automatically generated and updated with user data. Your chatbot can read this file to get user context:

```javascript
// chatbot.js
const userInputs = JSON.parse(fs.readFileSync('./inputs.json', 'utf-8'));
```

## Error Handling

- If the backend is unavailable, the frontend will fall back to downloading a local JSON file
- All errors are logged to the console
- The API returns appropriate HTTP status codes

## Development

- The server runs on port 3001 by default
- CORS is enabled for cross-origin requests
- JSON payload limit is set to 10MB
- Auto-restart with nodemon in development mode 