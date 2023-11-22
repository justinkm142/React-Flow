import mongoose from "mongoose";

const OrganizationSchema: mongoose.Schema = new mongoose.Schema(
  {
    orgName: String,
    email: {type: String, unique:true},
    password: String,
  },
  { timestamps: true }
);

const OrganizationModel = mongoose.model("Organization", OrganizationSchema);

export default OrganizationModel;
