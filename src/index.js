import './style.css';
import createTask from './taskLogic';
import generateLayout from './pageManager';

window.onload = function() {
    generateLayout();
    createTask();
};