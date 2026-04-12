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
import { Filter, Home, Search, ShoppingCart, Utensils } from "lucide-react";
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

interface TransactionRow {
  amount: number;
  category: "Electronics" | "Essential" | "Lifestyle";
  date: string;
  description: string;
  merchant: string;
  status: "Completed" | "Scheduled";
}

const transactionRows: TransactionRow[] = [
  {
    merchant: "Amazon India",
    description: "Electronic Accessories",
    category: "Electronics",
    date: "Oct 14, 2024",
    amount: 2450,
    status: "Completed",
  },
  {
    merchant: "Blue Tokai Coffee",
    description: "Cafe & Beverages",
    category: "Lifestyle",
    date: "Oct 12, 2024",
    amount: 850,
    status: "Completed",
  },
  {
    merchant: "Property Rent",
    description: "Housing Monthly",
    category: "Essential",
    date: "Oct 05, 2024",
    amount: 35_000,
    status: "Scheduled",
  },
  {
    merchant: "Urban Ladder",
    description: "Home Upgrade",
    category: "Lifestyle",
    date: "Oct 03, 2024",
    amount: 4200,
    status: "Completed",
  },
  {
    merchant: "Reliance Fresh",
    description: "Groceries",
    category: "Essential",
    date: "Oct 02, 2024",
    amount: 3260,
    status: "Completed",
  },
  {
    merchant: "Croma",
    description: "Smart Home Device",
    category: "Electronics",
    date: "Sep 29, 2024",
    amount: 11_990,
    status: "Completed",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

const iconByCategory = {
  Electronics: ShoppingCart,
  Lifestyle: Utensils,
  Essential: Home,
} as const;

const iconWrapperByCategory = {
  Electronics: "bg-secondary-container/70 text-secondary",
  Lifestyle: "bg-tertiary-container/60 text-tertiary",
  Essential: "bg-primary-container/80 text-primary",
} as const;

const categoryBadgeByCategory = {
  Electronics: "secondary",
  Lifestyle: "destructive-light",
  Essential: "primary-light",
} as const;

const statusStyleByValue = {
  Completed: "text-primary",
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
      const Icon = iconByCategory[row.original.category];

      return (
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${iconWrapperByCategory[row.original.category]}`}
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
        variant={categoryBadgeByCategory[row.original.category]}
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
      <div className="text-right font-semibold text-foreground text-sm tabular-nums">
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

export function DashboardTransactionsTable() {
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
  }, [searchTerm]);

  useEffect(() => {
    const maxPageIndex = Math.max(
      0,
      Math.ceil(filteredRows.length / pagination.pageSize) - 1
    );

    if (pagination.pageIndex > maxPageIndex) {
      setPagination((current) => ({ ...current, pageIndex: maxPageIndex }));
    }
  }, [filteredRows.length, pagination.pageIndex, pagination.pageSize]);

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
          <DataGridTable />
        </DataGridContainer>
        <DataGridPagination className="mt-3" />
      </DataGrid>
    </div>
  );
}
