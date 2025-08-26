# TaskM8 Pro — Advanced Coding Challenge

 The goal of this exercise is to assess architectural reasoning, code quality, and awareness of scalable application patterns. This open-ended project is intentionally written with architectural, state, type, and validation pitfalls. There are way too many things to fix!

All tools and IDEs are allowed, but be prepared to explain all code written and decisions made in the submitted solution.

Note that there are more requirements than can be fulfilled in a resonable amount of time. Canditates may choose to mock or stub certain features to focus on other areas that highlight their skills, e.g. API mocks, testing boilerplate, UI skeleton components, etc.

---

## Feature Requirements

### 1. Real-Time Collaboration
- **Support for real-time:**  
  - *Explain recommended frameworks:* Socket.io, Pusher, Ably, etc.  
  - Candidate may **skip sockets** for initial submission, but discuss integration approach.

### 2. Flexible Data Models
- **Entities:**  
  - Tasks  
  - Users  
  - Comments  
  - Notifications
- **Design for extensibility:**  
  - Clearly defined relationships.

### 3. Authentication
- **Implementation:**  
  - Basic sign-in (mock logic or real implementation).  
  - Role or permission field in user model.

### 4. Decoupled Architecture
- **Frontend and backend** as distinct projects/modules.
- **Clear API/service layers.**  
- **Separation of concerns.**
- Candidate may **skip API** for initial submission, but discussion intergration approach.

### 5. Advanced Extension (Choose One or Propose Alternative)
- **History log:** Full change tracking (task/comment edit history).
- **Notifications:** Real-time or queued (task assigned, completed, or commented).
- **Advanced access controls:** Granular permissions (admin, member, guest).
- **Candidate may propose another meaningful extension.**

### 6. Bonus
- **Partial tests:** Provide sample/partial tests (unit, integration, or E2E).
- **Document architecture and trade-offs.**

---

## Functional Requirements

- **Task CRUD with validation:**  
  - Schema: title, description, labels, priority, status, multi-user assignment, due date.
  - All API boundaries validated & sanitized.

- **Comment System:**  
  - Markdown or rich text support.
  - Explain chosen implementation (UI/editor, parsing, security).

- **Notifications:**  
  - Logic (or mock) for assignment, completion, and comment events.

- **Frontend:**
  - Scoped styling (CSS Modules, SASS/SCSS, styled-components, Tailwind, etc.).
  - Modular components and clear error/empty state handling.
  - Responsive design.

- **Backend:**
  - RESTful API (mock is also acceptable with provided dataset).
  - Multi-file structure with clean separation (routing, models, services, utilities).

---

## Cross-Cutting Concerns

- **Type-safety awareness:**  
  - Validate/sanitize API, props, responses.

- **Architectural documentation:**  
  - Convention-following folder structure.
  - README with rationale for decisions
- **Testing:**  
  - At least one critical scenario each for backend and frontend (unit/integration).

- **DevOps awareness:**  
  - Discuss basic CI/CD setup.
  - Deployment plan (static hosting, containerization, scaling recommendations).

---

## Deliverables

- **Repository link**
- **Working demo or local install instructions**
- **As much documentation as is available (README with architectural overview, decision log, and test instructions)** 

A sample dataset has been provided for use in the application.

## Ideas for Investigatation (inclduing, but not limited to...)
- Build- or run-time errors
- Version control 
- Local development tooling
- Type confusion
- Data validation and error handling
- State management
- Security
- Accessibility
- Real-time and notifications
- API integration
- Developer documentiation 
