import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import "./CalendarStyles.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("calendar-padding", className)}
      classNames={{
        months: "flex-col-sm-flex-row-space-y-4-sm-space-x-4-sm-space-y-0",
        month: "month-space-y",
        caption: "caption-style",
        caption_label: "caption-label",
        nav: "nav-style",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "nav-button-style"
        ),
        nav_button_previous: "nav-button-previous",
        nav_button_next: "nav-button-next",
        table: "table-style",
        head_row: "head-row-style",
        head_cell: "head-cell-style",
        row: "row-style",
        cell: "cell-style",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "day-button-style"
        ),
        day_range_end: "day-range-end",
        day_selected: "day-selected",
        day_today: "day-today",
        day_outside: "day-outside",
        day_disabled: "day-disabled",
        day_range_middle: "day-range-middle",
        day_hidden: "day-hidden",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="icon-left" />,
        IconRight: ({ ...props }) => <ChevronRight className="icon-right" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
