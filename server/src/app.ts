import cors from "cors";
import morgan from "morgan";
import mongoose, { get } from "mongoose";
import express from "express";

import { Routes } from "@interfaces/routes.interface";
import { PORT, MONGO_URL } from "./config/config";

export default class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = "development";
    this.port = PORT || 4000;

    this.connectToDatabase().then();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }

  private async connectToDatabase() {
    try {
      await mongoose.connect(MONGO_URL);
    } catch (error) {
      console.log(error);
    }
  }

  private initializeMiddleware() {
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
}
