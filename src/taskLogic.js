
export let tasks = [];

export function createTask () {
  console.log('Creating a task!');
}

export class Task {
  constructor (name, dueDate, priority, description) {
    this.name = name;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
  }
}