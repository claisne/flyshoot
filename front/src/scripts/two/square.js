
import Object2D from 'scripts/two/object';

class Square extends Object2D {
  constructor(x, y, size) {
    super(x, y);
    this.size = size;
  }

  render(context) {
    context.beginPath();
    context.lineWidth = '1';
    context.strokeStyle = '#000';
    context.rect(this.x, this.y, this.size, this.size);
    context.stroke();
  }
}

export default Square;
