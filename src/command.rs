
extern crate ws;
extern crate byteorder;

use byteorder::{BigEndian, WriteBytesExt};

use input::Input;

// CLIENT
const ID_SET_INPUT: u8 = 0;

// SERVER
const ID_SET_PLAYER_ID: u8 = 0;
pub const ID_SET_PLAYERS: u8 = 1;

#[derive(Debug, Copy, Clone)]
pub enum Client {
    SetInput(Input),
}

#[derive(Debug, Clone)]
pub enum Server {
    SetPlayerId(u32),
}

pub enum Error {
    InvalidId,
    InvalidLength,
}

pub fn deserialize(bin: &[u8]) -> Result<Client, Error> {
    if bin.is_empty() {
      return Err(Error::InvalidLength);
    }

    let command_id = bin[0];
    match command_id {
        ID_SET_INPUT => deserialize_input(bin),
        _ => Err(Error::InvalidId)
    }
}

fn deserialize_input(buf: &[u8]) -> Result<Client, Error> {
    if buf.len() != 3 {
        Err(Error::InvalidLength)
    } else {
        let id = buf[1];
        let mut input_byte = buf[2];

        let roll_right = input_byte % 2 == 1;
        input_byte >>= 1;

        let roll_left = input_byte % 2 == 1;
        input_byte >>= 1;

        let pitch_down = input_byte % 2 == 1;
        input_byte >>= 1;

        let pitch_up = input_byte % 2 == 1;

        Ok(Client::SetInput(Input::new(id, pitch_up, pitch_down, roll_left, roll_right)))
    }
}

impl Into<ws::Message> for Server {
    fn into(self) -> ws::Message {
        match self {
            Server::SetPlayerId(id) => into_set_player_id(id),
        }
    }
}

fn into_set_player_id(id: u32) -> ws::Message {
    let mut buf: Vec<u8> = Vec::with_capacity(9); 
    buf.write_u8(ID_SET_PLAYER_ID).unwrap();
    buf.write_u32::<BigEndian>(id).unwrap();

    ws::Message::Binary(buf)
}

