
import Swal from 'sweetalert2';
import { projects, tasks } from './taskLogic';
import { isToday, isThisWeek, compareAsc, parse, parseISO, format } from 'date-fns'

export function generateLayout() {
  console.log('Generating a page!');
  const content = document.getElementById('content');

  let first = content.firstElementChild;
  while (first) {
    first.remove();
    first = content.firstElementChild;
  }

  const sideBar = document.createElement('div');
  sideBar.setAttribute('id', 'side-bar');
  const filterTabs = document.createElement('div');
  filterTabs.setAttribute('id', 'filter-tabs');
  const projectTabs = document.createElement('div');
  projectTabs.setAttribute('id', 'project-tabs');

  sideBar.appendChild(filterTabs);
  sideBar.appendChild(projectTabs);

  const info = document.createElement('div');
  info.setAttribute('id', 'task-info');

  content.appendChild(sideBar);
  content.appendChild(info);

  const filters = ['Today', 'Upcoming', 'Past Due', 'Anytime', 'All Tasks'];

  const filterList = document.createElement('ul');

  let listElement;
  let listHeader;

  for (let i = 0; i < filters.length; i++) {
    listElement = document.createElement('li');
    listHeader = document.createTextNode(filters[i]);
    listElement.setAttribute('id', `${filters[i].replace(/\s/g, "-")}`);
    listElement.appendChild(listHeader);
    filterList.appendChild(listElement);
  }

  filterTabs.appendChild(filterList);

  for (let i = 0; i < filters.length; i++) {
    filterListeners(filters[i]);
  }

  const projectList = document.createElement('ul');
  projectList.setAttribute('id', 'project-list-start');

  projectTabs.appendChild(projectList);

  for (let i = 0; i < projects.length; i++) {
    let project = document.createElement('li');
    project.appendChild(document.createTextNode(projects[i].name));
    projectList.appendChild(project);
    let taskTree = document.createElement('ul');
    project.appendChild(taskTree);
    project.addEventListener('click', () => {
      loadProject(projects[i]);
    });
    for (let j = 0; j < tasks.length; j++) {
      if (tasks[j].project === projects[i].name) {
        let taskItem = document.createElement('li');
        taskItem.appendChild(document.createTextNode(tasks[j].name));
        taskTree.appendChild(taskItem);
        taskItem.addEventListener('click', () => {
          displayTask(tasks[j]);
        });
      }
    }
  }
}

function filterListeners (filter) {
  let tab = document.getElementById(`${filter.replace(/\s/g, "-")}`);
  tab.addEventListener('click', () => {
    console.log(`You clicked on ${filter}`)
    loadTasks(tasks, filter);
  });
}

export function loadTasks (tasks, type) {
  console.log('I am loading tasks!');

  const taskInfo = document.getElementById('task-info');

  clearTaskWindow(taskInfo);

  if (tasks.length === 0) {
    console.log('No tasks found!');
    Swal.fire({
      title: 'You do not have any tasks. Would you like to create one?',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        addTaskPage ();
      }
    });
    const noTasks = document.createElement('h1');
    noTasks.appendChild(document.createTextNode('No tasks found!'));
    taskInfo.appendChild(noTasks);
    return;
  }

  let filteredTasks = [];
  let header = 'Your Tasks';
  let today = format(new Date(), 'yyyy-MM-dd');
  switch (type) {
    case 'Today':
      tasks.forEach((task) => {
        if (isToday(parse(`${task.dueDate}`, 'yyyy-MM-dd', new Date()))) {
          filteredTasks.push(task);
          header = "Today's tasks";
        }
      });
      break;
    case 'Upcoming':
      header = "Upcoming tasks";
      tasks.forEach((task) => {
        let parsedDate = parse(`${task.dueDate}`, 'yyyy-MM-dd', new Date());
        if (isThisWeek(parsedDate) && (compareAsc(parsedDate, parseISO(today)) >= 0)) {
          filteredTasks.push(task);
        }
      });
      break;
    case 'Past Due':
      header = "Late tasks";
      tasks.forEach((task) => {
        let parsedDate = parse(`${task.dueDate}`, 'yyyy-MM-dd', new Date());
        if (compareAsc(parsedDate, parseISO(today)) < 0) {
          filteredTasks.push(task);
        }
      });
      break;
    case 'Anytime':
      header = "Non-critical tasks";
      tasks.forEach((task) => {
        if (task.priority === 'none') {
          filteredTasks.push(task);
        }
      });
      break;
    default:
      filteredTasks = tasks;
  }

  const taskList = document.createElement('div');
  taskList.setAttribute('class', 'tasks');
  taskList.setAttribute('grid-row', '2');

  if (filteredTasks.length === 0) {
    header = `You have no ${type} tasks!`;
  }
  else {
    for (let i = 0; i < filteredTasks.length; i++) {
      taskList.appendChild(createTaskCard(filteredTasks[i]));
    }
  }

  const taskListHeader = document.createElement('h1');
  taskListHeader.appendChild(document.createTextNode(header));
  taskListHeader.setAttribute('grid-row', '1');

  taskInfo.appendChild(taskListHeader);
  taskInfo.appendChild(taskList);
}

function loadProject (project) {
  console.log('I am loading a project!');
  const taskInfo = document.getElementById('task-info');

  clearTaskWindow(taskInfo);

  const projectHeader = document.createElement('div');
  projectHeader.setAttribute('grid-row', '1');
  projectHeader.setAttribute('id', 'project-header');

  const projectName = document.createElement('h1');
  projectName.appendChild(document.createTextNode(`Project: ${project.name}`));

  const projectDelete = document.createElement('div');
  projectDelete.innerHTML = '<i class = "material-icons">delete</i>';
  projectDelete.setAttribute('class', 'delete-icon');

  projectHeader.appendChild(projectName);
  projectHeader.appendChild(projectDelete);

  projectDelete.addEventListener('click', () => {
    Swal.fire({
      title: 'Are you sure you want to delete this project?',
      text: "You won't be able to revert this and it will delete all associated tasks!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(project);
        Swal.fire(
          'Deleted!',
          'Your project has been deleted.',
          'success'
        )
        generateLayout();
        loadTasks(tasks);
      }
    })
  });

  const taskList = document.createElement('div');
  taskList.setAttribute('class', 'tasks');
  taskList.setAttribute('grid-row', '2');

  taskInfo.appendChild(projectHeader);
  taskInfo.appendChild(taskList);

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].project === project.name) {
      taskList.appendChild(createTaskCard(tasks[i]));
    }
  }
}

function createTaskCard (task) {
  let taskName = task.name;
  let taskDueDate = task.dueDate;
  let taskPriority = task.priority;
  let taskDescription = task.description;
  let taskProject = task.project;

  let card = document.createElement('div');
  card.setAttribute('class', 'card');

  let today = format(new Date(), 'yyyy-MM-dd');
  let parsedDate = parse(`${task.dueDate}`, 'yyyy-MM-dd', new Date());

  if (task.priority !== 'none') {
    if (compareAsc(parsedDate, parseISO(today)) < 0) {
      card.classList.add('past-due');
    }
    else if (isThisWeek(parsedDate) && (compareAsc(parsedDate, parseISO(today)) >= 0)) {
      card.classList.add('due-soon');
    }
  }

  let cardName = document.createElement('h3');
  cardName.appendChild(document.createTextNode(taskName));
  cardName.addEventListener('click', () => {
    displayTask(task);
  });

  let cardDescription = document.createElement('p');
  cardDescription.appendChild(document.createTextNode(taskDescription));

  let cardFooter = document.createElement('div');
  let cardPriority = document.createElement('div');
  cardPriority.appendChild(document.createTextNode(taskPriority));
  let cardDueDate = document.createElement('div');
  cardDueDate.appendChild(document.createTextNode(taskDueDate));
  let cardProject = document.createElement('div');
  cardProject.appendChild(document.createTextNode(taskProject));

  cardFooter.append(cardPriority);
  cardFooter.append(cardDueDate);
  cardFooter.append(cardProject);

  card.appendChild(cardName);
  card.appendChild(cardDescription);
  card.appendChild(cardFooter);

  return card;
}

function addTaskPage () {
  console.log("Let's add one!");
  const taskInfo = document.getElementById('task-info');

  clearTaskWindow(taskInfo);

  const taskHeader = document.createElement('h1');
  taskHeader.appendChild(document.createTextNode('Complete this form to add a new task'));
  taskHeader.setAttribute('grid-row', '1');

  const taskForm = document.createElement('form');
  taskForm.setAttribute('id', 'taskForm');
  taskForm.setAttribute('onSubmit', 'event.preventDefault() & manageTasks()');
  taskForm.setAttribute('grid-row', '2');

  taskInfo.appendChild(taskHeader);
  taskInfo.appendChild(taskForm);

  // reload to add new task stops here? It works the first time for some inexplicable reason...

  for (let i = 0; i < 6; i++) {
    let formBox = document.createElement('div');
    formBox.setAttribute('class', 'data');
    taskForm.appendChild(formBox);
  }

  // create grid so form entry elements are separate and can be read by the user.

  // create form submit button

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'Submit');
  submitButton.setAttribute('id', 'submit');
  submitButton.setAttribute('name', 'submit');

  // create project input

  const projectLabel = document.createElement('label');
  projectLabel.htmlFor = 'project';

  const projectInput = document.createElement('input');
  projectInput.setAttribute('type', 'text');
  projectInput.setAttribute('id', 'project');
  projectInput.setAttribute('name', 'project');
  projectInput.setAttribute('value', 'misc');

  // create title input

  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'title';
  titleLabel.appendChild(document.createTextNode('Title: '));

  const titleInput = document.createElement('input');
  titleInput.setAttribute('type', 'text');
  titleInput.setAttribute('id', 'title');
  titleInput.setAttribute('name', 'title');
  titleInput.required = true;

  // create due date input

  const dueDateLabel = document.createElement('label');
  dueDateLabel.htmlFor = 'dueDate';
  dueDateLabel.appendChild(document.createTextNode('Due Date: '));
  
  const dueDateInput = document.createElement('input');
  dueDateInput.setAttribute('type', 'date');
  dueDateInput.setAttribute('id', 'dueDate');
  dueDateInput.setAttribute('name', 'dueDate');
  dueDateInput.required = true;

  // create priority input

  const priorityLabel = document.createElement('label');
  priorityLabel.htmlFor = 'priority';
  priorityLabel.appendChild(document.createTextNode('Priority: '));
  
  const priorityInput = document.createElement('select');
  priorityInput.setAttribute('id', 'priority');
  priorityInput.setAttribute('name', 'priority');
  priorityInput.required = true;

  const priorityNone = document.createElement('option');
  priorityNone.value = 'none';
  priorityNone.appendChild(document.createTextNode('None'));

  const priorityLow = document.createElement('option');
  priorityLow.value = 'low';
  priorityLow.appendChild(document.createTextNode('Low'));

  const priorityMedium = document.createElement('option');
  priorityMedium.value = 'medium';
  priorityMedium.appendChild(document.createTextNode('Medium')); 

  const priorityHigh = document.createElement('option');
  priorityHigh.value = 'high';
  priorityHigh.appendChild(document.createTextNode('High'));

  priorityInput.appendChild(priorityNone);
  priorityInput.appendChild(priorityLow);
  priorityInput.appendChild(priorityMedium);
  priorityInput.appendChild(priorityHigh);

  // create description input

  const descriptionLabel = document.createElement('label');
  descriptionLabel.htmlFor = 'description';
  descriptionLabel.appendChild(document.createTextNode('Description: '));

  const descriptionInput = document.createElement('textarea');
  descriptionInput.setAttribute('id', 'description');
  descriptionInput.setAttribute('name', 'description');
  descriptionInput.setAttribute('rows', '3');
  descriptionInput.setAttribute('cols', '75');
  descriptionInput.required = true;

  // append form elements

  taskForm.childNodes[0].appendChild(submitButton);

  taskForm.childNodes[1].appendChild(projectInput);
  taskForm.childNodes[1].appendChild(projectLabel);

  taskForm.childNodes[2].appendChild(titleLabel);
  taskForm.childNodes[2].appendChild(titleInput);

  taskForm.childNodes[3].appendChild(dueDateLabel);
  taskForm.childNodes[3].appendChild(dueDateInput);

  taskForm.childNodes[4].appendChild(priorityLabel);
  taskForm.childNodes[4].appendChild(priorityInput);

  taskForm.childNodes[5].appendChild(descriptionLabel);
  taskForm.childNodes[5].appendChild(descriptionInput);
}

function addAnotherTask() {
  Swal.fire({
    title: 'Task added, would you like to add another?',
    icon: 'question',
    showCloseButton: true,
    showDenyButton: true,
    focusConfirm: false,
    confirmButtonText: 'Yes, I have more tasks',
    denyButtonText: 'No, show my tasks',
  }).then((result) => {
    if (result.isConfirmed) {
      addTaskPage();
    }
    else {
      loadTasks(tasks);
    }
  });
}

window.addAnotherTask = addAnotherTask;

function clearTaskWindow (taskInfo) {
  let first = taskInfo.firstElementChild;
  while (first) {
    first.remove();
    first = taskInfo.firstElementChild;
  }
}

window.clearTaskWindow = clearTaskWindow;

// below function executes various functions that are required whenever a new task is added

function manageTasks () {
  addTask();
  createProject();
  generateLayout();
  addAnotherTask();
}

window.manageTasks = manageTasks;

function displayTask (task, edit = false) {
  const taskInfo = document.getElementById('task-info');
  clearTaskWindow(taskInfo);

  const taskHeader = document.createElement('h1');
  taskHeader.appendChild(document.createTextNode(`${task.name}`));
  taskHeader.style.gridRow = '1';

  const taskData = document.createElement('div');
  taskData.style.gridRow = '2';
  taskData.setAttribute('class', 'task-data');

  let today = format(new Date(), 'yyyy-MM-dd');
  let parsedDate = parse(`${task.dueDate}`, 'yyyy-MM-dd', new Date());

  if (task.priority !== 'none') {
    if (compareAsc(parsedDate, parseISO(today)) < 0) {
      taskData.classList.add('task-overdue');
    }
    else if (isThisWeek(parsedDate) && (compareAsc(parsedDate, parseISO(today)) >= 0)) {
      taskData.classList.add('task-soon');
    }
  }

  taskInfo.appendChild(taskHeader);
  taskInfo.appendChild(taskData);

  const taskDueDate = document.createElement('div');
  const taskDueDateText = document.createElement('div');
  taskDueDateText.appendChild(document.createTextNode(`${task.dueDate}`));
  taskDueDate.innerHTML = `Due: `;
  taskDueDate.appendChild(taskDueDateText);
  taskDueDateText.setAttribute('class', 'task-date');

  const taskPriority = document.createElement('div');
  const taskPriorityText = document.createElement('div');
  taskPriorityText.appendChild(document.createTextNode(`${task.priority}`));
  taskPriority.innerHTML = `Priority: `;
  taskPriority.appendChild(taskPriorityText);
  taskPriorityText.setAttribute('class', 'task-priority');

  const taskDescription = document.createElement('div');
  const taskDescriptionText = document.createElement('div');
  taskDescriptionText.appendChild(document.createTextNode(`${task.description}`));
  taskDescription.innerHTML = ` Description: `;
  taskDescription.appendChild(taskDescriptionText);
  taskDescriptionText.setAttribute('class', 'task-description');

  if (edit) {
    taskDueDateText.setAttribute('contenteditable', true);
    taskPriorityText.setAttribute('contenteditable', true);
    taskDescriptionText.setAttribute('contenteditable', true);
  }

  const taskFooter = document.createElement('div');

  const taskDelete = document.createElement('div');
  taskDelete.innerHTML = '<i class = "material-icons delete-icon">delete</i>';
  taskDelete.classList.add('delete-icon');

  const taskEdit = document.createElement('div');
  taskEdit.classList.add('modify-icon');

  taskEdit.innerHTML = (edit ? '<i class="material-icons save-icon">save</i>' : '<i class = "material-icons edit-icon">edit</i>');

  taskFooter.appendChild(taskEdit);
  taskFooter.appendChild(taskDelete);
  taskFooter.classList.add('task-footer');

  taskDelete.addEventListener('click', () => {
    Swal.fire({
      title: 'Are you sure you want to delete this task?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(task);
        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        )
        generateLayout();
        loadTasks(tasks);
      }
    })
  });

  if (!edit) {  // if task is not editable create funciton to make editable version
    taskEdit.addEventListener('click', () => {
      Swal.fire({
        title: 'Edit Info',
        text: "Would you like to edit this task's information?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I have changes!'
      }).then((result) => {
        if (result.isConfirmed) {
          displayTask(task, true);
        }
      })
    });
  }
  else {  // if task is being edited make it possible to save the changes
    taskEdit.addEventListener('click', () => {
      Swal.fire({
        title: 'Save info',
        text: "Would you like to update this task's information?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          task.priority = taskPriorityText.textContent;
          task.description = taskDescriptionText.textContent;
          task.dueDate = taskDueDateText.textContent;
          displayTask(task);
        }
      })
    })
  }
  
  taskData.appendChild(taskDueDate);
  taskData.appendChild(taskPriority);
  taskData.appendChild(taskDescription);
  taskData.appendChild(taskFooter);
}