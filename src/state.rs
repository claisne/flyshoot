
extern crate ws;
extern crate byteorder;

use byteorder::{BigEndian, WriteBytesExt};

use std::thread;
use std::sync::mpsc;
use std::collections::HashMap;
use std::time::{Duration, Instant};

use player::{Player, ConnectionState};
use event::Event;

use command;

pub const PING_INTERVAL_TICKS: u32 = 25 * 5;
pub const UPDATE_DURATION_MILLIS: u64 = 1_000 / 25;

pub struct State {
    last_update: Instant,
    event_receiver: mpsc::Receiver<Event>,
    players: HashMap<u32, Player>,

    ping_current_tick: u32,
}

impl State {
    pub fn with_capacity(capacity: usize, event_receiver: mpsc::Receiver<Event>) -> State {
        State {
            last_update: Instant::now(),
            event_receiver: event_receiver,
            players: HashMap::with_capacity(capacity),

            ping_current_tick: 0,
        }
    }

    pub fn process_events(&mut self) {
        while let Ok(event) = self.event_receiver.try_recv() {
            match event {
                Event::ConnectionMade(id, sender) => self.process_connection_made(id, sender),
                Event::ConnectionOpened(id) => self.process_connection_opened(id),
                Event::ConnectionClosed(id) => self.process_connection_closed(id),
                Event::CloseConnection(id) => self.process_close_connection(id),
                Event::Pong(id) => self.process_pong(id),
                Event::Command(id, command) => self.process_command(id, command),
            }
        }
    }

    pub fn process_connection_made(&mut self, id: u32, sender: ws::Sender) {
        let player = Player::new(id, sender);
        self.players.insert(id, player);
    }

    pub fn process_connection_opened(&mut self, id: u32) {
        if let Some(player) = self.players.get_mut(&id) {
            player.connection_state = ConnectionState::Opened;
            player.send(command::Server::SetPlayerId(id));
        }
    }

    pub fn process_connection_closed(&mut self, id: u32) {
        self.players.remove(&id);
    }

    pub fn process_close_connection(&mut self, id: u32) {
        if let Some(player) = self.players.get_mut(&id) {
            player.close();
        }
    }

    pub fn process_pong(&mut self, id: u32) {
        if let Some(player) = self.players.get_mut(&id) {
            player.process_pong();
        }
    }

    pub fn process_command(&mut self, id: u32, command: command::Client) {
        if let Some(player) = self.players.get_mut(&id) {
            player.process_command(command);
        }
    }

    pub fn update(&mut self) {
        let dt = self.millis_from_last_update();

        for player in self.players.values_mut() {
            player.update_object(dt);
        }

        // let players = self.players.values_mut().zip(self.players.values_mut());
        // for (player, other) in players {
        //     if player.id != other.id {
        //         player.update_target(other);
        //     }
        // }

        self.last_update = Instant::now();
    }

    pub fn broadcast(&mut self) {
        self.broadcast_world();
        self.broadcast_ping();
    }

    fn broadcast_world(&mut self) {
        let buf = self.serialize();
        for player in self.players.values_mut() {
            player.send(ws::Message::Binary(buf.clone()));
        }
    }

    fn broadcast_ping(&mut self) {
        if self.ping_current_tick % PING_INTERVAL_TICKS == 0 {
            for player in self.players.values_mut() {
                player.ping();
            }
        }

        self.ping_current_tick += 1;
        self.ping_current_tick %= PING_INTERVAL_TICKS;
    }

    pub fn serialize(&self) -> Vec<u8> {
        let players_len = self.players.len();

        let mut buf = Vec::with_capacity(1 + players_len * (4 * (1 + 3 + 4)) + 4);
        buf.write_u8(command::ID_SET_PLAYERS).unwrap();

        for player in self.players.values() {
            buf.write_u32::<BigEndian>(player.id).unwrap();
            buf.write_u8(player.input.id).unwrap();

            buf.write_f32::<BigEndian>(player.object.position.x).unwrap();
            buf.write_f32::<BigEndian>(player.object.position.y).unwrap();
            buf.write_f32::<BigEndian>(player.object.position.z).unwrap();

            buf.write_f32::<BigEndian>(player.object.quaternion.x).unwrap();
            buf.write_f32::<BigEndian>(player.object.quaternion.y).unwrap();
            buf.write_f32::<BigEndian>(player.object.quaternion.z).unwrap();
            buf.write_f32::<BigEndian>(player.object.quaternion.w).unwrap();
        }

        buf.write_u32::<BigEndian>(0).unwrap();
        buf
    }

    pub fn millis_from_last_update(&self) -> f32 {
        let elapsed = self.last_update.elapsed();
        let secs = elapsed.as_secs() as f32;
        let subsec_nanos = elapsed.subsec_nanos() as f32;

        secs * 1000. + (subsec_nanos / 1_000_000.)
    }

    pub fn sleep(&self) {
        let sleep_duration = Duration::from_millis(UPDATE_DURATION_MILLIS);
        thread::sleep(sleep_duration);
    }
}
