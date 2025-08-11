import React from "react";
import { Image } from "lucide-react";

export const ImageUploadButton = ({ fileInputRef, imagePreview }) => (
  <button
    type="button"
    className={`hidden sm:flex btn btn-circle ${
      imagePreview ? "text-emerald-500" : "text-zinc-400"
    }`}
    onClick={() => fileInputRef.current?.click()}
  >
    <Image size={20} />
  </button>
);
