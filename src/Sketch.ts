interface MouseObject {
  x: number;
  y: number;
}

class Sketch {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean;
  mouse: MouseObject;
  lineWidth: number;

  constructor(container: string) {
    this.canvas = document.getElementById(container) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.lineWidth = 10;
    this.addEventListeners();
  }

  init(): void {
    this.createBackground();
    this.handleResize();
  }

  createBackground(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addEventListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
    this.canvas.addEventListener('mousedown', (e) => this.handleMousedown(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mouseleave', () => this.isDrawing = false);
  }

  handleResize(): void {
    // Save and load current drawing
    const tempData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.createBackground();
    this.ctx.putImageData(tempData, 0, 0);
    // Reset default settings, ctx resets after resize
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.lineWidth;
  }

  handleMousedown(e: MouseEvent): void {
    this.isDrawing = true;
    this.mouse = { x: e.offsetX, y: e.offsetY };
    this.draw(e);
  }

  draw(e: MouseEvent): any {
    if (!this.isDrawing) {
      return false;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.mouse.x, this.mouse.y);
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
    this.mouse = { x: e.offsetX, y: e.offsetY };
  }

  setColor(color: string): void {
    this.ctx.strokeStyle = color;
  }

  setSize(size: number): void {
    this.lineWidth = size;
    this.ctx.lineWidth = size;
  }

  clearScreen(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveAsImage(): void {
    const downloadLink: HTMLElement = document.createElement('a');
    downloadLink.setAttribute('download', 'image.png');
    this.canvas.toBlob(blob => {
      downloadLink.setAttribute('href', URL.createObjectURL(blob));
      downloadLink.click();
    });
  }
}

export default Sketch;
