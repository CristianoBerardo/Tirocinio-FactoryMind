import { Bicycle } from "./Bicycle";
import { Car } from "./Car";

export type VehicleType = "Bicycle" | "Car";

export interface VehicleFactoryProp {
  type: VehicleType;
  name: string;
  speed: number;
  vId: number;
}

export class CreateVehicleFactory {
  public createVehicle({ type, ...params }: VehicleFactoryProp) {
    if (type === "Bicycle") {
      return new Bicycle(params);
    } else if (type === "Car") {
      return new Car(params);
    }
  }
}
