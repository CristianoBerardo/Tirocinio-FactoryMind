"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const AbstractVehicle_1 = require("./AbstractVehicle");
class Car extends AbstractVehicle_1.AbstractVehicle {
    constructor(name, speed) {
        super(name, speed);
    }
    accelerate() {
        this.speed += 10;
        console.log(`${this.name} is accelerating to ${this.speed} km/h`);
    }
    decelerate() {
        this.speed -= 10;
        console.log(`${this.name} is deaccelerating to ${this.speed} km/h`);
    }
}
exports.Car = Car;
//# sourceMappingURL=Car.js.map