import express from "express";


import BillingUnitFlowServices from "../services/billingUnitFlow.services";

import { RequestWithNode, Node } from "../interfaces/node.interface";

class BusinessFlowController {
  public flowServices = new BillingUnitFlowServices();

  public getBillingUnitFlow = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const orgId= req.query.orgId

      const getAllNode = await this.flowServices.findAllBillingUnit(orgId);

      const node: any = [];
      const edges: any = [];
      getAllNode.forEach((data:any, index:any) => {
      if (data.type === "defaultBusinessUnit") {
          edges.push({
            id: `${data._id}_1`,
            source: null,
            target: data._id,
            animated: true,
            hidden:false
          });
        
        } else if (data.type === "billingUnit") {
          edges.push({
            id: `${data._id}_1`,
            source: null,
            target: data._id,
            animated: true,
            hidden:false
          });


        } else {
          edges.push({
            id: `${data._id}_1`,
            source: data.parent_id,
            target: data._id,
            animated: true,
            hidden:false
          });
        }
        node.push({
          id: data._id,
          position: { x: data.position.x, y: data.position.y },
          data: {
            label: data.name,
            features: data.features,
            description: data.description,
          },
          type: data.type,
        });
      });

      res.status(200).json({ node, edges });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

}

export default BusinessFlowController;
