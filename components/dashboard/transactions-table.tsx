"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Filter, Home, Search, ShoppingCart, Utensils } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataGrid,
  DataGridContainer,
} from "@/components/ui/data-grid/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid/data-grid-table";
import { Input } from "@/components/ui/input";
import type { TransactionRowDTO } from "@/lib/data/finance-types";
import { expenseStatusLabel } from "@/lib/expense-display";

interface TransactionRow {
  amount: number;
  category: string;
  date: string;
  description: string;
  merchant: string;
  status: "Completed" | "Pending" | "Scheduled";
}

function mapDto(r: TransactionRowDTO): TransactionRow {
  return {
    merchant: r.merchant,
    description: r.description,
    category: r.category,
    date: r.dateDisplay,
    amount: r.amountPaise / 100,
    status: expenseStatusLabel(r.status),
  };
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const iconByCategory: Record<string, LucideIcon> = {
  Electronics: ShoppingCart,
  Lifestyle: Utensils,
  Essential: Home,
};

const iconWrapperByCategory: Record<string, string> = {
  Electronics: "bg-secondary-container/70 text-secondary",
  Lifestyle: "bg-tertiary-container/60 text-tertiary",
  Essential: "bg-primary-container/80 text-primary",
};

const categoryBadgeByCategory: Record<
  string,
  "secondary" | "destructive-light" | "primary-light" | "outline"
> = {
  Electronics: "secondary",
  Lifestyle: "destructive-light",
  Essential: "primary-light",
};

const statusStyleByValue = {
  Completed: "text-primary",
  Pending: "text-amber-700 dark:text-amber-400",
  Scheduled: "text-muted-foreground",
} as const;

const columns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "merchant",
    header: () => (
      <span className="font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-widest">
        Transaction
      </span>
    ),
    cell: ({ row }) => {
      const Icon = iconByCategory[row.original.category] ?? ShoppingCart;
      const wrap =
        iconWrapperByCategory[row.original.category] ??
        "bg-surface-container-high text-foreground";

      return (
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${wrap}`}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground text-sm">
              {row.original.merchant}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {row.original.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => (
      <span className="font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-widest">
        Category
      </span>
    ),
    cell: ({ row }) => (
      <Badge
        className="font-semibold text-[0.65rem] uppercase tracking-wide"
        variant={categoryBadgeByCategory[row.original.category] ?? "outline"}
      >
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "date",
    header: () => (
      <span className="font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-widest">
        Date
      </span>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="text-right font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-widest">
        Amount
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="text-right font-semibold text-foreground text-sm tabular-nums"
        data-sensitive-balance="true"
      >
        {currencyFormatter.format(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-widest">
        Status
      </span>
    ),
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold text-[0.7rem] uppercase tracking-wide ${statusStyleByValue[row.original.status]}`}
      >
        <span
          className={`size-1.5 rounded-full ${
            row.original.status === "Completed"
              ? "bg-primary"
              : "bg-muted-foreground"
          }`}
        />
        {row.original.status}
      </span>
    ),
  },
];

interface DashboardTransactionsTableProps {
  rows: TransactionRowDTO[];
}

export function DashboardTransactionsTable({
  rows,
}: DashboardTransactionsTableProps) {
  const transactionRows = useMemo(() => rows.map(mapDto), [rows]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return transactionRows;
    }

    return transactionRows.filter((row) => {
      return `${row.merchant} ${row.description} ${row.category}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [searchTerm, transactionRows]);

  useEffect(() => {
    const maxPageIndex = Math.max(
      0,
      Math.ceil(filteredRows.length / pagination.pageSize) - 1
    );

    if (pagination.pageIndex > maxPageIndex) {
      setPagination((current) => ({ ...current, pageIndex: maxPageIndex }));
    }
  }, [filteredRows.length, pagination.pageIndex, pagination.pageSize]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            placeholder="Search transactions..."
            type="search"
            value={searchTerm}
          />
        </div>
        <Button size="icon-sm" type="button" variant="outline">
          <Filter className="size-4" />
          <span className="sr-only">Filter transactions</span>
        </Button>
      </div>

      <DataGrid
        recordCount={filteredRows.length}
        table={table}
        tableLayout={{
          rowBorder: true,
          headerBorder: true,
          width: "auto",
        }}
      >
        <DataGridContainer border={false} className="bg-transparent p-0 ring-0">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              initial={{ opacity: 0, y: 6 }}
              key={`${pagination.pageIndex}-${pagination.pageSize}`}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <DataGridTable />
            </motion.div>
          </AnimatePresence>
        </DataGridContainer>
        <DataGridPagination className="mt-3" />
      </DataGrid>
    </div>
  );
}
