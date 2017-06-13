
import _ from 'lodash';
import Square from 'scripts/two/square';

class Renderer {
  constructor() {
    this.objects = [];
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement = this.canvas;

    const square = new Square(this.canvas.width / 2, this.canvas.height / 2, 50);
    this.add(square);
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  add(object) {
    this.objects.push(object);
  }

  remove(object) {
    this.objects = _.reject(this.objects, o => o === object);
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.objects.forEach((object) => {
      object.render(this.context);
    });
  }
}

export default Renderer;
