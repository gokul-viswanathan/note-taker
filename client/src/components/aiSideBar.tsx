
import React, { useEffect, useState } from 'react';
import { apiCall } from './typescript/AiModel';

interface Message {
   id: number;
   text: string;
   sender: string;
 }

const AiSideBar: React.FC<{currentFile:string}> = ({ currentFile }) => {

   //get AI chat history based on this file
   //if nothing is there set the below mwssage
   //it should take effect every time the file changes

   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState("");
   // { id: 1, text: "Hello! How can I assist you today?", sender: "bot" }
   useEffect(() => {
      const currentAIPrevChat = localStorage.getItem("chatAi"+currentFile);
      if (currentAIPrevChat && currentAIPrevChat !== '') {
         try{
            const parsedMessage = JSON.parse(currentAIPrevChat);
            setMessages(parsedMessage);
         }catch (error) {
            console.log("error parsing chat ", error);
            setMessages([{ id: 1, text: "Hello! How can I assist you today?", sender: "bot" }]);
         }
      }else{
         setMessages([{ id: 1, text: "Hello! How can I assist you today?", sender: "bot" }])
      }
   }, [currentFile])
  
   //  const [selectedFile, setSelectedFile] = useState(null);

   function handleAsk() {
      setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: input, sender: "user" }]);
      const currentFileValues = localStorage.getItem(currentFile);
      if (input && currentFileValues) {
         apiCall(currentFileValues, input)
            .then(aiOutput => {
               if (aiOutput !== null) {
                  setMessages(prevMessages => {
                     const updatedMessage = [...prevMessages, { id: Date.now(), text: aiOutput, sender: "bot" }]
                     localStorage.setItem("chatAi"+currentFile, JSON.stringify(updatedMessage))
                     return updatedMessage
                  });
               }
            })
            .catch(error => {
               console.error("Error in API call:", error);
            });
      }
      setInput("");
   }

   return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
         <div className="flex-1 overflow-y-auto p-3 rounded-lg space-y-2 shadow-md flex flex-col">
            {messages.map((msg) => (
               <div key={msg.id} 
               className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-[#D8D9DA] text-black self-start" : "bg-[#0F4C75] text-white self-end"}`}>
                  {msg.text}
               </div>
            ))}
         </div>

         {/* Input Field */}
         <div className="mt-4 flex space-x-2">
            <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Type your message..."
               className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
               onClick={handleAsk}
               className="p-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600">
               Send
            </button>
         </div>
      </div>
   );
}

export default AiSideBar