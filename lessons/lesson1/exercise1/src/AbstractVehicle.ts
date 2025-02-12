export interface IVehicle {
  decelerate(): void;
}

export abstract class AbstractVehicle {
  protected speed: number;
  protected readonly name: string;

  constructor(name: string, speed: number) {
    this.name = name;
    this.speed = speed;
  }

  public move(): void {
    console.log(`${this.name} is moving at ${this.speed} km/h`);
  }

  public stop(): void {
    console.log(`${this.name} has stopped`);
    this.speed = 0;
  }

  public abstract accelerate(): void;
}
