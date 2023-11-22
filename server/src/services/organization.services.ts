import FlowModel from "../models/reactFlow.model";
import OrganizationModel from "../models/organization.model ";

import { Node } from "@/interfaces/node.interface";

class organizationservices {

  public organizationModel = OrganizationModel;
 

  public signupUser = async (data: any) => {
    const response = await this.organizationModel.create({ ...data });
    return response;
  };

  public loginUser = async (data: any) => {
    const response = await this.organizationModel.find({ ...data });
    return response;
  };


  
  
}
export default organizationservices;
