import { useState } from "react";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

interface ChatInputProps {
  handleAsk: (promptInput: string) => void;
  isLoading: boolean;
}
export default function ChatInput({ handleAsk, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  return (
    <>
      <Input
        key="promtp-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button
        onClick={() => {
          handleAsk(input);
          setInput("");
        }}
        disabled={isLoading || !input.trim()}
        size="icon"
      >
        <Send className="w-4 h-4" />
      </Button>
    </>
  );
}
