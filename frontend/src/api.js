const apiHostURL = process.env.VUE_APP_API_HOST;

export const fetchTasks = async (limit = 30) => {
  try {
    const res = await fetch(`${apiHostURL}/api/tasks`);
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }
    const tasks = await res.json();
    /** 
     * using this method to mock a "pagination" effect, the likely scenario
     * is we use a query param to limit the number of tasks returned with
     * a page size or cursor & offsets
     * */ 
    return tasks.slice(0, limit).reverse(); // fake "descending" order
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const createTask = async (newTask) => {
  try {
    const res = await fetch(`${apiHostURL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status}`);
    }

    const createdTask = await res.json();
    return createdTask;
  } catch (err) {
    console.error('There was an error creating the task', err);
    throw err;
  }
}

export const updateTask = async (updatedTask) => {
    try {
        const res = await fetch(`${apiHostURL}/api/tasks/${updatedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        })
  
        const data = await res.json()
        
        return data
      } catch (err) {
        console.error('Failed to submit comment', err)
      }
}

export const removeTask = async (taskId) => {
  try {
    const res = await fetch(`${apiHostURL}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete task with id ${taskId}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete task', err);
  }
};

export const fetchActivityLogs = async () => {
  try {
    const res = await fetch(`${apiHostURL}/api/logs`);
    if (!res.ok) throw new Error('Failed to fetch activity logs');
    const data = await res.json();
    return data.reverse();
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return [];
  }
}