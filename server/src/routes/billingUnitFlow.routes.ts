import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import BillingUnitFlowController from "../controllers/billingUnitFlow.controller";
import OrganizationController from "../controllers/organization.controller"

class BusinessFlowRoute implements Routes {
  public path = "/billingUnitFlow";
  public router = Router();
  public BillingUnitFlowController = new BillingUnitFlowController();
  public organizationController = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.BillingUnitFlowController.getBillingUnitFlow);
    
  }
}

export default BusinessFlowRoute;
