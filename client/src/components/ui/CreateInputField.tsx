import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

interface CreateInputFieldProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  creationType: "file" | "folder";
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const CreateInputField: React.FC<CreateInputFieldProps> = ({
  inputValue,
  setInputValue,
  creationType,
  onKeyDown,
  onCancel,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        placeholder={`Enter ${creationType} name`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
      />
      <button
        onClick={onCancel}
        aria-label="Cancel"
        className="text-red-500 hover:text-red-700"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
};

export default CreateInputField;