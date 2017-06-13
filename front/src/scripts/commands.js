
const ID_SET_INPUT = 0;

export const SET_PLAYER_ID = 'SET_PLAYER_ID';
export const SET_PLAYERS = 'SET_PLAYERS';

export function serializeInput(input) {
  const buffer = new ArrayBuffer(3);
  const view = new DataView(buffer);

  view.setUint8(0, ID_SET_INPUT);
  view.setUint8(1, input.id);

  let byte = input.pitch.up ? 1 : 0;
  byte <<= 1;
  byte += input.pitch.down ? 1 : 0;
  byte <<= 1;
  byte += input.roll.left ? 1 : 0;
  byte <<= 1;
  byte += input.roll.right ? 1 : 0;

  view.setUint8(2, byte);

  return buffer;
}

export function deserialize(buffer) {
  const view = new DataView(buffer);
  const commandId = view.getUint8(0);
  if (commandId === 0) {
    const playerId = view.getUint32(1);
    return { type: SET_PLAYER_ID, playerId };
  }

  if (commandId === 1) {
    const players = [];

    let i = 1;
    let id;
    while ((id = view.getUint32(i)) !== 0) {
      const player = { id };

      player.inputId = view.getUint8(i += 4);

      player.position = {
        x: view.getFloat32(i += 1),
        y: view.getFloat32(i += 4),
        z: view.getFloat32(i += 4),
      };

      player.quaternion = {
        x: view.getFloat32(i += 4),
        y: view.getFloat32(i += 4),
        z: view.getFloat32(i += 4),
        w: view.getFloat32(i += 4),
      };

      players.push(player);
      i += 4;
    }

    return { type: SET_PLAYERS, players };
  }
}
