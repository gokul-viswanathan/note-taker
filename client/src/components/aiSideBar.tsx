import React, { useEffect, useState } from "react";
import { apiCall } from "@/services/AiModel";
import { useStore } from "@/stores/states";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader, User, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface AiSideBarProps {
  sidebarState: boolean;
}
const AiSideBar: React.FC<AiSideBarProps> = ({ sidebarState }) => {
  //get AI chat history based on this file
  //if nothing is there set the below mwssage
  //it should take effect every time the file changes

  const { open, setOpen } = useSidebar();
  const currentFile = useStore((state) => state.currentFile);
  const currentFilePath =
    typeof currentFile === "string"
      ? currentFile
      : (currentFile?.path as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOpen(sidebarState);
  }, [sidebarState]);

  useEffect(() => {
    const currentAIPrevChat = localStorage.getItem("chatAi" + currentFilePath);
    if (currentAIPrevChat && currentAIPrevChat !== "") {
      try {
        const parsedMessage = JSON.parse(currentAIPrevChat);
        setMessages(parsedMessage);
      } catch (error) {
        console.error("Error in setting AI message", error);
        setMessages([
          { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
        ]);
      }
    } else {
      setMessages([
        { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
      ]);
    }
  }, [currentFilePath]);

  function handleAsk() {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    const currentFileValues = localStorage.getItem(currentFilePath);
    if (currentFileValues) {
      apiCall(currentFileValues, input)
        .then((aiOutput) => {
          if (aiOutput !== null) {
            setMessages((prevMessages) => {
              const updatedMessage = [
                ...prevMessages,
                { id: Date.now(), text: aiOutput, sender: "bot" },
              ];
              localStorage.setItem(
                "chatAi" + currentFilePath,
                JSON.stringify(updatedMessage),
              );
              return updatedMessage;
            });
          }
        })
        .catch((error) => {
          console.error("Error in API call:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              text: "Sorry, something went wrong.",
              sender: "bot",
            },
          ]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    setInput("");
  }

  return (
    <Sidebar
      className="relative h-full"
      style={
        { "--sidebar-width": open ? "20rem" : "0rem" } as React.CSSProperties
      }
    >
      <SidebarContent className="flex flex-col h-full p-4">
        <SidebarHeader className="pb-4">
          <h2 className="text-lg font-semibold">AI Chat</h2>
        </SidebarHeader>
        <div className="flex-1 overflow-y-auto space-y-4 flex flex-col">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-xs break-words ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground self-end"
                    : "bg-muted text-muted-foreground self-start"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="p-3 rounded-lg bg-muted text-muted-foreground flex items-center space-x-2">
                <Loader className="animate-spin w-4 h-4" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="mt-4 flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Button
            onClick={handleAsk}
            disabled={isLoading || !input.trim()}
            className="flex items-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AiSideBar;
