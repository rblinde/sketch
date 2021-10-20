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
  drawingType: string;

  constructor(container: string) {
    this.canvas = document.getElementById(container) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.color = '#000000';
    this.lineWidth = 10;
    this.addEventListeners();
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
    this.ctx.putImageData(tempData, 0, 0);
    // Reset default settings, ctx resets after resize
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.globalCompositeOperation = this.drawingType;
  }

  private getEventLocation(e: MouseEvent | TouchEvent): MouseObject {
    if (e instanceof MouseEvent) {
      return {
        x: e.clientX,
        y: e.clientY,
      };
    }

    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  private handleMousedown(e: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    this.mouse = this.getEventLocation(e);
    this.draw(e);
  }

  private draw(e: MouseEvent | TouchEvent): any {
    if (!this.isDrawing) {
      return false;
    }

    const pos = this.getEventLocation(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouse.x, this.mouse.y);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.mouse = { x: pos.x, y: pos.y };
  }

  private canvasToImage(): string {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const tempData = this.ctx.getImageData(0, 0, w, h);
    const compositeOperation = this.ctx.globalCompositeOperation;
    // Create white background
    this.ctx.globalCompositeOperation = 'destination-over';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, w, h);
    const imageData = this.canvas.toDataURL();
    // Reset canvas to old values
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.putImageData(tempData, 0, 0);
    this.ctx.globalCompositeOperation = compositeOperation;

    return imageData;
  }

  public init(): void {
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

  public setDrawingType(type: string): void {
    const drawingType = type === 'pencil' ? 'source-over' : 'destination-out';
    this.ctx.globalCompositeOperation = drawingType;
    this.drawingType = drawingType;
  }

  public clearScreen(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public saveAsImage(): void {
    const downloadLink: HTMLElement = document.createElement('a');
    downloadLink.setAttribute('download', 'sketch.png');
    downloadLink.setAttribute('href', this.canvasToImage());
    downloadLink.click();
  }
}

export default Sketch;
