import constants from "@/constants";

interface ICreateCtegory {
  title: string;
  description: string;
  color: string;
  order: number;
}
export class UsersService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}

  public async get() {
    try {
      const [profissionalRes, clientRes] = await Promise.all([
        fetch(`${this.server}/${this.version}/profissionals`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }),
        fetch(`${this.server}/${this.version}/clients`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }),
      ]);

      if (profissionalRes.status === 403 || clientRes.status === 403) {
        return { logout: true };
      }

      const [profissionals, clients] = await Promise.all([
        profissionalRes.json(),
        clientRes.json(),
      ]);

      return {
        profissionals: profissionals?.data ?? [],
        clients: clients?.data ?? [],
      };
    } catch (error) {
      return { logout: true };
    }
  }

  public async create(body: ICreateCtegory) {
    if (!body.color || !body.title || !body.description) {
      return {
        message: "Preenche todos os dados",
      };
    }
    try {
      const data = await fetch(`${this.server}/${this.version}/categories`, {
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
  public async update(body: ICreateCtegory, id: number) {
    if (!body.color || !body.title || !body.description) {
      return {
        message: "Preenche todos os dados",
      };
    }
    try {
      const data = await fetch(
        `${this.server}/${this.version}/categories/${id}`,
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
