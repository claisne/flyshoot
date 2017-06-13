
extern crate ws;
extern crate time;

use std::convert::Into;

use vector::Vector3;
use object::Object3D;
use input::Input;
use command::Client;

const LIFE_START: u32 = 5;

const TARGET_MAX_DISTANCE: f32 = 5000.;
const TARGET_MAX_SPREAD: f32 = 100.;

pub enum ConnectionState {
    Connected,
    Opened,
    Error,
}

pub struct Player {
    pub id: u32,

    sender: ws::Sender,
    pub connection_state: ConnectionState,

    pub ping_sent_time_ns: Option<u64>,
    pub ping_millis: Option<f32>,

    pub input: Input,
    pub object: Object3D,

    pub life: u32,
    pub target_id: u32,
    pub target_distance: f32,
    pub target_ticks: u32,
}

impl Player {
    pub fn new(id: u32, sender: ws::Sender) -> Player {
        Player {
            id: id,

            sender: sender,
            connection_state: ConnectionState::Connected,

            ping_sent_time_ns: None,
            ping_millis: None,

            input: Input::default(),
            object: Object3D::new(),

            life: LIFE_START,
            target_id: 0,
            target_distance: 0.,
            target_ticks: 0,
        }
    }

    pub fn send<M>(&mut self, message: M)
        where M: Into<ws::Message> {
        if self.sender.send(message).is_err() {
            self.close()
        }
    }

    pub fn ping(&mut self) {
        if self.ping_sent_time_ns.is_some() {
            self.close()
        } else {
            self.ping_sent_time_ns = Some(time::precise_time_ns());

            if self.sender.ping(Vec::new()).is_err() {
                self.close()
            }
        }
    }

    pub fn close(&mut self) {
        if self.sender.close(ws::CloseCode::Protocol).is_err() {
            self.connection_state = ConnectionState::Error;
        }
    }

    pub fn process_pong(&mut self) {
        let ping_received_time_ns = time::precise_time_ns();
        if let Some(time_ns) = self.ping_sent_time_ns {
            let millis = ((ping_received_time_ns - time_ns) as f32) / 1_000_000.;
            self.ping_millis = Some(millis);
            self.ping_sent_time_ns = None;
        } else {
            self.close();
        }
    }

    pub fn process_command(&mut self, command: Client) {
        match command {
            Client::SetInput(input) => self.process_set_input(input),
        }
    }

    fn process_set_input(&mut self, input: Input) {
        self.input = input;
    }

    pub fn update_object(&mut self, dt: f32) {
        self.object.update(dt, &self.input);
    }

    // A + at = B + b
    // a.b = 0
    // BA + at = b
    // BA.a + a.a t = 0
    // t = AB.a / a.a
    // b = (BA + at)
    pub fn update_target(&mut self, other: &Player) {
        let direction = self.object.world_direction();
        let self_to_other = other.object.position - self.object.position;
        let other_to_self = self.object.position - other.object.position;
        let target_distance = Vector3::dot(&self_to_other, &direction);
        let target_spread = other_to_self + (direction * target_distance);

        if target_distance > 0. && target_distance <= TARGET_MAX_DISTANCE &&
            target_spread.length() <= TARGET_MAX_SPREAD {
                if self.target_id == 0 || target_distance < self.target_distance {
                    self.target_id = other.id;
                    self.target_distance = target_distance;
                    self.target_ticks = 0;
                } else if self.target_id == other.id {
                    self.target_ticks += 1;
                }
        }
    }
}
