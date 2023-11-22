import express from "express";


import flowServices from "../services/flow.services";

import { RequestWithNode, Node } from "../interfaces/node.interface";

class FlowController {
  public flowServices = new flowServices();

  public getFlow = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const orgId= req.query.orgId

      const getAllNode = await this.flowServices.findAllFlow(orgId);

      const node: any = [];
      const edges: any = [];
      getAllNode.forEach((data, index) => {
        if (index === 0) {
          node.push({
            id: "stratNodeId",
            position: { x: 100, y: 0 },
            data: { label: "Start Node" },
            type: "startNode",
          });
        }
        if (data.type === "defaultBusinessUnit") {
          edges.push({
            id: `${data._id}_1`,
            source: "stratNodeId",
            target: data._id,
            animated: true,
          });
          node[0] = {
            ...node[0],
            position: { x: data.position.x, y: data.position.y - 150 },
          };
        } else {
          edges.push({
            id: `${data._id}_1`,
            source: data.parent_id,
            target: data._id,
            animated: true,
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

  public createFlow = async (
    req: RequestWithNode,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data: Node = req.body;
      const writeNodesResponse = await this.flowServices.createFlow(data);

      
      let node = {
        id: writeNodesResponse._id,
        data: {
          label: writeNodesResponse.name,
          features: writeNodesResponse.features,
        },
        type: writeNodesResponse.type,
        position: { x: 100, y: 100 },
      };

      res.status(200).json({ node });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public updateFlow = async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = req.body;
     
      const writeNodesResponse = await this.flowServices.updateFlow(data);

  

      res.status(200).json({ writeNodesResponse });
    } catch (error) {
      console.log(error);
    }
  };

  public saveFlow = async (
    req: any,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { nodes, edges, deletedNodes, orgId } = req.body;

      const saveNodesResponse = await this.flowServices.saveFlow(
        nodes,
        edges,
        deletedNodes,
        orgId
      );

      // console.log(writeNodesResponse)

      // res.status(200).json({writeNodesResponse})
      res.status(200).json(saveNodesResponse);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default FlowController;
