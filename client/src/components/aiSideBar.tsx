import React, { useEffect, useState } from "react";
import { apiCall } from "@/services/AiModel";
import { useStore } from "@/stores/states";
import { Button } from "@/components/ui/button";
import { Loader, User, Bot, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Delta } from "quill";
import ChatInput from "./aisidebar/ChatInput";

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface AiSideBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiSideBar: React.FC<AiSideBarProps> = ({ open, onOpenChange }) => {
  console.log("components aiSideBar called");
  const currentFile = useStore((state) => state.currentFile);

  const currentFilePath =
    typeof currentFile === "string"
      ? currentFile
      : (currentFile?.path as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    //get data from github
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

  function handleAsk(input: string) {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    console.log("the backend ai call");
    //get new data from state vatiables

    const currentFileValues = useStore.getState().currentFileContent;
    let plainText = "";
    if (currentFileValues) {
      const delta = new Delta(currentFileValues);
      plainText = delta.reduce(
        (text, op) =>
          text + (op.insert && typeof op.insert === "string" ? op.insert : ""),
        "",
      );
    }

    if (plainText) {
      apiCall(plainText, input)
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
  }

  const ChatContent = () => (
    <>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === "bot" ? "bg-primary" : "bg-secondary"
                }`}
              >
                {msg.sender === "bot" ? (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <User className="w-4 h-4 text-secondary-foreground" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg max-w-[70%] break-words ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                <Loader className="animate-spin w-4 h-4" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t">
        <div className="flex gap-2">
          <ChatInput handleAsk={handleAsk} isLoading={isLoading} />
        </div>
        {messages.length > 1 && (
          <Button variant="ghost" size="sm" className="mt-2 w-full text-xs">
            Clear Chat
          </Button>
        )}
      </div>
    </>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <div className="flex flex-col h-full p-6">
            <SheetHeader className="pb-4">
              <SheetTitle>AI Assistant</SheetTitle>
            </SheetHeader>
            <ChatContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use custom sidebar
  return (
    <aside
      className={`
        border-l bg-background transition-all duration-300 ease-in-out
        ${open ? "w-100" : "w-0"}
        overflow-hidden flex-shrink-0
      `}
    >
      <div
        className={`
          w-80 h-full flex flex-col p-6
          ${!open ? "invisible" : "visible"}
        `}
      >
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ChatContent />
      </div>
    </aside>
  );
};

export default AiSideBar;
