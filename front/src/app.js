import Main from 'scripts/main';
import Socket from 'scripts/socket';

const socket = new Socket('ws:/localhost:8081');

socket.onConnect(() => {
  const main = new Main();
  main.setSocket(socket);
  socket.setMain(main);
  main.animate();
});
