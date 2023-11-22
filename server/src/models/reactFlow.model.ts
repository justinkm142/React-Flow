import mongoose from "mongoose";

const FlowSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, default: "newNode" },
    orgId:{type: String, required: true},
    parent_id: {type:String, default: ""},
    description: String,
    features: {
      businessUnit: { type: Boolean, default: false },
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
