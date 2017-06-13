
use input::Input;
use vector::Vector3;
use quaternion::Quaternion;

#[derive(Debug, PartialEq, Copy, Clone)]
pub struct Object3D {
    pub position: Vector3,
    pub quaternion: Quaternion,
}

impl Object3D {
    pub fn new() -> Object3D {
        Object3D {
            position: Vector3::new(),
            quaternion: Quaternion::new(),
        }
    }

    pub fn update(&mut self, dt: f32, input: &Input) {
        self.update_position(dt);
        self.update_rotation(dt, input);
    }

    fn update_position(&mut self, dt: f32) {
        let mut d = self.world_direction();
        d.multiply_scalar(1. * dt);
        self.position.add(d);
    }

    fn update_rotation(&mut self, dt: f32, input: &Input) {
        self.rotate_on_x(input.pitch() * 0.0004 * dt);
        self.rotate_on_z(input.roll() * 0.001 * dt);
    }

    pub fn world_direction(&self) -> Vector3 {
        let mut vec = Vector3::with_coord(0., 0., 1.);
        vec.apply_quaternion(self.quaternion);
        vec
    }

    pub fn rotate_on_x(&mut self, angle: f32) {
        self.rotate_on_axis(Vector3::new_unit_x(), angle);
    }

    pub fn rotate_on_z(&mut self, angle: f32) {
        self.rotate_on_axis(Vector3::new_unit_z(), angle);
    }

    pub fn rotate_on_axis(&mut self, axis: Vector3, angle: f32) {
        let quaternion = Quaternion::with_axis_angle(axis, angle);
        self.quaternion.multiply(quaternion);
    }
}

mod test {
    #[test]
    fn rotation() {
        let mut o = Object3D::new();
        o.rotate_on_x(f32::consts::FRAC_PI_2);
        assert!((o.quaternion.w - 0.707106).abs() < 0.001);
        assert!((o.quaternion.x - 0.707106).abs() < 0.001);
        o.rotate_on_z(f32::consts::FRAC_PI_4);
        assert!((o.quaternion.w - 0.653).abs() < 0.001);
        assert!((o.quaternion.x - 0.653).abs() < 0.001);
        assert!((o.quaternion.y + 0.2705).abs() < 0.001);
        assert!((o.quaternion.z - 0.2705).abs() < 0.001);
    }
}
