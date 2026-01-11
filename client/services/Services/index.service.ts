import constants from "@/constants";
import { IServiceCreate } from "@/types/interfaces";

export class ServicesService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}
  public async get() {
    try {
      const data = await fetch(`${this.server}/${this.version}/services`, {
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
        data: res?.data,
      };
    } catch (error) {
      return {
        logout: false,
      };
    }
  }
  public async create(body: IServiceCreate) {
    try {
      const data = await fetch(`${this.server}/${this.version}/services`, {
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
  public async remove(id: number) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/services/${id}`,
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
  public async update(body: IServiceCreate, id: number) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const res = await data.json();

      if (res?.statusCode == 403) {
        return {
          logout: true,
        };
      }
      return res;
    } catch (error) {
      return {
        logout: false,
      };
    }
  }
}
