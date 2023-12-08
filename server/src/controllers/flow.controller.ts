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
      const orgId:string = req.query.orgId as string

      const getDraftFlow = await this.flowServices.getDraftFlow(orgId);

      let version = getDraftFlow[0]?.flow?.pop().version || 1.0;
      let status = getDraftFlow[0]?.status;
      if (status === "Draft") {
          
          let draftFlow = getDraftFlow[0].flow.pop();
         
        return res.status(200).json({ node:draftFlow.nodes, edges:draftFlow.edges, version:draftFlow.version, status:getDraftFlow[0]?.status, flowId:draftFlow.id});
       
      }

 

    

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
            hidden:true
          });
        }
        if (data.type === "defaultBusinessUnit") {
          edges.push({
            id: `${data._id}_1`,
            source: "stratNodeId",
            target: data._id,
            animated: true,
            hidden:false
          });
          node[0] = {
            ...node[0],
            position: { x: data.position.x, y: data.position.y - 150 },
          };
        } else {
          edges.push({
            id: `${data._id}_1`,
            source: data.parentBusinessUnit_id,
            target: data._id,
            animated: true,
            hidden:false,
            style: {
              strokeWidth: 2,
              stroke: '#FF0072',
            },
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

      res.status(200).json({ node, edges, version:version, status:status});
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
        position: { x: 100, y: 200 },
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
      const { nodes, edges, deletedNodes, orgId,version } = req.body;
      let status = "Deployed"

      const saveNodesResponse = await this.flowServices.saveFlow(
        nodes,
        edges,
        deletedNodes,
        orgId
      );

      const draftSaveResponse = await this.flowServices.saveDraftFlow(
        nodes,
       edges,
       orgId,
       version,
       status,
     );

      // console.log(writeNodesResponse)

      // res.status(200).json({writeNodesResponse})
      res.status(200).json(saveNodesResponse);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // meyhod for convert nodes and edges to graph

public saveDraftFlow = async (req: any, res:express.Response, next: express.NextFunction)=>{
try {
  
  const {nodes, edges , orgId, version, status} = req.body;

  

  const draftSaveResponse = await this.flowServices.saveDraftFlow(
     nodes,
    edges,
    orgId,
    version,
    status,
  );

console.log("draftSaveResponse", draftSaveResponse)

res.status(200).json({status:"success", message:"Draft saved successfully", draftSaveResponse});
} catch (error) {
  console.log(error);
}

} 

}



export default FlowController;






