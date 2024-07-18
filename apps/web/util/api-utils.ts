class API {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async get<T>(url: string): Promise<T> {
    const res = await fetch(this.baseUrl + url);
    return await res.json();
  }
}

const instance = new API();
Object.freeze(instance);

export default instance;
