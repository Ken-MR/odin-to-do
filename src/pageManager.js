
export default function generateLayout() {
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