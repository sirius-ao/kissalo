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
}
