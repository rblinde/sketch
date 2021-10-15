import Sketch from './Sketch';

const app = new Sketch('canvas');
app.init();

const clearBtn: HTMLElement = document.querySelector('.tool--reset');
clearBtn.addEventListener('click', () => app.clearScreen());

const saveBtn: HTMLLinkElement = document.querySelector('.tool--save');
saveBtn.addEventListener('click', () => app.saveAsImage());

const swatchBtn: HTMLElement = document.querySelector('.tool--swatch');
const swatchesElem: HTMLElement = document.querySelector('.swatches');
swatchBtn.addEventListener('click', () => swatchesElem.classList.toggle('open'));

const swatchElems: Array<Element> = [...document.querySelectorAll('.swatch')];
swatchElems.forEach(elem => elem.addEventListener('click', (e: Event): void => {
  const color: string = (e.target as HTMLElement).dataset.color;
  swatchesElem.classList.toggle('open');
  swatchBtn.querySelector('svg').style.fill = color;
  app.setColor(color);
}));
