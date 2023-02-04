import './style.css';
import { createTask } from './taskLogic';
import { tasks } from './taskLogic';

import { generateLayout } from './pageManager';
import { loadTasks } from './pageManager';

window.onload = function() {
    generateLayout();
    loadTasks(tasks);
    //createTask();
};