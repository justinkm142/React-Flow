import flowModel from "../models/reactFlow.model";

import { Node } from "@/interfaces/node.interface";

class flowServices {
  public flowModel = flowModel;

  public findAllFlow = async (orgId:any) => {
    const allNodes = await this.flowModel.find({orgId:orgId, type:{$ne:"newNode"}});
    return allNodes;
  };

  public createFlow = async (data: Node) => {
    const response = await this.flowModel.create({ ...data });
    return response;
  };
  public updateFlow = async (data: any) => {
    const response = await this.flowModel.updateOne(
      { _id: data._id },
      { $set: { ...data.dataToUpdate } }
    );
    return response;
  };

  public createDefaultBuisnessUsint = async (data:any) => {

    const response = await this.flowModel.create({ ...data });
    return response;
  };



  public saveFlow = async (nodes: any, edges: any, deletedNodes: any, orgId:any) => {
    nodes.shift();
    // edges.shift();

    const deleteOpRes = await this.flowModel.deleteMany({
      _id: { $in: deletedNodes },
    });

    

    let tempMapData = new Map(
      edges.map((data: any) => {
        return [data.target, data.source];
      })
    );

    let dataArray: [] = nodes.map((data: any) => {
      return {
        _id: data.id,
        name: data.data.label,
        type: data.type,
        parent_id: tempMapData.get(data.id) || "",
        features: data.data.features,
        description: data.data.description || "",
        position: data.position,
      };
    });

    let k: any;
    for (k of dataArray) {
      if (k.parent_id === "") {
        return {
          status: "error",
          message: `please connect ${k.name} to its parent`,
        };
      }
      if (
        k.features.businessUnit === false &&
        k.features.monitoringUnit === false &&
        k.features.billingUnit === false
      ) {
        return {
          status: "error",
          message: `please select at least one functionality for ${k.name}`,
        };
      }
    }

    let bilkWriteData = dataArray.map((data: any) => {
      let parent_id=""
      if(data.type === "defaultBusinessUnit"){
        parent_id=""
      }else{
        parent_id=data.parent_id
      }

      return {
        updateOne: {
          filter: { _id: data._id },
          update: {
            $set: {
              name: data.name,
              type: data.type,
              parent_id: parent_id,
              features: data.features,
              description: data.description,
              position: data.position,
            },
          },
        },
      };
    });

    const response = await this.flowModel.bulkWrite(bilkWriteData);

    const deleteUnusedNodes = await this.flowModel.deleteMany({orgId: orgId,
      type: "newNode",
    });

    // const response = await this.flowModel.updateOne({_id:data._id}, {$set:{...data.dataToUpdate}})
    return { status: "success", message: "File Saved Successfully" };
  };
}

export default flowServices;
