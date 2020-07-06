const express = require('express');
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  next();
}

//curl http://127.0.0.1:3000/projects
app.get('/projects', (req, res) => {
  res.json(projects);
})

// curl -d '{"title":"daniel", "owner":"marques"}' -H "Content-Type: application/json" -X POST http://localhost:3000/projects
app.post("/projects", (req, res) => {
  const { title, owner } = req.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  res.json({ project });
});

app.use(validateProjectId);

//curl -H "Content-Type: application/json" -X PUT -d '{"title":"daniel", "owner":"marques"}' http://localhost:3000/projects/id 
app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  console.log(id);
  console.log(projects);

  const projectIndex = projects.findIndex((value) => value.id === id);
  if (projectIndex < 0) return res.json({ error: 'Project not found' });
  
  const project = { id, title, owner };

  projects[projectIndex] = project;
  res.json(project);
});

//curl -X DELETE http://localhost:3000/projects/id
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((value) => value.id === id);
  if (projectIndex < 0) return res.json({ error: "Project not found" });

  projects.splice(projectIndex, 1); 

  res.json({ message: `Project with id=${id} was deleted` });
});

app.listen(3000, () => {
  console.log('Backend started ⚡️');
});