interface MouseObject {
  x: number;
  y: number;
}

class Sketch {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isDrawing: boolean;
  mouse: MouseObject;
  color: string;
  lineWidth: number;

  constructor(container: string) {
    this.canvas = document.getElementById(container) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.color = '#000000';
    this.lineWidth = 10;
    this.addEventListeners();
  }

  private createBackground(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private addEventListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
    // Mouse
    this.canvas.addEventListener('mousedown', (e) => this.handleMousedown(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mouseleave', () => this.isDrawing = false);
    // Touchscreen
    this.canvas.addEventListener('touchstart', (e) => this.handleMousedown(e));
    this.canvas.addEventListener('touchmove', (e) => this.draw(e));
    this.canvas.addEventListener('touchend', () => this.isDrawing = false);
    this.canvas.addEventListener('touchcancel', () => this.isDrawing = false);
  }

  private handleResize(): void {
    // Save and load current drawing
    const tempData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createBackground();
    this.ctx.putImageData(tempData, 0, 0);
    // Reset default settings, ctx resets after resize
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
  }

  private getEventLocation(e: MouseEvent | TouchEvent): Touch | MouseEvent {
    if (e instanceof MouseEvent) {
      return e;
    }

    return e.touches[0];
  }

  private handleMousedown(e: MouseEvent | TouchEvent): void {
    const pos = this.getEventLocation(e);
    this.isDrawing = true;
    this.mouse = { x: pos.clientX, y: pos.clientY };
    this.draw(e);
  }

  private draw(e: MouseEvent | TouchEvent): any {
    if (!this.isDrawing) {
      return false;
    }

    const pos = this.getEventLocation(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouse.x, this.mouse.y);
    this.ctx.lineTo(pos.clientX, pos.clientY);
    this.ctx.stroke();
    this.mouse = { x: pos.clientX, y: pos.clientY };
  }

  public init(): void {
    this.createBackground();
    this.handleResize();
  }

  public setColor(color: string): void {
    this.color = color;
    this.ctx.strokeStyle = color;
  }

  public setSize(size: number): void {
    this.lineWidth = size;
    this.ctx.lineWidth = size;
  }

  public clearScreen(): void {
    this.createBackground();
  }

  public saveAsImage(): void {
    const downloadLink: HTMLElement = document.createElement('a');
    downloadLink.setAttribute('download', 'sketch.png');
    this.canvas.toBlob(blob => {
      downloadLink.setAttribute('href', URL.createObjectURL(blob));
      downloadLink.click();
    });
  }
}

export default Sketch;
