import React, { useState } from "react";
import FileUpload from "../components/fileupload";
// import { sendFileUrl } from "../services/api";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    FileUpload(file);
    console.log("File Upload function Worked");
  };
  return (
    <>
      <div>
        <h1>HOME</h1>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </>
  );
}
