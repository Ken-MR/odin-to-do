
export let tasks = [];

export let projects = ['misc',];

export function addTask () {
  console.log('Creating a task!');
  tasks.push(new Task(`${title.value}`, `${dueDate.value}`, `${priority.value}`, `${description.value}`, tasks.length, `${project.value}`));
}

export function createProject () {
  if (project.value === 'misc') {
    return;
  }
  else if (projects.includes(`${project.value}`)) {
    return;
  }
  else {
    projects.push(`${project.value}`);
    return;
  }
}

export function deleteTask (task) {
  let index = task.id;
  tasks.splice(index,1);
  tasks.forEach(e => e.id = tasks.indexOf(e));
}

window.addTask = addTask;
window.deleteTask = deleteTask;
window.createProject = createProject;
window.tasks = tasks;
window.projects = projects;

export class Task {
  constructor (name, dueDate, priority, description, id, project = 'misc.') {
    this.name = name;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.id = id;
    this.project = project;
  }
}

export class Project {
  constructor (name) {
    this.name = name;
  }
}