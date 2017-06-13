
extern crate ws;

use command;

pub enum Event {
    ConnectionMade(u32, ws::Sender),
    ConnectionOpened(u32),
    ConnectionClosed(u32),
    CloseConnection(u32),
    Pong(u32),
    Command(u32, command::Client),
}

