import { AbstractVehicle } from "./AbstractVehicle";

export class VehicleRepository {
  private vehicles: Map<number, AbstractVehicle> = new Map();

  public addVehicle(vehicle: AbstractVehicle): void {
    this.vehicles.set(vehicle.getVid(), vehicle);
  }

  public getVehicleById(vId: number): AbstractVehicle {
    return this.vehicles.get(vId);
  }

  public deleteVehicleById(vId: number): void {
    this.vehicles.delete(vId);
  }

  public getAllVehicles(): AbstractVehicle[] {
    return Array.from(this.vehicles.values());
  }
}
