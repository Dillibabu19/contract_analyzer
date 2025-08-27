import { useState, useRef, type SVGProps, useEffect } from "react";
import { storage, bucketId, ID } from "../lib/appwrite";
import { sendFileUrl } from "../services/api";
import { sendQuery } from "../services/api";
import type { JSX } from "react/jsx-runtime";

const SendIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

// Loading spinner component
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

export default function Main() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  type ChatMessage = { sender: string; text: string };
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(`Selected: ${selectedFile.name}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first!");
      return;
    }
    setIsLoading(true);
    setUploadStatus("Uploading...");

    try {
      const response = await storage.createFile(bucketId, ID.unique(), file);
      const result = storage.getFileView(bucketId, response.$id);
      setFileUrl(result);
      console.log("URl : ", fileUrl);

      sendFileUrl(fileUrl);
      setUploadStatus(`File "${file.name}" uploaded successfully!`);
      setFileUploaded(true);
      setChatHistory([
        {
          sender: "bot",
          text: `Your document is ready. What would you like to know about "${file.name}"?`,
        },
      ]);
    } catch (error) {
      console.error("Failed to upload file:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!query.trim() || isSending) {
      alert("Query is empty");
      return;
    }

    const userMessage = { sender: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsSending(true);
    try {
      const response = await sendQuery(userMessage.text);
      const AI = { sender: "AI", text: response.data.content };
      setChatHistory((prev) => [...prev, AI]);
    } catch (error) {
      console.log("Failed to send query:", error);
      const errorMessage = {
        sender: "AI",
        text: "Sorry, I encountered an error trying to respond. Please try again.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // return (
  //   <>
  //     <div className="">
  //       <div>
  //         <h1>HOME</h1>
  //         <input
  //           type="file"
  //           onChange={(e) => setFile(e.target.files?.[0] || null)}
  //           disabled={isLoading}
  //         />
  //         <button onClick={handleUpload} disabled={isLoading}>
  //           {isLoading ? "Uploading..." : "Upload"}
  //         </button>
  //         {uploadStatus && <p>{uploadStatus}</p>}
  //       </div>
  //       <div>
  //         <h1>Ask Question</h1>
  //         <input
  //           value={query}
  //           type="text"
  //           onChange={(e) => setQuery(e.target.value)}
  //           disabled={!fileUploaded}
  //         />
  //         <button onClick={handleQuery} disabled={!fileUploaded}>
  //           {isSending ? "Sending..." : "Send"}
  //         </button>
  //       </div>
  //     </div>
  //   </>
  // );
  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans text-white p-4">
  //     <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-2xl shadow-2xl flex flex-col h-[80vh]">
  //       {/* Header */}
  //       <header className="p-4 border-b border-slate-700">
  //         <h1 className="text-xl font-bold text-center text-cyan-400">
  //           DocuChat AI
  //         </h1>
  //         <p className="text-sm text-center text-slate-400">
  //           Upload a document and ask it anything
  //         </p>
  //       </header>

  //       {/* Main Content: Switches between Upload and Chat view */}
  //       <main className="flex-grow p-6 flex flex-col overflow-hidden">
  //         {!fileUploaded ? (
  //           // Upload View
  //           <div className="flex flex-col items-center justify-center h-full text-center">
  //             <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
  //             <p className="text-slate-400 mb-8 max-w-md">
  //               Choose a document (.pdf, .txt, .md) to begin your conversation.
  //               Your file will be processed securely.
  //             </p>
  //             <div className="w-full max-w-sm">
  //               <label
  //                 htmlFor="file-upload"
  //                 className="cursor-pointer w-full inline-block bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-lg transition-colors duration-300"
  //               >
  //                 {file ? "Change File" : "Select a File"}
  //               </label>
  //               <input
  //                 id="file-upload"
  //                 type="file"
  //                 className="hidden"
  //                 onChange={handleFileChange}
  //                 disabled={isLoading}
  //               />
  //               <button
  //                 onClick={handleUpload}
  //                 disabled={isLoading || !file}
  //                 className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
  //               >
  //                 {isLoading ? <Spinner /> : "Upload & Start Chat"}
  //               </button>
  //               {uploadStatus && (
  //                 <p className="mt-4 text-sm text-slate-400 break-words">
  //                   {uploadStatus}
  //                 </p>
  //               )}
  //             </div>
  //           </div>
  //         ) : (
  //           // Chat View
  //           <div className="flex flex-col h-full overflow-hidden">
  //             {/* Chat History */}
  //             <div className="flex-grow overflow-y-auto pr-2 space-y-4">
  //               {chatHistory.map((message, index) => (
  //                 <div
  //                   key={index}
  //                   className={`flex items-end gap-2 ${
  //                     message.sender === "user"
  //                       ? "justify-end"
  //                       : "justify-start"
  //                   }`}
  //                 >
  //                   <div
  //                     className={`max-w-md p-3 rounded-2xl ${
  //                       message.sender === "user"
  //                         ? "bg-cyan-600 rounded-br-lg"
  //                         : "bg-slate-700 rounded-bl-lg"
  //                     }`}
  //                   >
  //                     <p className="text-sm whitespace-pre-wrap">
  //                       {message.text}
  //                     </p>
  //                   </div>
  //                 </div>
  //               ))}
  //               {isSending && (
  //                 <div className="flex items-end gap-2 justify-start">
  //                   <div className="max-w-md p-3 rounded-2xl bg-slate-700 rounded-bl-lg">
  //                     <div className="flex items-center justify-center gap-2">
  //                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
  //                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
  //                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}
  //               <div ref={chatEndRef} />
  //             </div>

  //             {/* Chat Input Form */}
  //             <form
  //               onSubmit={handleQuery}
  //               className="mt-4 flex items-center gap-2"
  //             >
  //               <input
  //                 value={query}
  //                 onChange={(e) => setQuery(e.target.value)}
  //                 type="text"
  //                 placeholder="Ask a question about your document..."
  //                 className="flex-grow bg-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
  //                 disabled={isSending}
  //               />
  //               <button
  //                 type="submit"
  //                 disabled={!query.trim() || isSending}
  //                 className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-300"
  //               >
  //                 <SendIcon />
  //               </button>
  //             </form>
  //           </div>
  //         )}
  //       </main>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans text-white">
      {/* Header */}
      <header className="p-6 border-b border-slate-700 shadow-md">
        <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
          PaperPal AI
        </h1>
        <p className="text-sm text-center text-slate-400 mt-1">
          Upload a document and chat with it
        </p>
      </header>

      {/* Upload Section */}
      <section className="p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto text-center">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-full inline-block bg-gradient-to-r from-slate-700 to-slate-600 hover:from-cyan-600 hover:to-cyan-500 text-slate-200 font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300"
          >
            {file ? `📄 Selected: ${file.name}` : "Select a File"}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? <Spinner /> : "🚀 Upload Document"}
          </button>
          {uploadStatus && (
            <p className="mt-4 text-sm text-slate-400 break-words">
              {uploadStatus}
            </p>
          )}
        </div>
      </section>

      {/* Chat Section */}
      <section className="flex flex-col flex-grow max-w-2xl mx-auto w-full">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md p-4 rounded-2xl shadow-md backdrop-blur-sm ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-br-lg"
                    : "bg-slate-700/70 text-slate-200 rounded-bl-lg"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-end gap-2 justify-start">
              <div className="max-w-md p-4 rounded-2xl bg-slate-700/70 shadow-md backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleQuery}
          className="p-4 border-t border-slate-700 flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder={
              fileUploaded
                ? "Ask a question about your document..."
                : "Upload a document first..."
            }
            className="flex-grow bg-slate-700/70 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner transition"
            disabled={isSending || !fileUploaded}
          />
          <button
            type="submit"
            disabled={!query.trim() || isSending || !fileUploaded}
            className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-lg transition-all duration-300"
          >
            <SendIcon />
          </button>
        </form>
      </section>
    </div>
  );
}
