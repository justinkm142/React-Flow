import mongoose from "mongoose";

const FlowSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, default: "newNode" },
    orgId:{type: String, required: true},
    parentBusinessUnit_id: {type:String, default: ""},
    parentBillingUnit_id: {type:String, default: ""},
    parentMonitoringUnit_id: {type:String, default: ""},
    description: String,
    features: {
      businessUnit: { type: Boolean, default: true },
      monitoringUnit: { type: Boolean, default: false },
      billingUnit: { type: Boolean, default: false },
    },
    position: {
      x: { type: Number, default: 100 },
      y: { type: Number, default: 100 },
    },
  },
  { timestamps: true }
);

const flowModel = mongoose.model("Flow", FlowSchema);

export default flowModel;
