// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { MessageCircle, Mic, RefreshCcw, Send, X } from "lucide-react";

// export const ChatWidget: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* Floating Chat Button — hidden when chat is open */}
//       {!isOpen && (
//         <div className="fixed bottom-6 right-6 z-[9999]">
//           <button
//             type="button"
//             onClick={() => setIsOpen(true)}
//             className="flex items-center gap-2 rounded-2xl bg-black px-4 py-3 shadow-lg transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
//           >
//             <Image
//               width={28}
//               height={28}
//               src="/headphone_svg.svg"
//               alt="Customer support icon"
//               className="h-7 w-7"
//             />
//             <span className="text-sm font-medium text-white">Talk with Us</span>
//           </button>
//         </div>
//       )}

//       {/* Chat Popup */}
//       {isOpen && (
//         <div className="fixed bottom-5 right-5 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[10000] overflow-hidden flex flex-col animate-[slideUp_0.3s_ease]">
//           {/* Header */}
//           <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
//             <div className="flex items-center gap-2">
//               <Image
//                 width={24}
//                 height={24}
//                 src="/headphone_svg.svg"
//                 alt="Chat icon"
//               />
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900">
//                   Talk with Us
//                 </h3>
//                 <p className="text-xs text-gray-500">Choose voice or text</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={() => alert("Chat refreshed!")}
//                 className="text-gray-800 hover:text-gray-700 transition"
//               >
//                 <RefreshCcw size={18} />
//               </button>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-800 hover:text-gray-700 transition"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Chat Body (Scrollable area) */}
//           <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center text-gray-500">
//             <div className="border-2 border-gray-300 rounded-full p-3 mb-3">
//               <MessageCircle size={28} />
//             </div>
//             <p className="text-sm font-medium">
//               Use voice or text to communicate
//             </p>
//           </div>

//           {/* Input Box — always sticks to bottom */}
//           <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-gray-50 flex-shrink-0">
//             <input
//               type="text"
//               placeholder="Type your message..."
//               className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-400"
//             />
//             <button className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition">
//               <Send size={18} />
//             </button>
//             <button className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition">
//               <Mic size={18} />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Slide-up animation */}
//       <style jsx>{`
//         @keyframes slideUp {
//           from {
//             transform: translateY(40px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </>
//   );
// };


"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle, Mic, RefreshCcw, Send, X } from "lucide-react";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  ts: number;
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Helper to create a quick unique id
  const makeId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

  // Add "me" message
  const sendMessage = (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;
    const msg: Message = { id: makeId(), text: trimmed, sender: "me", ts: Date.now() };
    setMessages((m) => [...m, msg]);
    setInput("");
    // focus input after send
    inputRef.current?.focus();

    // TODO: replace with your real send-to-server / websocket call
    // Example: ws.send(JSON.stringify({ type: "message", text: trimmed }))
  };

  // External incoming message handler (can be used by websockets, server events, etc.)
  const addIncomingMessage = (text: string) => {
    const msg: Message = { id: makeId(), text, sender: "them", ts: Date.now() };
    setMessages((m) => [...m, msg]);
  };

  // Listen for a global custom event "incomingMessage" so outside code can push messages:
  // window.dispatchEvent(new CustomEvent("incomingMessage", { detail: { text: "Hi from server" } }))
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const custom = e as CustomEvent<{ text: string }>;
        if (custom?.detail?.text) addIncomingMessage(custom.detail.text);
      } catch {
        // ignore malformed events
      }
    };
    window.addEventListener("incomingMessage", handler as EventListener);
    return () => window.removeEventListener("incomingMessage", handler as EventListener);
  }, []);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // scroll to bottom smoothly
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  // Optional: example simulated incoming message (comment out in production)
  // useEffect(() => {
  //   const t = setTimeout(() => addIncomingMessage("Hello! How can I help you today?"), 1200);
  //   return () => clearTimeout(t);
  // }, []);

  return (
    <>
      {/* Floating Chat Button — hidden when chat is open */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-black px-4 py-3 shadow-lg transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <Image
              width={28}
              height={28}
              src="/headphone_svg.svg"
              alt="Customer support icon"
              className="h-7 w-7"
            />
            <span className="text-sm font-medium text-white">Talk with Us</span>
          </button>
        </div>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[10000] overflow-hidden flex flex-col animate-[slideUp_0.3s_ease]">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Image width={24} height={24} src="/headphone_svg.svg" alt="Chat icon" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Talk with Us</h3>
                <p className="text-xs text-gray-500">Choose voice or text</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  // refresh behavior: clear and optionally re-fetch history
                  setMessages([]);
                }}
                className="text-gray-800 hover:text-gray-700 transition"
                title="Clear chat"
              >
                <RefreshCcw size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-800 hover:text-gray-700 transition"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Body (Scrollable area) */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
          >
            {messages.length === 0 ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-gray-500">
                <div className="border-2 border-gray-300 rounded-full p-3 mb-3">
                  <MessageCircle size={28} />
                </div>
                <p className="text-sm font-medium">Use voice or text to communicate</p>
              </div>
            ) : (
              <div className="flex flex-col pb-2 gap-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[72%] px-3 py-2 rounded-xl text-sm leading-relaxed
                        ${m.sender === "me" ? "bg-teal-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                    >
                      <div>{m.text}</div>
                      <div className="text-[10px] text-gray-200 mt-1 text-right">
                        {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {m.sender === "me" ? " • you" : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Box — always sticks to bottom */}
          <div className="border-t border-gray-200 p-3 flex items-center gap-2 bg-gray-100 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-400"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition"
              aria-label="Send message"
              title="Send"
            >
              <Send size={18} />
            </button>
            <button
              onClick={() => {
                // placeholder for mic action
                alert("Mic/voice not implemented in this demo.");
              }}
              className="bg-teal-500 p-2 rounded-lg text-white hover:bg-teal-600 transition"
              aria-label="Voice"
              title="Voice"
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
