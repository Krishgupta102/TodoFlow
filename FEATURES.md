# FEATURES.md — TodoFlow Feature Documentation

This document explains every feature implemented in the TodoFlow application.

---

## 1. Create Todo

**Location**: `TodosPage.jsx` → `TodoFormModal` (Dialogs.jsx)

- Triggered by the **"Add Todo"** hero button on the todos page.
- Opens a native `<dialog>` modal with a form containing:
  - **Title** (required, max 200 chars) — validated client-side and server-side
  - **Description** (optional, max 1000 chars)
  - **Priority** dropdown — Low / Medium / High (default: Medium)
  - **Status** dropdown — Pending / Completed (default: Pending)
  - **Due Date** date picker
- Submit button is disabled and shows a spinner while saving.
- On success: modal closes, todo list refreshes, success toast fires.
- On error: error toast fires, modal remains open.

---

## 2. Edit Todo

**Location**: `TodoCard.jsx` → Edit button → `TodoFormModal`

- Each todo card has an **Edit** button.
- Clicking it opens the form modal pre-populated with the existing todo's data.
- Same validation and submission logic as Create.
- Also available from the **detail page** (`/todo?id=`).

---

## 3. Delete Todo

**Location**: `TodoCard.jsx` → Delete button → `ConfirmDialog`

- Clicking the red **Delete** button opens a confirmation dialog.
- The dialog shows the todo's title in the message: _"Are you sure you want to delete 'Buy groceries'?"_
- Features **light-dismiss** (click outside the dialog to cancel).
- Confirm button disables and shows spinner while deleting.
- On success: list refreshes and success toast fires.
- Also available from the **detail page**.

---

## 4. Mark Complete / Toggle Status

**Location**: `TodoCard.jsx` → Complete/Undo button, `TodoDetailPage.jsx`

- Each card has a **Complete** (green check) button or **Undo** (clock) button, depending on the current status.
- Calls `PATCH /api/todos/:id/status` which toggles Pending ↔ Completed on the server.
- The local state is optimistically updated without a full list reload for performance.
- Completed todos display a line-through on their title and reduced opacity.

---

## 5. Search

**Location**: `TodosPage.jsx` → Search input, `useTodos.js`, `todoController.js`

- A search input in the sticky controls bar performs case-insensitive matching.
- Debounced by 400ms to prevent excessive API calls while the user is typing.
- Searches both `title` and `description` fields using a regex query on the server.
- Clearing the search reloads all todos.

---

## 6. Filter by Priority

**Location**: `TodosPage.jsx` → Priority dropdown, backend `GET /api/todos?priority=`

- Dropdown with options: All Priorities, High, Medium, Low.
- Sends `priority` query parameter to the API.
- Refreshes the todo list immediately on change.

---

## 7. Filter by Status

**Location**: `TodosPage.jsx` → Status dropdown, backend `GET /api/todos?status=`

- Dropdown with options: All Statuses, Pending, Completed.
- Sends `status` query parameter to the API.
- Can be combined with priority filter simultaneously.

---

## 8. Sort Todos

**Location**: `TodosPage.jsx` → Sort dropdown, backend `GET /api/todos?sort=`

| Sort Option   | Behavior                                    |
|---------------|---------------------------------------------|
| Newest First  | Default — sorted by `createdAt` descending  |
| Oldest First  | Sorted by `createdAt` ascending             |
| By Due Date   | Sorted by `dueDate` ascending (earliest first) |
| By Priority   | High → Medium → Low (in-memory sort)        |

---

## 9. View Todo Detail

**Location**: `TodoCard.jsx` → View button → `/todo?id=<mongoId>`

- Each card has a **View** button that navigates to the detail page.
- The detail page reads the `id` query parameter using `useSearchParams`.
- Shows full information:
  - Title (with completion strikethrough)
  - Description
  - Priority badge
  - Status badge
  - Due Date (with overdue warning)
  - Created At (date + time)
  - Updated At (date + time)
- A **Back to Todos** button returns to the dashboard.

---

## 10. Overdue Detection

**Location**: `TodoCard.jsx`, `TodoDetailPage.jsx`, `helpers.js`

- `isOverdue(dueDate)` checks if the due date is before today.
- Overdue todos (status: Pending, dueDate: past) show a red **Overdue** badge.
- Due date text is highlighted in red.

---

## 11. Toast Notifications

**Location**: `Toast.jsx`, `useToast` hook

- Toast messages appear in the top-right corner.
- Four variants: `success` (green), `error` (red), `info` (blue), `warning` (amber).
- Auto-dismiss after **4 seconds**.
- Each toast has an ✕ button for manual dismissal.
- Smooth slide-in / slide-out animations.
- Uses React's `useCallback` + `useState` via the `useToast` hook.

---

## 12. Loading States

**Location**: `TodosPage.jsx`, `Spinner.jsx`

- While the initial list is loading, **8 skeleton cards** are displayed with pulsing animations.
- Action buttons (Complete, Delete, Edit submit) show a spinner while processing.
- A global loading indicator is shown via the `FiRefreshCw` spinning icon.

---

## 13. Empty State

**Location**: `EmptyState.jsx`, `TodosPage.jsx`

- Displayed when no todos exist or no todos match the active filters.
- Shows a decorative clipboard illustration with floating dots.
- If filters are active, suggests clearing them with a CTA button.
- If no todos exist at all, shows a "Create First Todo" CTA button.

---

## 14. Form Validation

**Location**: `Dialogs.jsx` (client), `validator.js` (server)

**Client-side:**
- Title is required — empty submit shows a red error message below the input.
- Input borders turn red on validation failure.
- Error messages disappear as the user types.

**Server-side:**
- Title is required and max 200 characters.
- Priority must be Low, Medium, or High.
- Status must be Pending or Completed.
- Mongoose schema-level validation as a final safety net.

---

## 15. Responsive Design

**Location**: `index.css`, all page/component files

| Breakpoint   | Layout                                           |
|--------------|--------------------------------------------------|
| Mobile (<640px) | Single-column card grid, stacked control bar |
| Tablet (640–1024px) | 2-column card grid                      |
| Desktop (1024–1280px) | 3-column card grid                    |
| Wide (>1280px) | 4-column card grid                            |

---

## 16. Architecture

| Layer         | Technology            | Location                     |
|---------------|-----------------------|------------------------------|
| UI Components | React + JSX           | `client/src/components/`     |
| Pages         | React Router DOM      | `client/src/pages/`          |
| API Client    | Axios                 | `client/src/services/`       |
| State Logic   | Custom Hooks          | `client/src/hooks/`          |
| Utilities     | Pure JS functions     | `client/src/utils/`          |
| API Routes    | Express Router        | `server/routes/`             |
| Business Logic| Express Controllers   | `server/controllers/`        |
| Data Models   | Mongoose              | `server/models/`             |
| Middleware    | Express Middleware    | `server/middlewares/`        |
| DB Connection | Mongoose              | `server/config/`             |
