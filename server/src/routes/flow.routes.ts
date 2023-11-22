import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import FlowController from "../controllers/flow.controller";
import OrganizationController from "../controllers/organization.controller"

class FlowRoute implements Routes {
  public path = "/";
  public router = Router();
  public flowController = new FlowController();
  public organizationController = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.flowController.getFlow);
    this.router.post(`${this.path}`, this.flowController.createFlow);
    this.router.patch(`${this.path}`, this.flowController.updateFlow);
    this.router.put(`${this.path}`, this.flowController.saveFlow);
    this.router.post(`${this.path}signup`, this.organizationController.signupUser);
    this.router.post(`${this.path}login`, this.organizationController.loginUser);

  }
}

export default FlowRoute;
