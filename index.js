const express = require('express');

const server = express();

server.use(express.json());

let requisitions = 0;
const projects = [];

function countRequisitions(req, res, next){
  requisitions++;
  console.log(`Number of requisitions: ${requisitions}`);
  next();
}

function isThereProject(req, res, next){
  const { id } = req.params;
  const project = findProjectById(id);

  if (project != null)
    next();
  else
    return res.status(400).json({ error: 'Project not found' });
}

server.get('/projects', countRequisitions, (req,res) => {
  return res.send(projects)
});

server.post('/projects', countRequisitions, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.send(project);
});

server.put('/projects/:id', countRequisitions, isThereProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  project = findProjectById(id);

  project.title = title;

  return res.send(project)
});

server.delete('/projects/:id', countRequisitions, isThereProject, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(function(p) {
    return p.id == id;
  });
  
  projects.splice(projectIndex, 1);
  
  return res.send({ sucess: "The project was deleted with sucess." });
})

server.post('/projects/:id/tasks', countRequisitions, isThereProject, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = findProjectById(id);
  
  project.tasks.push(title);

  return res.send(project);
});

function findProjectById(id) {
  return projects.find(function(p) {
    return p.id == id;
  });
}

server.listen(3000);