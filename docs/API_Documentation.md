# Chat API Documentation

## Overview

This is a REST API for a chat application. It handles authentication, user search, conversations, messages, and group management. Real-time message delivery uses Socket.io, so clients don't have to keep polling.

There are two base URLs. This is the biggest gotcha on first integration.

REST requests go to `https://frontend-task-chatapp.onrender.com/api`

Socket.io connects to the root: `https://frontend-task-chatapp.onrender.com`

A conversation can be direct (one-to-one) or a group (three or more people with a name). When you send a message, the same endpoint handles both types. The server figures out who gets what based on the conversation's participant list.

## Authentication

No signup flow exists. `POST /auth/login` handles both registration and login. Send a phone number and a name. If that phone is new, the server creates the account. If it exists, you get logged into it. One endpoint for both paths.

The response is a JWT token. Include it on every protected request:

```
Authorization: Bearer <token>
```

Only two endpoints skip auth: `/auth/login` itself and `/health`.

For Socket.io, pass the token in the handshake, not as a header:

```javascript
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token }
});
```

Bad token or no token at all? The server rejects the connection before any events start.

## Endpoints

### Login and Session

#### POST /auth/login

Login or register in one call.

Both fields are required. Phone should be a real format like +15551234567. Name can be anything.

```
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

Response (201 or 200 depending on new vs existing):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "665f0c2a9b1e4a0012ab34cd",
    "phone": "+15551234567",
    "name": "Ada Lovelace",
    "createdAt": "2026-08-20T09:12:41.000Z"
  }
}
```

Save that token. Every other API call needs it in the header. On app startup, call this or call `/auth/me` to see if you already have a valid session.

#### GET /auth/me

Check who you are logged in as. Use this on app load to restore a session without forcing the user to log in again.

```
GET /api/auth/me
Authorization: Bearer <token>
```

Response:

```json
{
  "id": "665f0c2a9b1e4a0012ab34cd",
  "phone": "+15551234567",
  "name": "Ada Lovelace",
  "createdAt": "2026-08-20T09:12:41.000Z"
}
```

### Finding People

#### GET /users/search

Search for users by name or phone number. Results come back as an array. The user ID from the result is what you need to start a conversation.

```
GET /api/users/search?q=Ada
Authorization: Bearer <token>
```

Query parameter `q` is required. It matches on name or phone, case-insensitive.

Response:

```json
[
  {
    "id": "665f0c2a9b1e4a0012ab34cd",
    "phone": "+15551234567",
    "name": "Ada Lovelace"
  }
]
```

No matches? You get an empty array, not a 404.

### Conversations

#### GET /conversations

List all conversations the current user belongs to. This includes direct chats and groups. Use this to populate the sidebar.

```
GET /api/conversations
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "id": "6660a1b2c3d4e5f678901234",
    "type": "direct",
    "participants": [
      {
        "id": "665f0c2a9b1e4a0012ab34cd",
        "name": "Ada Lovelace"
      },
      {
        "id": "665f0c2a9b1e4a0012ab35ef",
        "name": "Grace Hopper"
      }
    ],
    "lastMessage": {
      "text": "See you at 5",
      "senderId": "665f0c2a9b1e4a0012ab35ef",
      "createdAt": "2026-08-22T07:41:03.000Z"
    },
    "updatedAt": "2026-08-22T07:41:03.000Z"
  },
  {
    "id": "6660a1b2c3d4e5f678901299",
    "type": "group",
    "name": "Project Team",
    "admins": ["665f0c2a9b1e4a0012ab34cd"],
    "participants": [
      {
        "id": "665f0c2a9b1e4a0012ab34cd",
        "name": "Ada Lovelace"
      },
      {
        "id": "665f0c2a9b1e4a0012ab35ef",
        "name": "Grace Hopper"
      }
    ],
    "lastMessage": null,
    "updatedAt": "2026-08-21T18:02:11.000Z"
  }
]
```

Check the response order on live. The API might sort by `updatedAt` or creation time or something else. If you need a specific order in your UI, sort it yourself rather than relying on the server.

#### POST /conversations

Start a direct conversation with another user. If you already have a conversation with this person, the API should return the existing one instead of making a duplicate. Verify this on the live API before you code around it.

```
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "userId": "665f0c2a9b1e4a0012ab35ef"
}
```

Response:

```json
{
  "id": "6660a1b2c3d4e5f678901234",
  "type": "direct",
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    },
    {
      "id": "665f0c2a9b1e4a0012ab35ef",
      "name": "Grace Hopper"
    }
  ],
  "createdAt": "2026-08-22T07:30:00.000Z"
}
```

The `userId` must exist. If you pass a fake ID, the server will reject it with a 400 or 404.

#### GET /conversations/{id}/messages

Fetch the message history for a conversation. Supports pagination to load older messages.

```
GET /api/conversations/6660a1b2c3d4e5f678901234/messages?limit=20
Authorization: Bearer <token>
```

Query parameters:

`limit` is optional. Default might be 20 or 50, check the live response. How many messages do you want per call?

`before` is optional. This is the cursor for pagination. When you have loaded the first page, the response will include a cursor that you pass here to load the previous page.

Response:

```json
{
  "messages": [
    {
      "id": "6660b2c3d4e5f6789012345",
      "conversationId": "6660a1b2c3d4e5f678901234",
      "senderId": "665f0c2a9b1e4a0012ab35ef",
      "text": "See you at 5",
      "createdAt": "2026-08-22T07:41:03.000Z"
    }
  ],
  "nextCursor": "6660b2c3d4e5f6789012300"
}
```

When you reach the start of the conversation, `nextCursor` will be `null` or missing. That means stop paginating.

The exact field names and structure matter here. Every API shapes pagination differently. Test this endpoint with the real server before you build your infinite scroll. The response body structure is not in the OpenAPI spec, so you need to see it yourself.

### Sending Messages

#### POST /messages

Send a message into a conversation. Works for both direct chats and groups. The recipients get it instantly over Socket.io as a `message:new` event. You don't need to poll or refetch the conversation after sending.

```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "conversationId": "6660a1b2c3d4e5f678901234",
  "text": "Hello!"
}
```

Both fields are required. Check on the client before sending: reject empty strings and strings with only whitespace. Don't rely on the server to validate this.

Response:

```json
{
  "id": "6660b2c3d4e5f6789012399",
  "conversationId": "6660a1b2c3d4e5f678901234",
  "senderId": "665f0c2a9b1e4a0012ab34cd",
  "text": "Hello!",
  "createdAt": "2026-08-22T07:45:12.000Z"
}
```

The server echoes back the message you just sent. Use this to update your UI if you want, though the Socket.io event will also deliver it.

### Groups

Groups are conversations with three or more people and a name. The creator becomes the first admin. Only admins can add members, remove members, promote others, or rename the group. Any member can leave at any time.

#### POST /conversations/group

Create a group conversation.

```
POST /api/conversations/group
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "name": "Project Team",
  "participantIds": [
    "665f0c2a9b1e4a0012ab34cd",
    "665f0c2a9b1e4a0012ab35ef"
  ]
}
```

Both fields are required. `participantIds` is the list of people to add besides yourself. You are added automatically as the creator and first admin.

Response:

```json
{
  "id": "6660a1b2c3d4e5f678901299",
  "type": "group",
  "name": "Project Team",
  "admins": ["665f0c2a9b1e4a0012ab34cd"],
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    },
    {
      "id": "665f0c2a9b1e4a0012ab35ef",
      "name": "Grace Hopper"
    }
  ],
  "createdAt": "2026-08-22T07:50:00.000Z"
}
```

#### POST /conversations/{id}/participants

Add members to a group. Admin-only.

```
POST /api/conversations/6660a1b2c3d4e5f678901299/participants
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "userIds": [
    "665f0c2a9b1e4a0012ab3600"
  ]
}
```

Response:

```json
{
  "id": "6660a1b2c3d4e5f678901299",
  "type": "group",
  "name": "Project Team",
  "admins": ["665f0c2a9b1e4a0012ab34cd"],
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    },
    {
      "id": "665f0c2a9b1e4a0012ab35ef",
      "name": "Grace Hopper"
    },
    {
      "id": "665f0c2a9b1e4a0012ab3600",
      "name": "New Member"
    }
  ],
  "createdAt": "2026-08-22T07:50:00.000Z"
}
```

The response returns the updated group. You can refresh your UI from this.

#### DELETE /conversations/{id}/participants/{userId}

Remove a member from the group. Admin-only, unless you pass your own user ID, in which case you are leaving the group yourself.

```
DELETE /api/conversations/6660a1b2c3d4e5f678901299/participants/665f0c2a9b1e4a0012ab35ef
Authorization: Bearer <token>
```

Response (likely 200 or 204):

```json
{
  "id": "6660a1b2c3d4e5f678901299",
  "type": "group",
  "name": "Project Team",
  "admins": ["665f0c2a9b1e4a0012ab34cd"],
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    }
  ],
  "createdAt": "2026-08-22T07:50:00.000Z"
}
```

Some APIs return the updated group body. Some return nothing (204 No Content). Test this on the live server.

#### POST /conversations/{id}/admins

Promote an existing group member to admin. Admin-only. This doesn't add someone new, it just changes their role if they are already in the group.

```
POST /api/conversations/6660a1b2c3d4e5f678901299/admins
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "userId": "665f0c2a9b1e4a0012ab35ef"
}
```

Response:

```json
{
  "id": "6660a1b2c3d4e5f678901299",
  "type": "group",
  "name": "Project Team",
  "admins": [
    "665f0c2a9b1e4a0012ab34cd",
    "665f0c2a9b1e4a0012ab35ef"
  ],
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    },
    {
      "id": "665f0c2a9b1e4a0012ab35ef",
      "name": "Grace Hopper"
    }
  ],
  "createdAt": "2026-08-22T07:50:00.000Z"
}
```

Notice the user is now in the `admins` array.

#### PATCH /conversations/{id}

Rename a group. Admin-only.

```
PATCH /api/conversations/6660a1b2c3d4e5f678901299
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "name": "Renamed Team"
}
```

Response:

```json
{
  "id": "6660a1b2c3d4e5f678901299",
  "type": "group",
  "name": "Renamed Team",
  "admins": ["665f0c2a9b1e4a0012ab34cd"],
  "participants": [
    {
      "id": "665f0c2a9b1e4a0012ab34cd",
      "name": "Ada Lovelace"
    },
    {
      "id": "665f0c2a9b1e4a0012ab35ef",
      "name": "Grace Hopper"
    }
  ],
  "createdAt": "2026-08-22T07:50:00.000Z"
}
```

### System

#### GET /health

Health check. No auth required. Use this to verify the API is up before you start your app, or to wake up the Render instance from sleep. Free-tier Render goes dormant after a while and the first request can be slow.

```
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

## Real-time Updates with Socket.io

Connect at the root domain, not the /api path. Pass your JWT in the handshake auth.

```javascript
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token }
});
```

Bad token or missing token? The connection fails before any listeners run.

### Sending Messages Over Socket

Client emits `message:send`:

```javascript
socket.emit("message:send", {
  conversationId: "6660a1b2c3d4e5f678901234",
  text: "Hello!"
});
```

You could send messages over REST instead. Both work. Pick one and stick with it. REST is simpler (normal request/response, normal error handling). Socket saves a round trip but makes optimistic updates trickier.

### Receiving Messages

Server emits `message:new` when a message arrives for you:

```javascript
socket.on("message:new", (message) => {
  console.log(message);
  // {
  //   id: "...",
  //   conversationId: "...",
  //   senderId: "...",
  //   text: "Hello!",
  //   createdAt: "2026-08-22T07:45:12.000Z"
  // }
});
```

Happens for both direct chats and groups. Append to the message list if the conversation is open, or increment an unread counter if not.

### Group Changes

Server emits `conversation:updated` when a group changes: created, renamed, member added/removed, or someone promoted to admin:

```javascript
socket.on("conversation:updated", (conversation) => {
  // Refresh the sidebar entry for this group ID
  // conversation has the same shape as GET /conversations
});
```

Use this to refresh your UI without forcing a full reload.

## Error Handling

The OpenAPI spec doesn't include HTTP status codes or error response shapes. These are inferred from Express defaults. Verify against the live API before you lock in your error handling.

Common cases:

Missing required fields in login, conversation start, or message send: probably 400 Bad Request.

Missing or expired token: 401 Unauthorized.

Tried an admin action without admin role: 403 Forbidden.

User ID or conversation ID doesn't exist: 404 Not Found.

Empty message text: 400 Bad Request.

Socket.io connection with bad token: connection rejected, no HTTP status code involved.

Error response body (guess):

```json
{
  "message": "Descriptive error text"
}
```

Show this message to the user where you can. For network errors (timeouts, connection drops), retry. For 4xx errors, show the message and let the user try again with different input, not the same request.

## Complete Example Flow

Login, search, start a chat, send a message.

```bash
# 1. Register or login
curl -X POST https://frontend-task-chatapp.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+15551234567","name":"Ada Lovelace"}'

# Response includes token and user

# 2. Search for a user
TOKEN="<paste token here>"
curl https://frontend-task-chatapp.onrender.com/api/users/search?q=Grace \
  -H "Authorization: Bearer $TOKEN"

# 3. Start a conversation with them
curl -X POST https://frontend-task-chatapp.onrender.com/api/conversations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"<user id from search>"}'

# 4. Send a message
curl -X POST https://frontend-task-chatapp.onrender.com/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"<conversation id>","text":"Hello!"}'

# 5. Connect Socket.io to receive new messages in real time
# io("https://frontend-task-chatapp.onrender.com", { auth: { token } })
```

On the client side, open the socket right after login and start listening before you need it:

```javascript
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: { token }
});

socket.on("message:new", (message) => {
  // append to UI or bump unread count
});

socket.on("conversation:updated", (conversation) => {
  // refresh sidebar
});
```

## Notes

Test pagination on the real API before building infinite scroll. The response structure is not in the OpenAPI spec. Same for delete responses - some endpoints might return 204 No Content instead of the conversation body.

Phone numbers should follow international format. The demo used +1555 codes. Your implementation will work with anything, but format matters for display and search.

Timestamps are ISO 8601. Parse them with `new Date(createdAt)` on the client.

User IDs are MongoDB ObjectIds. They look like hex strings. Don't guess them, always get them from search results or API responses.
