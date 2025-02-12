"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVehicle = void 0;
class AbstractVehicle {
    constructor(name, speed) {
        this.name = name;
        this.speed = speed;
    }
    move() {
        console.log(`${this.name} is moving at ${this.speed} km/h`);
    }
    stop() {
        console.log(`${this.name} has stopped`);
        this.speed = 0;
    }
}
exports.AbstractVehicle = AbstractVehicle;
//# sourceMappingURL=AbstractVehicle.js.map