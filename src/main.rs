
extern crate ws;
extern crate time;
extern crate byteorder;

mod handler;
mod factory;
mod state;
mod vector;
mod command;
mod player;
mod input;
mod quaternion;
mod object;
mod event;

use std::thread;
use std::sync::mpsc;

use state::State;
use factory::Fact;

static MAX_CONNECTIONS: usize = 100;

fn main() {
    let (event_sender, event_receiver) = mpsc::channel();

    thread::spawn(move || {
        let factory = Fact::with_capacity(event_sender);
        let server = ws::Builder::new()
            .with_settings(ws::Settings {
                max_connections: MAX_CONNECTIONS,
                ..ws::Settings::default()
            })
            .build(factory)
            .unwrap();

        server.listen("localhost:8081").unwrap();
    });

    let mut state = State::with_capacity(MAX_CONNECTIONS, event_receiver);
    loop {
        state.process_events();
        state.update();
        state.broadcast();

        state.sleep();
    }
}

