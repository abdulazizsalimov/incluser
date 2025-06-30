import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface AccessibleSliderProps {
  id: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
  label: string;
  unit?: string;
}

export default function AccessibleSlider({
  id,
  value,
  onValueChange,
  min,
  max,
  step,
  className,
  label,
  unit = "%"
}: AccessibleSliderProps) {
  const ariaLabel = `${label} ${value[0]}${unit}`;
  
  return (
    <SliderPrimitive.Root
      id={id}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      aria-label={ariaLabel}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value[0]}
      aria-valuetext={`${value[0]}${unit}`}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label={ariaLabel}
      />
    </SliderPrimitive.Root>
  );
}