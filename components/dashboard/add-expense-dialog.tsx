"use client";

import { Plus, ReceiptText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ExpenseDatePicker } from "@/components/dashboard/expense-date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ExpenseCategory =
  | "Dining"
  | "Electronics"
  | "Essential"
  | "Lifestyle"
  | "Transport"
  | "Utilities"
  | "Work";

type PaymentMethod = "Card" | "Cash" | "Net Banking" | "UPI";

interface ExpenseFormState {
  amount: string;
  category: ExpenseCategory;
  date: string;
  merchant: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

const INITIAL_FORM_STATE: ExpenseFormState = {
  amount: "",
  category: "Essential",
  date: "2026-04-13",
  merchant: "",
  notes: "",
  paymentMethod: "UPI",
};

export function AddExpenseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ExpenseFormState>(INITIAL_FORM_STATE);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const setField = <K extends keyof ExpenseFormState>(
    key: K,
    value: ExpenseFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(false);
    setForm(INITIAL_FORM_STATE);
  };

  return (
    <>
      <Button
        className="shadow-[0_12px_28px_rgba(79,100,91,0.15)]"
        onClick={() => setIsOpen(true)}
        size="lg"
        type="button"
      >
        <Plus className="size-4" />
        Add Expense
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
          >
            <button
              aria-label="Close add expense dialog"
              className="absolute inset-0 bg-background/55 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              type="button"
            />

            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-modal="true"
              className="relative w-full max-w-xl rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_20px_50px_rgba(79,100,91,0.18)] sm:p-7"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              role="dialog"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[0.72rem] text-primary uppercase tracking-widest">
                    Quick Capture
                  </p>
                  <h2 className="mt-1 font-extrabold font-heading text-2xl text-foreground">
                    Add Expense
                  </h2>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Log a transaction into your Serene Ledger.
                  </p>
                </div>

                <Button
                  aria-label="Close dialog"
                  onClick={() => setIsOpen(false)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                      id="expense-amount"
                      inputMode="decimal"
                      onChange={(event) =>
                        setField("amount", event.target.value)
                      }
                      placeholder="e.g. 2450"
                      required
                      value={form.amount}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="expense-date">Date</Label>
                    <ExpenseDatePicker
                      id="expense-date"
                      onChange={(nextDate) => setField("date", nextDate)}
                      value={form.date}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="expense-category">Category</Label>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          setField("category", value as ExpenseCategory);
                        }
                      }}
                      value={form.category}
                    >
                      <SelectTrigger className="w-full" id="expense-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Essential">Essential</SelectItem>
                        <SelectItem value="Dining">Dining</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="expense-method">Payment Method</Label>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          setField("paymentMethod", value as PaymentMethod);
                        }
                      }}
                      value={form.paymentMethod}
                    >
                      <SelectTrigger className="w-full" id="expense-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Net Banking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expense-merchant">Merchant</Label>
                  <Input
                    id="expense-merchant"
                    onChange={(event) =>
                      setField("merchant", event.target.value)
                    }
                    placeholder="Store, service, or subscription"
                    required
                    value={form.merchant}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="expense-notes">Notes</Label>
                  <Textarea
                    id="expense-notes"
                    onChange={(event) => setField("notes", event.target.value)}
                    placeholder="Optional context"
                    value={form.notes}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <Button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <ReceiptText className="size-4" />
                    Save Expense
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
