"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExpenseDatePickerProps {
  id?: string;
  onChange: (nextDate: string) => void;
  value: string;
}

const parseIsoDate = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export function ExpenseDatePicker({
  id = "expense-date-picker",
  onChange,
  value,
}: ExpenseDatePickerProps) {
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const today = useMemo(() => new Date(), []);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="w-full justify-start border border-border/70 bg-surface-container-low font-normal"
            id={id}
            variant="outline"
          >
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          defaultMonth={selectedDate}
          mode="single"
          onSelect={(nextDate) => {
            if (!nextDate) {
              return;
            }

            onChange(format(nextDate, "yyyy-MM-dd"));
          }}
          selected={selectedDate}
          toDate={today}
        />
      </PopoverContent>
    </Popover>
  );
}

export function DatePickerSimple() {
  const [date, setDate] = useState<Date>();

  return (
    <Field className="mx-auto w-44">
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              className="justify-start font-normal"
              id="date-picker-simple"
              variant="outline"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            defaultMonth={date}
            mode="single"
            onSelect={setDate}
            selected={date}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
