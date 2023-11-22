import { Request } from "express";

export interface Node {
  name: string;
  type: string;
  parent_id: string;
}

export interface RequestWithNode extends Request {
  name: string;
  type: string;
  parent_id: string;
}
