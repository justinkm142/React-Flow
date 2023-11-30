import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import FlowController from "../controllers/flow.controller";
import OrganizationController from "../controllers/organization.controller"

class AuthRoute implements Routes {
  public path = "/";
  public router = Router();
  public flowController = new FlowController();
  public organizationController = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, this.organizationController.signupUser);
    this.router.post(`${this.path}login`, this.organizationController.loginUser);

  }
}

export default AuthRoute;
