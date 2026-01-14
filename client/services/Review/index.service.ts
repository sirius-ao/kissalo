import constants from "@/constants";

interface ICreateCtegory {
  bookingId: number;
  comment: string;
  rating: number;
}
export class ReviewServices {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}

  public async create(body: ICreateCtegory) {
    console.log(body)
    if (!body.comment || !body.bookingId || !body.rating) {
      return {
        message: "Preenche todos os dados",
      };
    }
    try {
      const data = await fetch(`${this.server}/${this.version}/reviews`, {
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
}
