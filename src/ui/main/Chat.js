import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../assets/css/chat.css";
import logo from "../../assets/img/logo.svg";

const aiApiKey = new GoogleGenerativeAI(process.env.REACT_APP_APIKEY);
const geminiModel = aiApiKey.getGenerativeModel({ model: "gemini-1.5-flash" });

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : [];
};

const Chat = () => {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [aiModel, setAiModel] = useState(geminiModel);
  const [usrMessages, setUsrMessages] = useState(
    () => getFromLocalStorage("msgStorage") || [],
  );
  const [messageInput, setMessageInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    saveToLocalStorage("msgStorage", usrMessages);
  }, [usrMessages]);

  const handleUserMessage = async (message) => {
    const userMessage = { sender: "user", text: message };
    setUsrMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageInput("");

    try {
      // Use an array as expected by `generateContent`
      const aiResponse = await aiModel.generateContent([message]);

      // Check if the response format is correct before accessing the text
      if (
        aiResponse &&
        aiResponse.response &&
        typeof aiResponse.response.text === "function"
      ) {
        const aiMessage = { sender: "bot", text: aiResponse.response.text() };
        setUsrMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        console.error("Unexpected AI response structure", aiResponse);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [usrMessages]);

  return (
    <div className="flex flex-col h-screen pb-20">
      <header className="bg-zinc-950 p-3 shadow-xl">
        <Link to="/">
          <img src={logo} width="35px" height="35px" />
          {/* <h1 className="text-xl font-bold text-zinc-400 hover:text-zinc-500">
            CHOCY
          </h1> */}
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
        {usrMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`prose prose-sm rounded-xl p-4 max-w-lg shadow-xl border border-red-600 ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-black text-lg rounded-br-none"
                  : "bg-amber-300 text-black text-lg rounded-bl-none"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!messageInput.trim()) return;
          handleUserMessage(messageInput);
        }}
        className="p-6 bg-zinc-950 shadow-xl fixed bottom-0 left-0 right-0"
      >
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 text-gray-400 bg-gray-900 border border-amber-500 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="  Ask Gemini a question..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-amber-500 text-black text-3xl font-bold px-8 rounded-r-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            SEND
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
