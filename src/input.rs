

#[derive(Debug, Copy, Clone)]
pub struct Input {
    pub id: u8,
    pitch_up: bool,
    pitch_down: bool,
    roll_left: bool,
    roll_right: bool,
}

impl Input {
  pub fn new(id:u8, pitch_up: bool, pitch_down: bool, roll_left: bool, roll_right: bool) -> Input {
    Input {
        id: id,
        pitch_up: pitch_up,
        pitch_down: pitch_down,
        roll_left: roll_left,
        roll_right: roll_right,
    }
  }

  pub fn default() -> Input {
    Input {
        id: 0,
        pitch_up: false,
        pitch_down: false,
        roll_left: false,
        roll_right: false,
    }
  }

  pub fn pitch(&self) -> f32 {
    if self.pitch_up == self.pitch_down {
        return 0.;
    }

    if self.pitch_up {
        return -1.;
    }
    if self.pitch_down {
        return 1.;
    }

    0.
  }

  pub fn roll(&self) -> f32 {
    if self.roll_right == self.roll_left {
        return 0.;
    }

    if self.roll_left {
        return -1.;
    }
    if self.roll_right {
        return 1.;
    }

    0.
  }
}
