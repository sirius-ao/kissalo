import constants from "@/constants";
import { BookingPriority, ServiceLocation } from "@/types/enum";

export interface Address {
  street: string;
  city: string;
  country: string;
}

export interface ServiceSchedule {
  serviceId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  location: ServiceLocation;
  address: Address;
  priority: BookingPriority;
}
export class BookingService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}
  public async get() {
    try {
      const data = await fetch(`${this.server}/${this.version}/bookings`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${this.token}`,
        },
      });
      const res = await data.json();

      if (res?.statusCode == 403) {
        return {
          logout: true,
        };
      }
      return {
        logout: false,
        data: res,
      };
    } catch (error) {
      return {
        logout: false,
      };
    }
  }
  public async create(body: ServiceSchedule) {
    try {
      const data = await fetch(`${this.server}/${this.version}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });
      const res = await data.json();
      if (res?.statusCode == 403) {
        return {
          logout: true,
        };
      }
      return {
        logout: false,
        message: Array.isArray(res?.message) ? res?.message[0] : res?.message,
        data: res,
      };
    } catch (error) {
      return {
        logout: false,
      };
    }
  }
  public createStep() {}
  public getById() {}
  public toogle() {}
}
