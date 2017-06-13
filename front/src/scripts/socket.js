
import * as Commands from 'scripts/commands';

class Socket {
  constructor(url) {
    this.websocket = new WebSocket(url);
    this.websocket.binaryType = 'arraybuffer';
    this.websocket.onmessage = this.onMessage.bind(this);

    // this.send = _.throttle(this.send, 1000 / 25);
  }

  onConnect(cb) {
    this.websocket.onopen = cb;
  }

  onMessage(message) {
    const command = Commands.deserialize(message.data);
    this.main.handleCommand(command);
  }

  setMain(main) {
    this.main = main;
  }

  send(data) {
    // setTimeout(() => {
    this.websocket.send(data);
    // }, 200);
  }

  sendInput(input) {
    this.send(Commands.serializeInput(input));
  }
}

export default Socket;
