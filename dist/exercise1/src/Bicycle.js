"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bicycle = void 0;
const AbstractVehicle_1 = require("./AbstractVehicle");
class Bicycle extends AbstractVehicle_1.AbstractVehicle {
    constructor(name, speed) {
        super(name, speed);
    }
    accelerate() {
        this.speed += 5;
        console.log(`${this.name} is accelerating to ${this.speed} km/h`);
    }
    decelerate() {
        this.speed -= 5;
        console.log(`${this.name} is deaccelerating to ${this.speed} km/h`);
    }
}
exports.Bicycle = Bicycle;
//# sourceMappingURL=Bicycle.js.map