
export let tasks = [];

export let projects = [];

export function addTask () {
  console.log('Creating a task!');
  tasks.push(new Task(`${title.value}`, `${dueDate.value}`, `${priority.value}`, `${description.value}`, tasks.length, `${project.value}`));
}

export function createProject () {
//  else if (projects.indexOf(`${project.value}`) !== -1) {
//  to lower case and string then mapping
//  else if (projects.includes(`${project.value}`)) {

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
    return;
  }
}

export function deleteTask (task) {
  let index = task.id;
  tasks.splice(index,1);
  tasks.forEach(e => e.id = tasks.indexOf(e));
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