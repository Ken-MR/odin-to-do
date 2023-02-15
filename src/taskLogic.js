
export let tasks = [];

export let projects = [];

export function addTask () {
  console.log('Creating a task!');
  tasks.push(new Task(`${title.value}`, `${dueDate.value}`, `${priority.value}`, `${description.value}`, tasks.length, `${project.value}`));
  populateStorage(tasks, 'tasks');
}

export function createProject () {

  let names = [];

  for (let i = 0; i < projects.length; i++) {
    names.push(`${projects[i].name}`);
  }

  if (project.value === 'misc') {
    return;
  }
  else if (names.includes(`${project.value}`)) {
    return;
  }
  else {
    projects.push(new Project(`${project.value}`, projects.length));
    populateStorage(projects, 'project');
    return;
  }
}

export function deleteTask (task) {
  let index = task.id;
  tasks.splice(index,1);
  tasks.forEach(e => e.id = tasks.indexOf(e));
  populateStorage(tasks, 'tasks');
}

export function deleteProject (project) {
  let index = project.id;
  if (project.name !== 'misc') {
    projects.splice(index,1);
    projects.forEach(e => e.id = projects.indexOf(e));
  }
  // reindexing as you delete and it's causing errors
  // add a project argument and different logic that applies only in that situation?
  let indices = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].project === project.name) {
      indices.push(i);
    }
  }
  for (let i = 0; i < indices.length; i++) {
    tasks.splice(indices[i], 1)
  }
  tasks.forEach(e => e.id = tasks.indexOf(e));
  populateStorage(projects, 'project');
  populateStorage(tasks, 'tasks');
}

window.addTask = addTask;
window.deleteTask = deleteTask;
window.createProject = createProject;
window.deleteProject = deleteProject;
window.tasks = tasks;
window.projects = projects;

export class Task {
  constructor (name, dueDate, priority, description, id, project = 'misc') {
    this.name = name;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.id = id;
    this.project = project;
  }
}

export class Project {
  constructor (name, id) {
    this.name = name;
    this.id = id;
  }
}

projects.push(new Project('misc', 0));

export function fetchData() {

  if (window.localStorage.getItem('tasks')) {
      const storedTasks = JSON.parse(window.localStorage.getItem('tasks'));
      for (let i = 0; i < storedTasks.length; i++) {
          tasks[i] = storedTasks[i]
      }
  }

  if (window.localStorage.getItem('projects')) {
      const storedProjects = JSON.parse(window.localStorage.getItem('projects'));
      for (let i = 1; i < storedProjects.length; i++) {
          projects[i] = storedProjects[i]
      }
  }
}

function populateStorage (data, type) {
  if (type === 'tasks') {
    window.localStorage.setItem('tasks', JSON.stringify(data));
  }
  else {
    window.localStorage.setItem('projects', JSON.stringify(data));
  }
}