
use quaternion::Quaternion;

use std::ops::{Add, Sub, Mul, Div};

#[derive(Debug, PartialEq, Copy, Clone)]
pub struct Vector3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

impl Vector3 {
    pub fn new() -> Vector3 {
        Vector3 {
            x: 0.,
            y: 0.,
            z: 0.,
        }
    }

    pub fn new_unit_x() -> Vector3 {
        Vector3 {
            x: 1.,
            y: 0.,
            z: 0.,
        }
    }

    pub fn new_unit_z() -> Vector3 {
        Vector3 {
            x: 0.,
            y: 0.,
            z: 1.,
        }
    }

    pub fn with_coord(x: f32, y: f32, z: f32) -> Vector3 {
        Vector3 {
            x: x,
            y: y,
            z: z,
        }
    }

    pub fn length(&self) -> f32 {
        ((self.x * self.x) + (self.y * self.y) + (self.z + self.z)).sqrt()
    }

    pub fn add(&mut self, vec: Vector3) {
        self.x += vec.x;
        self.y += vec.y;
        self.z += vec.z;
    }

    pub fn multiply_scalar(&mut self, s: f32) {
        self.x *= s;
        self.y *= s;
        self.z *= s;
    }

    pub fn apply_quaternion(&mut self, quaternion: Quaternion) {
		let x = self.x;
        let y = self.y;
        let z = self.z;

		let qx = quaternion.x;
        let qy = quaternion.y;
        let qz = quaternion.z;
        let qw = quaternion.w;

		// Compute quat * vector
		let ix =  qw * x + qy * z - qz * y;
		let iy =  qw * y + qz * x - qx * z;
		let iz =  qw * z + qx * y - qy * x;
		let iw = - qx * x - qy * y - qz * z;

		// Compute result * inverse quat
		self.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		self.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		self.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
    }

    pub fn dot(a: &Vector3, b: &Vector3) -> f32 {
        (a.x * b.x) + (a.y * b.y) + (a.z * b.z)
    }
}

impl Add for Vector3 {
    type Output = Vector3;

    fn add(self, other: Vector3) -> Vector3 {
        Vector3 {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

impl Mul<f32> for Vector3 {
    type Output = Vector3;

    fn mul(self, other: f32) -> Vector3 {
        Vector3 {
            x: self.x * other,
            y: self.y * other,
            z: self.z * other,
        }
    }
}

impl Div<f32> for Vector3 {
    type Output = Vector3;

    fn div(self, other: f32) -> Vector3 {
        Vector3 {
            x: self.x / other,
            y: self.y / other,
            z: self.z / other,
        }
    }
}

impl Sub for Vector3 {
    type Output = Vector3;

    fn sub(self, other: Vector3) -> Vector3 {
        Vector3 {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}
