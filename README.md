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
- **MORE** input sanitization and validation (html escaping, etc) before submitting to the database
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

Example: 
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

## Advance Extension
I implemented a basic activity log using mocked data stored in `backend/src/mockActivities.js`, which is imported into a global variable. Whenever a CRUD operation is triggered via the API, a corresponding log entry is added to this global variable. The frontend fetches and displays these logs through Express.

In a production environment, we would replace this with a proper persistent logging system, storing activity logs in a database. This would allow for querying, filtering, and auditing, and could be paired with real-time updates using Server-Sent Events or WebSockets if live notifications are needed.

## Suggested Architecture
(using the current stack)

### Front end
Vue 3 and the Composition API, using TailwindCSS for rapid styling and optionally MUI for prebuilt components. The layout features a split panel for desktop (task form on the left, task list on the right) and switches to full-screen on mobile, with a persistent collapsible hamburger menu.

**Features:**
- Rich text editor: TipTap for formatting tasks, supporting bold, italic, lists, and more.
- State management: Pinia for lightweight, reactive state handling. (Although Pinia was not use for this test assessment, it should be for a larger portion of the project)
- Routing and API: Vue Router handles page navigation, and Axios is used for communication with the backend.
- User feedback: Toast notifications, potentially powered by server-sent events for real-time updates.

### Back end
The backend uses Node.js with Express, organized into separate routers for tasks, authentication, and activity logs.

**Security and validation include:**
- JWT authentication with token refresh support.
- Input validation & sanitization via libraries like express-validator or Joi.
- Password hashing with bcrypt and additional protections such as CORS handling, rate limiting, and Helmet for security headers.

**Notifications and background processing can be handled with:**
- Server-Sent Events (SSE) for lightweight one-way notifications.
- Optional WebSockets for real-time multi-user collaboration.
- Task queues like Bull or RabbitMQ for asynchronous operations if the app scales.

### Database
The app uses MongoDB, with Mongoose as the ODM to manage schemas and queries. Given the project’s requirements, strict ACID compliance isn’t critical, and most data doesn’t require complex relational joins. This makes a NoSQL database a good fit, providing flexibility for storing tasks with dynamic metadata and comments.  

In cases where tasks had more complex relationships — for example, multiple users, roles, or linked projects requiring frequent joins — a relational database like PostgreSQL might be a better choice to maintain data integrity and simplify queries.

### Scaling
- Frontend can be deployed to Vercel, Netlify, or AWS S3 + CloudFront.
- Backend is containerized with Docker and deployable on AWS ECS, Kubernetes, or EC2.
- Database can use a managed service like MongoDB Atlas, DynamoDB, or AWS DocumentDB for automatic scaling and backups.
- Caching: Redis for frequently accessed data or notifications.
- Monitoring: Sentry for error tracking on both frontend and backend.

## For the Future
- Multi-user collaboration with live updates via WebSockets.
- Role-based access control (admin vs. member).
- Full-text search and advanced filtering for tasks and users