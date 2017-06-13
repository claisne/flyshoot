
extern crate ws;

use std::sync::mpsc;

use event::Event;

#[derive(Clone)]
pub struct Hand {
    pub id: u32,
    event_sender: mpsc::Sender<Event>,

    ping_timeout: Option<ws::util::Timeout>,
}

impl Hand {
    pub fn new(id: u32, event_sender: mpsc::Sender<Event>) -> Hand {
        Hand {
            id: id,
            event_sender: event_sender,

            ping_timeout: None,
        }
    }
}

impl ws::Handler for Hand {
    fn on_open(&mut self, _: ws::Handshake) -> ws::Result<()> {
        self.event_sender.send(Event::ConnectionOpened(self.id)).unwrap();
        Ok(())
    }

    fn on_message(&mut self, message: ws::Message) -> ws::Result<()> {
        use ws::{Message};
        use command::deserialize;

        match message {
            Message::Binary(bin) => {
                match deserialize(&bin) {
                    Ok(command) =>
                        self.event_sender.send(Event::Command(self.id, command)).unwrap(),
                    Err(_) =>
                        self.event_sender.send(Event::CloseConnection(self.id)).unwrap(),
                }
            }
            _ => self.event_sender.send(Event::CloseConnection(self.id)).unwrap(),
        };

        Ok(())
    }

    fn on_close(&mut self, _: ws::CloseCode, _: &str) {
        self.event_sender.send(Event::ConnectionClosed(self.id)).unwrap();
    }

    fn on_frame(&mut self, frame: ws::Frame) -> ws::Result<Option<ws::Frame>> {
        if frame.opcode() == ws::OpCode::Pong {
            self.event_sender.send(Event::Pong(self.id)).unwrap();
        }

        DefaultHandler.on_frame(frame)
    }
}

struct DefaultHandler;
impl ws::Handler for DefaultHandler {}
