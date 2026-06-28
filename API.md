# API.md — TodoFlow REST API Documentation

**Base URL**: `http://localhost:5001/api`

All requests and responses use `Content-Type: application/json`.

---

## Response Format

All endpoints return a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* todo object or array */ },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## Todo Schema

| Field         | Type     | Required | Description                          |
|---------------|----------|----------|--------------------------------------|
| `_id`         | ObjectId | auto     | MongoDB document ID                  |
| `title`       | String   | ✅ Yes   | Todo title (max 200 chars)           |
| `description` | String   | No       | Optional description (max 1000 chars)|
| `priority`    | String   | No       | `Low` \| `Medium` \| `High` (default: `Medium`) |
| `status`      | String   | No       | `Pending` \| `Completed` (default: `Pending`) |
| `dueDate`     | Date     | No       | Optional ISO 8601 due date           |
| `createdAt`   | Date     | auto     | Auto-set by Mongoose timestamps      |
| `updatedAt`   | Date     | auto     | Auto-updated by Mongoose timestamps  |

---

## Endpoints

---

### 1. Get All Todos

**`GET /api/todos`**

Returns all todos. Supports optional query parameters for searching, filtering, and sorting.

#### Query Parameters

| Parameter  | Type   | Description                                          |
|------------|--------|------------------------------------------------------|
| `search`   | string | Case-insensitive search in title and description     |
| `priority` | string | Filter by `Low`, `Medium`, or `High`                 |
| `status`   | string | Filter by `Pending` or `Completed`                   |
| `sort`     | string | `oldest`, `dueDate`, or `priority` (default: newest) |

#### Example Request

```http
GET /api/todos?search=groceries&priority=High&sort=dueDate
```

#### Success Response `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "667a1b2c3d4e5f6789abcdef",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "priority": "High",
      "status": "Pending",
      "dueDate": "2026-07-01T00:00:00.000Z",
      "createdAt": "2026-06-28T08:00:00.000Z",
      "updatedAt": "2026-06-28T08:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Todo

**`GET /api/todos/:id`**

Returns a single todo by its MongoDB ObjectId.

#### URL Parameter

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | MongoDB todo document ID |

#### Example Request

```http
GET /api/todos/667a1b2c3d4e5f6789abcdef
```

#### Success Response `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "667a1b2c3d4e5f6789abcdef",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2026-07-01T00:00:00.000Z",
    "createdAt": "2026-06-28T08:00:00.000Z",
    "updatedAt": "2026-06-28T08:00:00.000Z"
  }
}
```

#### Error Responses

| Code | Message                     | Cause                        |
|------|-----------------------------|------------------------------|
| 400  | Invalid id: ...             | Invalid ObjectId format      |
| 404  | Todo not found              | No document with given ID    |

---

### 3. Create Todo

**`POST /api/todos`**

Creates a new todo document.

#### Request Body

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-07-01"
}
```

| Field         | Type   | Required | Notes                              |
|---------------|--------|----------|------------------------------------|
| `title`       | string | ✅ Yes   | Non-empty, max 200 chars           |
| `description` | string | No       | Max 1000 chars                     |
| `priority`    | string | No       | `Low` \| `Medium` \| `High`        |
| `status`      | string | No       | `Pending` \| `Completed`           |
| `dueDate`     | string | No       | ISO date string (YYYY-MM-DD)       |

#### Success Response `201 Created`

```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "_id": "667a1b2c3d4e5f6789abcdef",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2026-07-01T00:00:00.000Z",
    "createdAt": "2026-06-28T08:00:00.000Z",
    "updatedAt": "2026-06-28T08:00:00.000Z"
  }
}
```

#### Error Responses

| Code | Message                             | Cause                          |
|------|-------------------------------------|--------------------------------|
| 400  | Title is required and cannot be empty | Missing or blank title       |
| 400  | Title cannot exceed 200 characters  | Title too long                 |
| 400  | Priority must be one of: ...        | Invalid priority value         |

---

### 4. Update Todo

**`PUT /api/todos/:id`**

Updates fields of an existing todo. All fields are optional — only provided fields are updated.

#### URL Parameter

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | MongoDB todo document ID |

#### Request Body (all fields optional)

```json
{
  "title": "Buy groceries and fruits",
  "priority": "Medium",
  "dueDate": "2026-07-05"
}
```

#### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Todo updated successfully",
  "data": {
    "_id": "667a1b2c3d4e5f6789abcdef",
    "title": "Buy groceries and fruits",
    "priority": "Medium",
    "status": "Pending",
    "dueDate": "2026-07-05T00:00:00.000Z",
    "updatedAt": "2026-06-28T09:00:00.000Z"
  }
}
```

#### Error Responses

| Code | Message            | Cause                        |
|------|--------------------|------------------------------|
| 400  | Title cannot be empty | Provided title is blank   |
| 404  | Todo not found     | No document with given ID    |

---

### 5. Delete Todo

**`DELETE /api/todos/:id`**

Permanently deletes a todo by ID.

#### URL Parameter

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | MongoDB todo document ID |

#### Example Request

```http
DELETE /api/todos/667a1b2c3d4e5f6789abcdef
```

#### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

#### Error Responses

| Code | Message        | Cause                     |
|------|----------------|---------------------------|
| 400  | Invalid id: …  | Invalid ObjectId format   |
| 404  | Todo not found | No document with given ID |

---

### 6. Toggle Todo Status

**`PATCH /api/todos/:id/status`**

Toggles a todo's status between `Pending` and `Completed`. No request body required.

#### URL Parameter

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | ObjectId | MongoDB todo document ID |

#### Example Request

```http
PATCH /api/todos/667a1b2c3d4e5f6789abcdef/status
```

#### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Todo marked as Completed",
  "data": {
    "_id": "667a1b2c3d4e5f6789abcdef",
    "title": "Buy groceries",
    "status": "Completed",
    "updatedAt": "2026-06-28T10:00:00.000Z"
  }
}
```

#### Error Responses

| Code | Message        | Cause                     |
|------|----------------|---------------------------|
| 404  | Todo not found | No document with given ID |

---

## Error Code Summary

| HTTP Code | Meaning                                       |
|-----------|-----------------------------------------------|
| 200       | Success                                       |
| 201       | Created successfully                          |
| 400       | Bad request — validation or format error      |
| 404       | Resource not found                            |
| 500       | Internal server error (unexpected)            |

---

## Health Check

**`GET /api/health`**

```json
{
  "success": true,
  "message": "Todo API is running 🚀"
}
```
