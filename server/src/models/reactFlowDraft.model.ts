import mongoose from "mongoose";

const flowSchema = new mongoose.Schema({
  id: String,
  nodes: Array,
  edges: Array,
  version: {type: Number, default: 1.0},
});

const FlowDraftSchema: mongoose.Schema = new mongoose.Schema(
  {
    orgId: { type: String, required: true },
    status: { type: String, default: "draft" },
    flow: {
      type: Array,
      schema: flowSchema,
    },
  },
  { timestamps: true }
);

const flowDraftModel = mongoose.model("FlowDraft", FlowDraftSchema);

export default flowDraftModel;
