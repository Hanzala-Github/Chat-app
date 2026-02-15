import fs from "fs";
import path from "path";

export const deleteLocalVoiceFile = (voice) => {
  try {
    if (!voice?.url) return;

    // Example:
    // http://localhost:5000/uploads/voices/123.webm
    const filename = voice.url.split("/uploads/voices/")[1];
    if (!filename) return;

    const filePath = path.join(process.cwd(), "uploads", "voices", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // 🔥 DELETE FILE
      console.log("Deleted voice file:", filename);
    }
  } catch (err) {
    console.error("Error deleting voice file:", err.message);
  }
};
