interface MouseObject {
  x: number;
  y: number;
}

class Sketch {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  _isDrawing: boolean;
  _mouse: MouseObject;
  _color: string;
  _lineWidth: number;
  _drawingType: string;

  constructor(container: string) {
    this.canvas = document.getElementById(container) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this._isDrawing = false;
    this._color = '#000000';
    this._lineWidth = 10;
    this.addEventListeners();
  }

  private addEventListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
    // Mouse
    this.canvas.addEventListener('mousedown', (e) => this.handleMousedown(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this._isDrawing = false);
    this.canvas.addEventListener('mouseleave', () => this._isDrawing = false);
    // Touchscreen
    this.canvas.addEventListener('touchstart', (e) => this.handleMousedown(e));
    this.canvas.addEventListener('touchmove', (e) => this.draw(e));
    this.canvas.addEventListener('touchend', () => this._isDrawing = false);
    this.canvas.addEventListener('touchcancel', () => this._isDrawing = false);
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
    this.ctx.strokeStyle = this._color;
    this.ctx.lineWidth = this._lineWidth;
    this.ctx.globalCompositeOperation = this._drawingType;
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
    this._isDrawing = true;
    this._mouse = this.getEventLocation(e);
    this.draw(e);
  }

  private draw(e: MouseEvent | TouchEvent): any {
    if (!this._isDrawing) {
      return false;
    }

    const pos = this.getEventLocation(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this._mouse.x, this._mouse.y);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this._mouse = { x: pos.x, y: pos.y };
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

  set color(color: string) {
    this._color = color;
    this.ctx.strokeStyle = color;
  }

  public set lineWidth(lineWidth: number) {
    this._lineWidth = lineWidth;
    this.ctx.lineWidth = lineWidth;
  }

  public set drawingType(type: string) {
    const drawingType = type === 'pencil' ? 'source-over' : 'destination-out';
    this.ctx.globalCompositeOperation = drawingType;
    this._drawingType = drawingType;
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
