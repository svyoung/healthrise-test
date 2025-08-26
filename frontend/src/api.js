export function fetchTasks() {
  return fetch('http://localhost:4000/tasks')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    });
}
