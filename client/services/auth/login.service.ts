import constants from "@/constants";
import { validateEmail } from "@/lib/utils";
import { UserRole } from "@/types/enum";
export class AuthService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";

  public async login(email: string, password: string) {
    const body = JSON.stringify({
      unique: email,
      password: password,
    });
    const data = await fetch(`${this.server}/${this.version}/auth/login`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
    });

    const response = await data.json();
    const message = Array.isArray(response?.message)
      ? response?.message[0]
      : response?.message;

    if (response?.acessToken) {
      return {
        message: "Login efectuado com sucesso",
        user: response?.user,
        token: response?.acessToken,
        error: false,
      };
    }
    return {
      message,
      error: true,
    };
  }
  public async signIn(body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    avatarUrl: string;
    role: UserRole.PROFESSIONAL | UserRole.CUSTOMER;
  }) {
    try {
      const data = await fetch(`${this.server}/${this.version}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const response = await data.json();
      const message = Array.isArray(response?.message)
        ? response?.message[0]
        : response?.message;

      if (response?.acessToken) {
        return {
          message: "Login efectuado com sucesso",
          user: response?.user,
          token: response?.acessToken,
          error: false,
        };
      }
      return {
        message,
        error: true,
      };
    } catch (error) {
      return {
        message: "Erro ao criar conta",
      };
    }
  }

  public async getMe(token: string) {
    if (!token) {
      return {
        message: "Envie o token",
        error: true,
      };
    }
    const data = await fetch(`${this.server}/${this.version}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const response = await data.json();
    return response;
  }

  public async updateProfile(
    token: string,
    body: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      avatarUrl: string;
    }
  ) {
    try {
      const data = await fetch(`${this.server}/${this.version}/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: JSON.stringify(body),
      });
      const response = await data.json();
      return response;
    } catch (error) {
      return {
        message: "Erro ao criar conta",
      };
    }
  }
  public async updateCredentials(
    token: string,
    body: {
      oldPassword: string;
      password: string;
    }
  ) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/auth/credentials`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          method: "PUT",
          body: JSON.stringify(body),
        }
      );
      const response = await data.json();
      return response;
    } catch (error) {
      return {
        message: "Erro ao criar conta",
      };
    }
  }
  public async requestForRecovery(email: string) {
    const data = await fetch(
      `${this.server}/${this.version}/auth/${encodeURIComponent(
        email
      )}/recovery`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      }
    );

    const response = await data.json();
    return response;
  }
  public async resetPassFromToken(token: string, password: String) {
    const data = await fetch(`${this.server}/${this.version}/auth/reset`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        token,
        password
      })
    });

    const response = await data.json();
    return response;
  }
}
