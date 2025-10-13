import { useState } from "react";
import { storage, bucketId, ID } from "../lib/appwrite";
import { sendFileUrl, sendQuery } from "../services/api";
import Header from "../components/header";

export default function Main() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [query, setQuery] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setStatus(`Selected: ${selected.name}`);
  };

  const handleUpload = async () => {
    if (!file) return setStatus("No file selected");
    setStatus("Uploading...");
    try {
      const response = await storage.createFile(bucketId, ID.unique(), file);
      const url = storage.getFileView(bucketId, response.$id);
      await sendFileUrl(url, file.name, response.$id);
      setFileUploaded(true);
      setStatus("Uploaded!");
      setMessages([
        { sender: "AI", text: `File "${file.name}" ready! Ask me something.` },
      ]);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setMessages((m) => [...m, { sender: "user", text: query }]);
    setQuery("");
    try {
      const res = await sendQuery(query);
      setMessages((m) => [...m, { sender: "AI", text: res.data.content }]);
    } catch {
      setMessages((m) => [...m, { sender: "AI", text: "Error answering." }]);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: 20 }}>
        <h2>Prototype Document Chat</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{status}</p>

        <div
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginTop: 10,
            height: 200,
            overflowY: "auto",
          }}
        >
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.sender}:</b> {m.text}
            </p>
          ))}
        </div>

        <form onSubmit={handleAsk} style={{ marginTop: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            disabled={!fileUploaded}
          />
          <button type="submit" disabled={!fileUploaded}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
