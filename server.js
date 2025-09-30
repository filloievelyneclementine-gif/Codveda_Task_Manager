const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Sample Task", description: "This is a sample", status: "pending" }
];

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Add new task
app.post('/api/tasks', (req, res) => {
  console.log("Received body:", req.body); // Add this line
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    status: "pending"
  };
  tasks.push(newTask);
  res.json(newTask);
});
// Mark as done
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = req.body.status || task.status;
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});