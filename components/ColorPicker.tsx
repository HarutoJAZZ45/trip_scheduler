
import { CHIC_PALETTE } from "@/constants/colors";
import { clsx } from "clsx";
import { Check } from "lucide-react";

interface ColorPickerProps {
    selectedColor: string;
    onSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
    return (
        <div className="flex flex-wrap gap-3">
            {CHIC_PALETTE.map((color) => (
                <button
                    key={color.value}
                    onClick={() => onSelect(color.value)}
                    className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-gray-100",
                        selectedColor === color.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    type="button"
                >
                    {selectedColor === color.value && <Check size={16} className="text-white/90" />}
                </button>
            ))}
        </div>
    );
}
