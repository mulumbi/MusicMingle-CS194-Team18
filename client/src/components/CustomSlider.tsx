import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type CustomSliderProps = React.ComponentProps<typeof Slider> & {
  label: string;
};

export const CustomSlider = ({ label, className, ...props }: CustomSliderProps) => {
  return (
    <div className="filter-action">
      <h5>{label}</h5>
      <Slider
        className={cn("w-full", className)}
        {...props}
      />
    </div>
  );
};

