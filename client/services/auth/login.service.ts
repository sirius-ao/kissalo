import constants from "@/constants";
import { validateEmail } from "@/lib/utils";
export class AuthService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";

  public async login(email: string, password: string) {
    if (!email || !password) {
      return {
        message: "Preenche os campos",
        error: true,
      };
    }
    const body = JSON.stringify({
      unique: email,
      password: password,
    });
    validateEmail(email);
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
}
