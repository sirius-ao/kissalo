import constants from "@/constants";

export class PaymentService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}
  public async get() {
    try {
      const data = await fetch(`${this.server}/${this.version}/payments`, {
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
  public async update(id: number, status: "PAID" | "REFUNDED", notes: string) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/payments/${id}/toogle`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
          method: "PATCH",
          body: JSON.stringify({
            notes,
            status,
          }),
        }
      );
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
  public async consolidate(id: number) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/payments/${id}/consolidate`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
          method: "POST",
        }
      );
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
}
