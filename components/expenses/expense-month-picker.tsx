"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExpenseMonthPickerProps {
  id?: string;
  onChange: (month: Date) => void;
  value: Date;
}

const normalizeMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const getYearOptions = (centerYear: number) => {
  const span = 6;

  return Array.from({ length: span * 2 + 1 }, (_, index) =>
    String(centerYear - span + index)
  );
};

export function ExpenseMonthPicker({
  id = "expense-month-picker",
  onChange,
  value,
}: ExpenseMonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMonth = useMemo(() => normalizeMonth(value), [value]);
  const [viewYear, setViewYear] = useState(selectedMonth.getFullYear());

  useEffect(() => {
    setViewYear(selectedMonth.getFullYear());
  }, [selectedMonth]);

  const yearOptions = useMemo(
    () => getYearOptions(selectedMonth.getFullYear()),
    [selectedMonth]
  );

  const monthIndexes = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index),
    []
  );

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
      <PopoverContent align="start" className="w-60 p-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
              Year
            </p>
            <Select
              onValueChange={(nextYear) => setViewYear(Number(nextYear))}
              value={String(viewYear)}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            {monthIndexes.map((monthIndex) => {
              const monthDate = new Date(viewYear, monthIndex, 1);
              const isSelected =
                selectedMonth.getFullYear() === viewYear &&
                selectedMonth.getMonth() === monthIndex;

              return (
                <button
                  className={cn(
                    "flex h-9 w-full items-center rounded-lg px-3 text-left font-medium text-sm transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground hover:bg-surface-container"
                  )}
                  key={monthIndex}
                  onClick={() => {
                    onChange(monthDate);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {format(monthDate, "MMMM")}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
