import express from "express";


//import services 
import flowServices from "../services/flow.services";
import organizationServices from "../services/organization.services" 

import { RequestWithNode, Node } from "../interfaces/node.interface";

class FlowController {

  public flowServices = new flowServices();
  public organizationServices = new organizationServices();

  public signupUser = async (req: express.Request, res: express.Response, next: express.NextFunction ) => {
    try {

      const { orgName, email, password } = req.body

      const accountData:any = await this.organizationServices.signupUser({ orgName, email, password });

     
      const createFlow = await this.flowServices.createDefaultBuisnessUsint({orgId:String(accountData._id), name:accountData.orgName, type:"defaultBusinessUnit",features: {businessUnit: true, monitoringUnit: true,billingUnit: true} })
     
      res.status(200).json({ status:"success", accountData:accountData, flowData:createFlow });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction ) => {
    try {
      const { email, password } = req.body
      const accountData = await this.organizationServices.loginUser({ email, password });
      if (accountData.length===1){
        res.status(200).json({ status:"success", accountData:accountData[0]});
      }else{
        res.status(401).json({ status:"error", message:"Invalid username or password"});
      }
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


}

export default FlowController;
