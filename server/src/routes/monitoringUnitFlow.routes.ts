import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import MonitoringUnitFlowController from "../controllers/monitoringUnitFlow.controller";
import OrganizationController from "../controllers/organization.controller"

class MonitoringFlowRoute implements Routes {
  public path = "/monitoringUnitFlow";
  public router = Router();
  public monitoringUnitFlowController = new MonitoringUnitFlowController();
  public organizationController = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.monitoringUnitFlowController.getMonitoringUnitFlow);
    
  }
}

export default MonitoringFlowRoute;
