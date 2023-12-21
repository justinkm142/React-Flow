import flowModel from "../models/reactFlow.model";
import flowDraftModel from "../models/reactFlowDraft.model"
import mongoose from "mongoose";

import { Node } from "@/interfaces/node.interface";

class flowServices {
  public flowModel = flowModel;
  public flowDraftModel = flowDraftModel;

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
    // nodes.shift();
    // edges.shift();

    


    
  


    let parentBillingUnit_id="";
    let parentMonitoringUnit_id="";


    let tempGraph = new Graph();

    nodes.forEach((data:any) => {
      tempGraph.addNode(data);
    })
    // console.log("edges===>", edges)
    edges.forEach((data:any) => {
      tempGraph.addEdge(data.source, data.target);
    })


    for (let k = 0 ; k< nodes.length; k++) {

        const nodeToRootPath = this.traverseToRoot(tempGraph, nodes[k].id);

        
    
        nodeToRootPath.forEach((data) => {
          if (data?.data?.features?.billingUnit===true){
            // console.log(nodes[k].parentBillingUnit_id, "nodeToRootPath", data.id)
            nodes[k] = {...nodes[k],parentBillingUnit_id:data.id }
          }
          if (data?.data?.features?.monitoringUnit===true){
            nodes[k] = {...nodes[k],parentMonitoringUnit_id:data.id }
          }
    })
  }

   nodes.shift();


  // making a map to access edges fast 
  let tempMapData = new Map(
    edges.map((data: any) => {
      return [data.target, data.source];
    })
  );

    // in this operatoion we need to assign billing and monitoring id blank if the node is doing that operation 
    let dataArray: [] = nodes.map((data: any) => {
   
      if(data.data.features.billingUnit===true && data.data.features.monitoringUnit===true){
        return {
          _id: data.id,
          name: data.data.label,
          type: data.type,
          parentBusinessUnit_id: tempMapData.get(data.id) || null,
          parentBillingUnit_id:"",
          parentMonitoringUnit_id:"",
          features: data.data.features,
          description: data.data.description || "",
          position: data.position,
        };
      }

      if(data.data.features.monitoringUnit===true){
        return {
          _id: data.id,
          name: data.data.label,
          type: data.type,
          parentBusinessUnit_id: tempMapData.get(data.id) || null,
          parentBillingUnit_id:data.parentBillingUnit_id,
          parentMonitoringUnit_id:null,
          features: data.data.features,
          description: data.data.description || "",
          position: data.position,
        };
      }

      if(data.data.features.billingUnit===true){
        return {
          _id: data.id,
          name: data.data.label,
          type: data.type,
          parentBusinessUnit_id: tempMapData.get(data.id) || null,
          parentBillingUnit_id:null,
          parentMonitoringUnit_id:data.parentMonitoringUnit_id,
          features: data.data.features,
          description: data.data.description || "",
          position: data.position,
        };
      }

      return {
        _id: data.id,
        name: data.data.label,
        type: data.type,
        parentBusinessUnit_id: tempMapData.get(data.id) || null,
        parentBillingUnit_id:data.parentBillingUnit_id,
        parentMonitoringUnit_id:data.parentMonitoringUnit_id,
        features: data.data.features,
        description: data.data.description || "",
        position: data.position,
      };



    });

    

    let k: any;
    for (k of dataArray) {
      if (k.parentBusinessUnit_id === "" || k.parentBusinessUnit_id === null) {
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
    // function for remove deleted nodes from database by user  
    const deleteOpRes = await this.flowModel.deleteMany({
      _id: { $in: deletedNodes },
    });

    let bilkWriteData = dataArray.map((data: any) => {
      let parent_id=""
      if(data.type === "defaultBusinessUnit"){
        parent_id=null
      }else{
        parent_id=data.parentBusinessUnit_id
      }

      return {
        updateOne: {
          filter: { _id: data._id },
          update: {
            $set: {
              name: data.name,
              type: data.type,
              parent_id: parent_id,
              parentBusinessUnit_id:parent_id,
              parentBillingUnit_id:data.parentBillingUnit_id,
              parentMonitoringUnit_id:data.parentMonitoringUnit_id,
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
  
  public traverseToRoot =(graph:any, startNodeValue:any)=>{
    try {
      
      const pathToRoot = [];

      let currentNode = graph.nodes[startNodeValue];
    
      while (currentNode !== null) {
          pathToRoot.push(currentNode.value);
          currentNode = currentNode.parent;
      }
      return pathToRoot.reverse();
      
    } catch (error) {
      console.error("error:",error);
    }
  }

  public getDraftFlow = async(orgId:string)=>{
      const draftFlow:any = await this.flowDraftModel.find({orgId:orgId})

      return draftFlow
  }

  public saveDraftFlow = async(nodes:any,edges:any,orgId:any, version:any, status:any)=>{
    let id = String (new mongoose.Types.ObjectId());
    const draftSaveResponse = await this.flowDraftModel.findOneAndUpdate({orgId:orgId},{$set:{status}, $push: { flow: {nodes,edges,version,id:id}}}, {new: true,  upsert: true})
    return draftSaveResponse;
  }

  
}

export default flowServices;




// logic for making a graph from nodes and edges
class Graph {
  public nodes:any

  constructor() {
      this.nodes = {};
  }

  public addNode(value:any) {
      this.nodes[value.id] = { value, parent: null, children: [] };
  }

  public addEdge(parentValue:any, childValue:any) {
   

      this.nodes[parentValue].children.push(this.nodes[childValue]);
      this.nodes[childValue].parent = this.nodes[parentValue];
  }
}




