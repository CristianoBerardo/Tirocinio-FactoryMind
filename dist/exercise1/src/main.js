"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bicycle_1 = require("./Bicycle");
const Car_1 = require("./Car");
console.log("Exercise 1:\n");
const bicycle = new Bicycle_1.Bicycle("Mountain Bike", 20);
bicycle.move();
bicycle.accelerate();
bicycle.move();
bicycle.decelerate();
console.log("\n");
const car = new Car_1.Car("Fiat", 20);
car.move();
car.accelerate();
car.move();
car.decelerate();
//# sourceMappingURL=main.js.map