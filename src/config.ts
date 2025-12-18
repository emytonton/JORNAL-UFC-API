import * as dotenv from "dotenv";

dotenv.config();

export class Config {
  private static instance: Config;

  private constructor() {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get port(): number {
    return parseInt(process.env.PORT || "3000", 10);
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || "default-secret-key-change-in-production";
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || "development";
  }
}
