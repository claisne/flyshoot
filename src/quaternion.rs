
use vector::Vector3;

#[derive(Debug, PartialEq, Copy, Clone)]
pub struct Quaternion {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub w: f32,
}

impl Quaternion {
    pub fn new() -> Quaternion {
        Quaternion {
            x: 0.,
            y: 0.,
            z: 0.,
            w: 1.,
        }
    }

    pub fn with_axis_angle(axis: Vector3, angle: f32) -> Quaternion {
        let half_angle = angle / 2.;
        let s = half_angle.sin();

        Quaternion {
            x: axis.x * s,
            y: axis.y * s,
            z: axis.z * s,
            w: half_angle.cos(),
        }
    }

    pub fn multiply(&mut self, quaternion: Quaternion) {
        let qax = self.x;
        let qay = self.y;
        let qaz = self.z;
        let qaw = self.w;

		let qbx = quaternion.x;
        let qby = quaternion.y;
        let qbz = quaternion.z;
        let qbw = quaternion.w;

		self.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		self.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		self.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		self.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    }
}
