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

const sizeBtn: HTMLElement = document.querySelector('.tool--size');
const sizesElem: HTMLElement = document.querySelector('.sizes');
sizeBtn.addEventListener('click', () => sizesElem.classList.toggle('open'));

const sizeElems: Array<Element> = [...document.querySelectorAll('.size')];
sizeElems.forEach(elem => elem.addEventListener('click', (e: Event): void => {
  const target: HTMLElement = e.target as HTMLElement;
  const size: number = parseInt(target.dataset.size);

  for (const elem of sizeElems) {
    elem.classList.remove('selected');
  }

  target.classList.add('selected');
  sizesElem.classList.toggle('open');
  app.setSize(size);
}));

const gridBtn: HTMLElement = document.querySelector('.tool--grid');
gridBtn.addEventListener('click', () => {
  document.body.classList.toggle('grid');
  gridBtn.classList.toggle('active');
});

const drawingTypeBtns: Array<Element> = [...document.querySelectorAll('.tool--pencil, .tool--eraser')];
drawingTypeBtns.forEach(elem => elem.addEventListener('click', (e: Event): void => {
  const target: HTMLElement = (e.target as HTMLElement).closest('.tool');
  drawingTypeBtns.forEach(btn => btn.classList.toggle('active'));
  app.setDrawingType(target.dataset.type);
}));
