import mongoose, { Schema } from "mongoose";

const attribute = new Schema({}, { timestamps: true });

const Attribute = mongoose.model("Attribute", attribute);
