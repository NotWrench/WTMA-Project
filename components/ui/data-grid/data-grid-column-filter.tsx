"use client";

import type { Column } from "@tanstack/react-table";
import { CheckIcon, CirclePlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataGridColumnFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  title?: string;
}

function DataGridColumnFilter<TData, TValue>({
  column,
  title,
  options,
}: DataGridColumnFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size="sm" variant="outline">
            <CirclePlusIcon className="size-4" />
            {title}
            {selectedValues?.size > 0 && (
              <>
                <Separator className="mx-2 h-4" orientation="vertical" />
                <Badge
                  className="rounded-lg px-1 font-normal lg:hidden"
                  variant="secondary"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.size > 2 ? (
                    <Badge
                      className="rounded-lg px-1 font-normal"
                      variant="secondary"
                    >
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          className="rounded-lg px-1 font-normal"
                          key={option.value}
                          variant="secondary"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-50 rounded-xl bg-surface-container-lowest p-0 shadow-[0_12px_32px_rgba(79,100,91,0.08)] ring-1 ring-border/20"
      >
        <div className="p-2">
          <Input
            className="h-8 bg-surface-container-high/75"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={title}
            value={searchQuery}
          />
        </div>
        <div className="max-h-75 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              No results found.
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <button
                    className={cn(
                      "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden",
                      "hover:bg-surface-container-high hover:text-foreground focus:bg-surface-container-high focus:text-foreground"
                    )}
                    key={option.value}
                    onClick={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") {
                        return;
                      }

                      event.preventDefault();
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }

                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                    type="button"
                  >
                    <div
                      className={cn(
                        "me-2 flex h-4 w-4 items-center justify-center rounded-md border border-primary/30 bg-surface-container-lowest",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {selectedValues.size > 0 && (
            <>
              <div className="-mx-1 my-1 h-px bg-surface-container-high" />
              <div className="p-1">
                <button
                  className="relative flex cursor-default select-none items-center justify-center rounded-lg px-2 py-1.5 text-sm outline-hidden hover:bg-surface-container-high hover:text-foreground focus:bg-surface-container-high focus:text-foreground"
                  onClick={() => column?.setFilterValue(undefined)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      column?.setFilterValue(undefined);
                    }
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DataGridColumnFilter, type DataGridColumnFilterProps };
