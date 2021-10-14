class Sketch {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(container: string) {
    this.canvas = document.getElementById(container) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
  }

  init(): void {
    this.addEventListeners();
    this.handleResize();
  }

  addEventListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export default Sketch;
