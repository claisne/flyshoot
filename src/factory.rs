
extern crate ws;

use std::sync::mpsc;

use handler::Hand;
use event::Event;

pub struct Fact {
    id: u32,
    event_sender: mpsc::Sender<Event>,
}

impl ws::Factory for Fact {
    type Handler = Hand;

    fn connection_made(&mut self, sender: ws::Sender) -> Hand {
        self.id += 1;
        let handler = Hand::new(self.id, self.event_sender.clone());
        self.event_sender.send(Event::ConnectionMade(self.id, sender)).unwrap();

        handler
    }
}

impl Fact {
    pub fn with_capacity(event_sender: mpsc::Sender<Event>) -> Fact {
        Fact {
            id: 0,
            event_sender: event_sender,
        }
    }
}
