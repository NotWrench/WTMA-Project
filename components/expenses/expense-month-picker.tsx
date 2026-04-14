"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpenseMonthPickerProps {
  id?: string;
  onChange: (month: Date) => void;
  value: Date;
}

const normalizeMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export function ExpenseMonthPicker({
  id = "expense-month-picker",
  onChange,
  value,
}: ExpenseMonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMonth = useMemo(() => normalizeMonth(value), [value]);
  const nextFiveYears = useMemo(() => new Date().getFullYear() + 5, []);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger
        render={
          <Button className="justify-start" id={id} size="sm" variant="outline">
            <CalendarDays className="size-4" />
            {format(selectedMonth, "MMM yyyy")}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          captionLayout="dropdown-months"
          defaultMonth={selectedMonth}
          fromYear={2020}
          mode="single"
          month={selectedMonth}
          onMonthChange={(nextMonth) => onChange(normalizeMonth(nextMonth))}
          onSelect={(nextDate) => {
            if (!nextDate) {
              return;
            }

            onChange(normalizeMonth(nextDate));
            setIsOpen(false);
          }}
          selected={selectedMonth}
          showOutsideDays={false}
          toYear={nextFiveYears}
        />
      </PopoverContent>
    </Popover>
  );
}
