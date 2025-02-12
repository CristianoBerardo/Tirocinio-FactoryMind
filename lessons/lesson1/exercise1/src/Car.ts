import { AbstractVehicle, IVehicle } from "./AbstractVehicle";

export class Car extends AbstractVehicle implements IVehicle {
  constructor(name: string, speed: number) {
    super(name, speed);
  }
  public accelerate(): void {
    this.speed += 10;
    console.log(`${this.name} is accelerating to ${this.speed} km/h`);
  }
  public decelerate(): void {
    this.speed -= 10;
    console.log(`${this.name} is deaccelerating to ${this.speed} km/h`);
  }
}
