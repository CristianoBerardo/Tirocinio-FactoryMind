export interface IVehicle {
  decelerate(): void;
}

export interface VeichleProps {
  name: string;
  speed: number;
  vId: number;
}

export abstract class AbstractVehicle {
  protected speed: number;
  protected readonly name: string;
  protected readonly vId: number;

  constructor({ name, speed, vId }: VeichleProps) {
    this.name = name;
    this.speed = speed;
    this.vId = vId;
  }

  public move(): void {
    console.log(`${this.name} is moving at ${this.speed} km/h`);
  }

  public stop(): void {
    console.log(`${this.name} has stopped`);
    this.speed = 0;
  }

  public getVid(): number {
    return this.vId;
  }

  public print(): void {
    console.log(`Name: ${this.name}, Speed: ${this.speed}, Vid: ${this.vId}`);
  }

  public abstract accelerate(): void;
}
