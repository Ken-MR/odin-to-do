
export let tasks = [];

export function addTask () {
  console.log('Creating a task!');
  tasks.push(new Task(`${title.value}`, `${dueDate.value}`, `${priority.value}`, `${description.value}`, tasks.length));
}

window.addTask = addTask;
window.tasks = tasks;

export class Task {
  constructor (name, dueDate, priority, description, id) {
    this.name = name;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.id = id;
  }
}