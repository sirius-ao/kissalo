import constants from "@/constants";

export class LLmsService {
  private readonly server = constants.SERVER;
  private readonly version = "v1";
  constructor(private readonly token: string) {}

  public async getImages(title: string) {
    try {
      const data = await fetch(
        `${this.server}/${this.version}/llms/${encodeURIComponent(
          title
        )}/images`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
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
