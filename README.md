# TaskM8 Pro — Advanced Coding Challenge

Forked from https://github.com/healthrise/challenge-vue2-ui/

---

## Installation
Create an `.env` file and add in a `JWT_SECRET=supersecretkey` (or name it whatever you like) in the `/backend` directory

For the front end:

```
cd frontend/
npm install
npm run serve
```

For the back end server:

```
cd backend/
npm install
npm run serve
```

http://localhost:8080/
- You should be routed to a `/login` page
- Enter in `admin` as the user name and `password123` as the password

## UI Design

Because of the limited time, I used **TailwindCSS** and **MUI** to build the front end’s design.  
The layout is a **split panel**:

- **Left Panel** → Task form input  
- **Right Panel** → List of tasks  


On **mobile view**, the layout becomes **full screen**, while the **collapsible hamburger menu** remains accessible on all screens. 

Desktop view - split screen. Clicking on the hamburger menu will show a 30-40% width of the viewport

Mobile view - full screen, with the task list showing by default. Click on the hamburger menu will be full screen. Selecting an item will collapse the menu and show you the contents

The UI is far from complete and far from what I think is "pretty" to look at, it's a starter to get things up.

### Components
Components are designed to be modular and reusable, with a clear separation of concerns.

### Text Editor
I integrated **TipTap** for rich text formatting in the comments input, including basic styling options like **bold** and *italic*. I chose this library because it has strong community support and is straightforward to integrate. In a full project, we could expand this to include as many styling options as needed.

### Enhancement Consideration
- The input **assigneeId** should have a search functionality (upon user input with a debounce) that will drop down an autocomplete list of users who can be assigned to the task, and a user should be entered instead of "assigneeId" so it is more human readable
- Collapsible panels or resizable panels
- More options in the editing of the task (change task type: bug, task, story, etc...)

## Entities
### Task
In the `tasks.csv`, there were some missing data that didn't make too much sense. At first I thought `comments` was the actual description of the task, but upon seeing the array of text objects, that they were actually comments from multiple users. The task entity itself was missing a `description` property, as well as things like `createdAt` and `updatedAt`. 

So inside `backend/src/models/Task` is how the Task entity should be structured in its most basic form, with `assigneeId` referencing a user, and `comments` referencing the Comments entity in a **one to many** relationship.

```
Task
{
  title: String,
  assigneeId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: String,
  dueDate: Date,
  status: String,
  comments: Array,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}
```

### User
Inside `backend/src/models/User` has the basic schema for a user, and the `password` property should be a private, securely hashed value. That would be handled in Password Manager kind of service when adding new user into the database. 

```
User
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  createdAt: { type: Date, default: Date.now }
}
```

### Comment

```
Comment
{
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  createdAt: { type: Date, default: Date.now }
}
```

### Notification

```
Notification
{
  message: { type: String, required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

- Other entities to add: Activity Log

## API

For this project, I set up a mock API using the `tasks.csv` file as a baseline. Even though the CSV had incomplete data, it allowed me to populate the task list and experiment with local CRUD operations, simulating the behavior of a real database. In a production environment, this would involve accessing a proper database with credentials and using ORMs or ODMs to query data.

I organized the backend routes using Express routers for both authentication and tasks, keeping the structure clean and modular. Users are authenticated via JWT tokens, and a mock user with a tokenized password is available for testing.  

In a real-world scenario, there would be additional logic for login sessions, sanitization, password hashing, role-based access, and other security measures.

## Notification Services

I opted to leave this part out due to time constraints, but my approach would be to use Server-Sent Events (SSE). WebSockets feel like overkill here — in my view, they’re better suited for things like chat apps or real-time gaming where bi-directional communication is needed. SSE is lightweight and unidirectional, which fits perfectly for our use case: we only need the server to push updates when CRUD operations occur. A simple toast notification would handle this elegantly without adding unnecessary complexity.

```
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  global.notifications.push(sendEvent); // pseudo code to broadcast

  req.on('close', () => {
    // remove sendEvent from notification list
  });
});
```