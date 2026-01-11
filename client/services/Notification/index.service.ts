import constants from "@/constants";

export class NofiticationService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}

  public async get() {
    try {
      const data = await fetch(`${this.server}/${this.version}/notifications`, {
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

  public async read(id: number) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (data.status == 403) {
        return {
          logout: true,
        };
      }
      const res = await data.json();
      if (res?.statusCode == 403) {
        return {
          logout: true,
        };
      }
      console.log(res);
      return {
        logout: false,
        message: Array.isArray(res?.message) ? res?.message[0] : res?.message,
        data: res,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Erro ao eliminar",
      };
    }
  }
}
