import { AbstractVehicle, IVehicle, VeichleProps } from "./AbstractVehicle";

export class Bicycle extends AbstractVehicle implements IVehicle {
  constructor({ name, speed, vId }: VeichleProps) {
    super({ name, speed, vId });
  }
  public accelerate(): void {
    this.speed += 5;
    console.log(`${this.name} is accelerating to ${this.speed} km/h`);
  }

  public decelerate(): void {
    this.speed -= 5;
    console.log(`${this.name} is deaccelerating to ${this.speed} km/h`);
  }
}
