export const updateTask = async (updatedTask) => {
    try {
        const res = await fetch(`http://localhost:4000/api/tasks/${updatedTask.id}`, {
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
    const res = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
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
    const res = await fetch('http://localhost:4000/api/logs');
    if (!res.ok) throw new Error('Failed to fetch activity logs');
    const data = await res.json();
    return data.reverse();
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return [];
  }
}