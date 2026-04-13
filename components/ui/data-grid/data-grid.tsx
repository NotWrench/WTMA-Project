"use client";

import type {
  Column,
  ColumnFiltersState,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { createContext, type ReactNode, useContext } from "react";

import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    cellClassName?: string;
    expandedContent?: (row: TData) => ReactNode;
    headerClassName?: string;
    headerTitle?: string;
    skeleton?: ReactNode;
  }
}

/** Label for headers / column visibility: `meta.headerTitle`, string `columnDef.header`, or `column.id`. */
export function getColumnHeaderLabel<TData, TValue>(
  column: Column<TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined;
  if (typeof meta?.headerTitle === "string") {
    return meta.headerTitle;
  }
  const defHeader = column.columnDef.header;
  if (typeof defHeader === "string") {
    return defHeader;
  }
  return String(column.id);
}

export interface DataGridApiFetchParams {
  filters?: ColumnFiltersState;
  pageIndex: number;
  pageSize: number;
  searchQuery?: string;
  sorting?: SortingState;
}

export interface DataGridApiResponse<T> {
  data: T[];
  empty: boolean;
  pagination: {
    total: number;
    page: number;
  };
}

export interface DataGridContextProps<TData extends object> {
  isLoading: boolean;
  props: DataGridProps<TData>;
  recordCount: number;
  table: Table<TData>;
}

export interface DataGridRequestParams {
  columnFilters?: ColumnFiltersState;
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
}

export interface DataGridProps<TData extends object> {
  allRowsLoadedMessage?: ReactNode | string;
  children?: ReactNode;
  className?: string;
  emptyMessage?: ReactNode | string;
  fetchingMoreMessage?: ReactNode | string;
  isLoading?: boolean;
  loadingMessage?: ReactNode | string;
  loadingMode?: "skeleton" | "spinner";
  onRowClick?: (row: TData) => void;
  recordCount: number;
  table?: Table<TData>;
  tableClassNames?: {
    base?: string;
    header?: string;
    headerRow?: string;
    headerSticky?: string;
    body?: string;
    bodyRow?: string;
    footer?: string;
    edgeCell?: string;
  };
  tableLayout?: {
    dense?: boolean;
    cellBorder?: boolean;
    rowBorder?: boolean;
    rowRounded?: boolean;
    stripped?: boolean;
    headerBackground?: boolean;
    headerBorder?: boolean;
    headerSticky?: boolean;
    width?: "auto" | "fixed";
    columnsVisibility?: boolean;
    columnsResizable?: boolean;
    columnsResizeMode?: "onChange" | "onEnd";
    columnsPinnable?: boolean;
    columnsMovable?: boolean;
    columnsDraggable?: boolean;
    rowsDraggable?: boolean;
    rowsPinnable?: boolean;
  };
}

const DataGridContext = createContext<DataGridContextProps<object> | undefined>(
  undefined
);

function useDataGrid<TData extends object>() {
  const context = useContext(DataGridContext) as
    | DataGridContextProps<TData>
    | undefined;
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider");
  }
  return context;
}

function DataGridProvider<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData> & { table: Table<TData> }) {
  const value: DataGridContextProps<TData> = {
    props,
    table,
    recordCount: props.recordCount,
    isLoading: props.isLoading ?? false,
  };

  return (
    <DataGridContext.Provider
      value={value as unknown as DataGridContextProps<object>}
    >
      {children}
    </DataGridContext.Provider>
  );
}

function DataGrid<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData>) {
  const defaultProps: Partial<DataGridProps<TData>> = {
    loadingMode: "skeleton",
    tableLayout: {
      dense: false,
      cellBorder: false,
      rowBorder: false,
      rowRounded: false,
      stripped: false,
      headerSticky: false,
      headerBackground: true,
      headerBorder: false,
      width: "fixed",
      columnsVisibility: false,
      columnsResizable: false,
      columnsResizeMode: "onEnd",
      columnsPinnable: false,
      columnsMovable: false,
      columnsDraggable: false,
      rowsDraggable: false,
      rowsPinnable: false,
    },
    tableClassNames: {
      base: "",
      header: "",
      headerRow: "",
      headerSticky:
        "sticky top-0 z-15 bg-surface-container-low/90 backdrop-blur-xl",
      body: "",
      bodyRow: "",
      footer: "",
      edgeCell: "",
    },
  };

  const mergedProps: DataGridProps<TData> = {
    ...defaultProps,
    ...props,
    tableLayout: {
      ...defaultProps.tableLayout,
      ...(props.tableLayout || {}),
    },
    tableClassNames: {
      ...defaultProps.tableClassNames,
      ...(props.tableClassNames || {}),
    },
  };

  // Ensure table is provided
  if (!table) {
    throw new Error('DataGrid requires a "table" prop');
  }

  return (
    <DataGridProvider table={table} {...mergedProps}>
      {children}
    </DataGridProvider>
  );
}

function DataGridContainer({
  children,
  className,
  border = true,
}: {
  children: ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl bg-surface-container-low p-1",
        border && "ring-1 ring-border/20",
        className
      )}
      data-slot="data-grid"
    >
      {children}
    </div>
  );
}

export { DataGrid, DataGridContainer, DataGridProvider, useDataGrid };
