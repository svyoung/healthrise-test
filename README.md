# TaskM8 Pro — Advanced Coding Challenge

Forked from https://github.com/healthrise/challenge-vue2-ui/

---

## UI Design

Because of the limited time, I used **TailwindCSS** and **MUI** to build the front end’s design.  
The layout is a **split panel**:

- **Left Panel** → Task form input  
- **Right Panel** → List of tasks  

I integrated **TipTap** for rich text formatting and included a few styling options such as **bold**, *italic*, etc.

On **mobile view**, the layout becomes **full screen**, while the **collapsible hamburger menu** remains accessible on all screens. 

Desktop view - split screen. Clicking on the hamburger menu will show a 30-40% width of the viewport

Mobile view - full screen, with the task list showing by default. Click on the hamburger menu will be full screen. Selecting an item will collapse the menu and show you the contents

### Enhancement Consideration
- The input **assigneeId** should have a search functionality (upon user input with a debounce) that will drop down an autocomplete list of users who can be assigned to the task, and a user should be entered instead of "assigneeId" so it is more human readable
- Collapsible panels or resizable panels

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
  
