import { Bicycle } from "./Bicycle";
import { Car } from "./Car";

console.log("Exercise 1:\n");

const bicycle = new Bicycle("Mountain Bike", 20);
bicycle.move();
bicycle.accelerate();
bicycle.move();
bicycle.decelerate();

console.log("\n");

const car = new Car("Fiat", 20);
car.move();
car.accelerate();
car.move();
car.decelerate();
