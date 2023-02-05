
import Swal from 'sweetalert2';

export function generateLayout() {
  console.log('Generating a page!');
  const content = document.getElementById('content');

  const sideBar = document.createElement('div');
  sideBar.setAttribute('id', 'side-bar');
  const filterTabs = document.createElement('div');
  filterTabs.setAttribute('id', 'filter-tabs');
  const taskList = document.createElement('div');
  taskList.setAttribute('id', 'task-list');

  sideBar.appendChild(filterTabs);
  sideBar.appendChild(taskList);

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

}

function filterListeners (filter) {
  let tab = document.getElementById(`${filter.replace(/\s/g, "-")}`);
  tab.addEventListener('click', () => console.log(`You clicked on ${filter}`));
}

export function loadTasks (tasks) {
  console.log('I am loading tasks!');
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
    return;
  }
  const taskInfo = document.getElementById('task-info');
}

function addTaskPage () {
  console.log("Let's add one!");
  const taskInfo = document.getElementById('task-info');

  const taskHeader = document.createElement('h1');
  taskHeader.appendChild(document.createTextNode('Complete this form to add a new task'));

  const taskForm = document.createElement('form');
  taskForm.setAttribute('id', 'taskForm');
  taskForm.setAttribute('onSubmit', 'event.preventDefault() & addTask()');

  taskInfo.appendChild(taskHeader);
  taskInfo.appendChild(taskForm);

  for (let i = 0; i < 5; i++) {
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

  taskForm.childNodes[1].appendChild(titleLabel);
  taskForm.childNodes[1].appendChild(titleInput);

  taskForm.childNodes[2].appendChild(dueDateLabel);
  taskForm.childNodes[2].appendChild(dueDateInput);

  taskForm.childNodes[3].appendChild(priorityLabel);
  taskForm.childNodes[3].appendChild(priorityInput);

  taskForm.childNodes[4].appendChild(descriptionLabel);
  taskForm.childNodes[4].appendChild(descriptionInput);
}