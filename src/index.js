import './style.css';
import { addTask } from './taskLogic';
import { tasks } from './taskLogic';

import { generateLayout } from './pageManager';
import { loadTasks } from './pageManager';

window.onload = function() {
    generateLayout();
    loadTasks(tasks);
};