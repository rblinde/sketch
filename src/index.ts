import Sketch from './Sketch';

const app = new Sketch('canvas');
app.init();

const clearBtn: HTMLElement = document.querySelector('.tool--reset');
clearBtn.addEventListener('click', () => app.clearScreen());

const saveBtn: HTMLLinkElement = document.querySelector('.tool--save');
saveBtn.addEventListener('click', () => app.saveAsImage());
