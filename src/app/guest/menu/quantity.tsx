import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityProps {
  onChange: (value: number) => void;
  value: number;
}

const Quantity = (props: QuantityProps) => {
  const { onChange, value } = props;

  const handleDecrement = () => {
    onChange(value - 1);
  };

  const handleIncrement = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex gap-1 ">
      <Button
        className="h-6 w-6 p-0"
        onClick={handleDecrement}
        disabled={value === 0}
      >
        <Minus className="w-3 h-3" />
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="h-6 p-1 w-8 text-center"
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          const numberValue = Number(value);
          if (!isNaN(numberValue)) {
            onChange(numberValue);
          }
        }}
      />
      <Button className="h-6 w-6 p-0" onClick={handleIncrement}>
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default Quantity;
