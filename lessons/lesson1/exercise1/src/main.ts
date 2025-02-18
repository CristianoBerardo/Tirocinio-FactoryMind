import { Bicycle } from "./Bicycle";
import { Car } from "./Car";
import { CreateVehicleFactory } from "./CreateVehicleFactory";
import { VehicleRepository } from "./VehicleRepository";

console.log("Exercise 1:\n");

const bicycle = new Bicycle({
  name: "Mountain Bike",
  speed: 20,
  vId: Math.round(Math.random() * 1000),
});
bicycle.move();
bicycle.accelerate();
bicycle.move();
bicycle.decelerate();

console.log("\n");

const car = new Car({
  name: "Toyota",
  speed: 60,
  vId: Math.round(Math.random() * 1000),
});
car.move();
car.accelerate();
car.move();
car.decelerate();

console.log("\nPattern Factory:\n");

const factory = new CreateVehicleFactory();
const bicycleFactory = factory.createVehicle({
  type: "Bicycle",
  name: "Mountain Bike",
  speed: 20,
  vId: Math.round(Math.random() * 1000),
});

bicycleFactory.accelerate();

console.log("\nPattern Repository:\n");

const vehicleRepository = new VehicleRepository();

vehicleRepository.addVehicle(bicycle);
vehicleRepository.addVehicle(car);
vehicleRepository.addVehicle(bicycleFactory);

let vehicles = vehicleRepository.getAllVehicles();

console.log("All vehicles:");
vehicles.forEach((vehicle) => {
  vehicle.print();
});

const abstractVehicle = vehicleRepository.getVehicleById(bicycle.getVid());

abstractVehicle.move();

vehicleRepository.deleteVehicleById(bicycle.getVid());

vehicles = vehicleRepository.getAllVehicles();

console.log("\nAll vehicles after deleting one:");
vehicles.forEach((vehicle) => {
  vehicle.print();
});
