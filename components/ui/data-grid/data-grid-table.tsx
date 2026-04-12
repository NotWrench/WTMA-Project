"use client";

import {
  type Cell,
  type Column,
  flexRender,
  type Header,
  type HeaderGroup,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { cva } from "class-variance-authority";
import {
  type CSSProperties,
  memo,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataGrid } from "@/components/ui/data-grid/data-grid";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const headerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "h-9 px-2.5",
      default: "px-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const bodyCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "px-2.5 py-2",
      default: "px-4 py-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const footerCellSpacingVariants = cva("", {
  variants: {
    size: {
      dense: "px-2.5 py-2",
      default: "px-4 py-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function getPinningStyles<TData extends object>(
  column: Column<TData>
): CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  (ref as { current: T | null }).current = value;
}

type DataGridResizeStartEvent =
  | ReactMouseEvent<HTMLDivElement>
  | ReactTouchEvent<HTMLDivElement>;

type DataGridResizeDocumentEvent =
  | globalThis.MouseEvent
  | globalThis.TouchEvent;

function isDataGridTouchEvent(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
): event is ReactTouchEvent<HTMLDivElement> | globalThis.TouchEvent {
  return "touches" in event;
}

function getDataGridResizeEventClientX(
  event: DataGridResizeStartEvent | DataGridResizeDocumentEvent
) {
  if (isDataGridTouchEvent(event)) {
    return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX;
  }

  return event.clientX;
}

function startDataGridColumnResizeOnEnd<TData extends object>(
  event: DataGridResizeStartEvent,
  header: Header<TData, unknown>,
  table: Table<TData>
) {
  const column = table.getColumn(header.column.id);

  if (!column?.getCanResize()) {
    return;
  }
  if (isDataGridTouchEvent(event) && event.touches.length > 1) {
    return;
  }

  event.persist?.();

  const ownerDocument = event.currentTarget.ownerDocument;
  const previousBodyCursor = ownerDocument.body.style.cursor;
  const previousDocumentCursor = ownerDocument.documentElement.style.cursor;
  const startSize = header.getSize();
  const dragStartClientX = getDataGridResizeEventClientX(event);
  const headerCell = event.currentTarget.closest("th");
  const headerRect = headerCell?.getBoundingClientRect();
  let headerEdge: number | undefined;
  if (headerRect) {
    if (table.options.columnResizeDirection === "rtl") {
      headerEdge = headerRect.left;
    } else {
      headerEdge = headerRect.right;
    }
  }
  const startOffset =
    typeof headerEdge === "number" && Number.isFinite(headerEdge)
      ? headerEdge
      : dragStartClientX;

  if (typeof dragStartClientX !== "number" || typeof startOffset !== "number") {
    return;
  }

  ownerDocument.body.style.cursor = "col-resize";
  ownerDocument.documentElement.style.cursor = "col-resize";

  const columnSizingStart = header
    .getLeafHeaders()
    .map(
      (leafHeader) =>
        [leafHeader.column.id, leafHeader.column.getSize()] as [string, number]
    );
  const directionMultiplier =
    table.options.columnResizeDirection === "rtl" ? -1 : 1;

  const updateOffset = (clientXPos?: number, commit = false) => {
    if (typeof clientXPos !== "number") {
      return;
    }

    const nextColumnSizing: Record<string, number> = {};
    const deltaOffset = (clientXPos - dragStartClientX) * directionMultiplier;
    const deltaPercentage = Math.max(deltaOffset / startSize, -0.999_999);

    for (const [columnId, headerSize] of columnSizingStart) {
      nextColumnSizing[columnId] =
        Math.round(
          Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
        ) / 100;
    }

    table.setColumnSizingInfo((old) => ({
      ...old,
      startOffset,
      startSize,
      deltaOffset,
      deltaPercentage,
      columnSizingStart,
      isResizingColumn: column.id,
    }));

    if (commit) {
      table.setColumnSizing((old) => ({
        ...old,
        ...nextColumnSizing,
      }));
    }
  };

  const endResize = (clientXPos?: number) => {
    updateOffset(clientXPos, true);
    table.setColumnSizingInfo((old) => ({
      ...old,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      columnSizingStart: [],
    }));
    ownerDocument.body.style.cursor = previousBodyCursor;
    ownerDocument.documentElement.style.cursor = previousDocumentCursor;
  };

  const mouseMoveHandler = (moveEvent: globalThis.MouseEvent) => {
    updateOffset(moveEvent.clientX);
  };
  const mouseUpHandler = (upEvent: globalThis.MouseEvent) => {
    ownerDocument.removeEventListener("mousemove", mouseMoveHandler);
    ownerDocument.removeEventListener("mouseup", mouseUpHandler);
    endResize(upEvent.clientX);
  };
  const touchMoveHandler = (moveEvent: globalThis.TouchEvent) => {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
    }

    updateOffset(getDataGridResizeEventClientX(moveEvent));
  };
  const touchEndHandler = (endEvent: globalThis.TouchEvent) => {
    ownerDocument.removeEventListener("touchmove", touchMoveHandler);
    ownerDocument.removeEventListener("touchend", touchEndHandler);

    if (endEvent.cancelable) {
      endEvent.preventDefault();
      endEvent.stopPropagation();
    }

    endResize(getDataGridResizeEventClientX(endEvent));
  };

  const passiveIfSupported = { passive: false } as const;

  if (isDataGridTouchEvent(event)) {
    ownerDocument.addEventListener(
      "touchmove",
      touchMoveHandler,
      passiveIfSupported
    );
    ownerDocument.addEventListener(
      "touchend",
      touchEndHandler,
      passiveIfSupported
    );
  } else {
    ownerDocument.addEventListener(
      "mousemove",
      mouseMoveHandler,
      passiveIfSupported
    );
    ownerDocument.addEventListener(
      "mouseup",
      mouseUpHandler,
      passiveIfSupported
    );
  }

  table.setColumnSizingInfo((old) => ({
    ...old,
    startOffset,
    startSize,
    deltaOffset: 0,
    deltaPercentage: 0,
    columnSizingStart,
    isResizingColumn: column.id,
  }));
}

type DataGridTablePinnedBoundary = "top" | "bottom";

function getDataGridTableRowSections<TData extends object>(
  table: Table<TData>,
  rowsPinnable?: boolean
) {
  if (!rowsPinnable) {
    return {
      topRows: [] as Row<TData>[],
      centerRows: table.getRowModel().rows as Row<TData>[],
      bottomRows: [] as Row<TData>[],
    };
  }

  return {
    topRows: table.getTopRows() as Row<TData>[],
    centerRows: table.getCenterRows() as Row<TData>[],
    bottomRows: table.getBottomRows() as Row<TData>[],
  };
}

function getDataGridTableResolvedRows<TData extends object>(
  table: Table<TData>,
  rowsPinnable?: boolean
) {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    rowsPinnable
  );
  const resolvedRows: Array<{
    row: Row<TData>;
    pinnedBoundary?: DataGridTablePinnedBoundary;
  }> = [];

  for (const [index, row] of topRows.entries()) {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === topRows.length - 1 &&
        (centerRows.length > 0 || bottomRows.length > 0)
          ? "top"
          : undefined,
    });
  }

  for (const row of centerRows) {
    resolvedRows.push({ row });
  }

  for (const [index, row] of bottomRows.entries()) {
    resolvedRows.push({
      row,
      pinnedBoundary:
        index === 0 && (centerRows.length > 0 || topRows.length > 0)
          ? "bottom"
          : undefined,
    });
  }

  return resolvedRows;
}

function DataGridTableFillCol() {
  const { props } = useDataGrid();

  if (!props.tableLayout?.columnsResizable) {
    return null;
  }

  return (
    <col
      data-slot="data-grid-table-fill-col"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableFillHeadCell() {
  const { props } = useDataGrid();

  if (!props.tableLayout?.columnsResizable) {
    return null;
  }

  return (
    <th
      className="p-0"
      data-slot="data-grid-table-fill-head-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableFillBodyCell() {
  const { props } = useDataGrid();

  if (!props.tableLayout?.columnsResizable) {
    return null;
  }

  return (
    <td
      aria-hidden="true"
      className="p-0"
      data-slot="data-grid-table-fill-body-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableFillFootCell() {
  const { props } = useDataGrid();

  if (!props.tableLayout?.columnsResizable) {
    return null;
  }

  return (
    <td
      aria-hidden="true"
      className="border-border/20 border-t p-0"
      data-slot="data-grid-table-fill-foot-cell"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props, table } = useDataGrid();
  const visibleColumns = table.getVisibleLeafColumns();

  const getColumnWidthStyle = <TData,>(column: Column<TData>) => {
    if (props.tableLayout?.columnsResizable) {
      return { width: `calc(var(--col-${column.id}-size) * 1px)` };
    }

    if (props.tableLayout?.width === "fixed") {
      return { width: column.getSize() };
    }

    return undefined;
  };

  /**
   * Compute column widths as CSS custom properties once upfront (memoized).
   * Cells reference these via calc(var(--col-X-size) * 1px) so the browser
   * handles width propagation without per-cell getSize() calls or React
   * re-renders of the body.
   */
  const columnSizeVars = useMemo(() => {
    if (!props.tableLayout?.columnsResizable) {
      return undefined;
    }
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tableLayout?.columnsResizable, table.getFlatHeaders]);

  return (
    <table
      className={cn(
        "caption-bottom text-left align-middle font-normal text-foreground text-sm rtl:text-right",
        props.tableLayout?.columnsResizable ? "min-w-0" : "w-full min-w-full",
        props.tableLayout?.width === "auto" ? "table-auto" : "table-fixed",
        !props.tableLayout?.columnsResizable && "",
        !props.tableLayout?.columnsDraggable &&
          "border-separate border-spacing-0",
        props.tableClassNames?.base
      )}
      data-slot="data-grid-table"
      style={
        props.tableLayout?.columnsResizable
          ? {
              ...columnSizeVars,
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
            }
          : undefined
      }
    >
      <colgroup>
        {visibleColumns.map((column) => (
          <col key={column.id} style={getColumnWidthStyle(column)} />
        ))}
        <DataGridTableFillCol />
      </colgroup>
      {children}
    </table>
  );
}

function DataGridTableViewport({
  children,
  className,
  viewportRef,
  style,
}: {
  children: ReactNode;
  className?: string;
  viewportRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
}) {
  const { props, table } = useDataGrid();
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(
    null
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const handleViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      setViewportElement(node);
      assignRef(viewportRef, node);
    },
    [viewportRef]
  );
  const fillWidth =
    props.tableLayout?.columnsResizable && containerWidth > 0
      ? Math.max(0, containerWidth - table.getTotalSize())
      : 0;

  useEffect(() => {
    if (!(viewportElement && props.tableLayout?.columnsResizable)) {
      return;
    }

    const scrollViewport =
      (viewportElement.closest(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLElement | null) ?? viewportElement.parentElement;
    const measurementTarget = scrollViewport ?? viewportElement;

    const syncContainerWidth = () => {
      setContainerWidth(measurementTarget.clientWidth);
    };

    syncContainerWidth();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(syncContainerWidth);
    observer.observe(measurementTarget);

    return () => {
      observer.disconnect();
    };
  }, [props.tableLayout?.columnsResizable, viewportElement]);

  return (
    <div
      className={cn("relative min-w-full align-top", className)}
      data-slot="data-grid-table-viewport"
      ref={handleViewportRef}
      style={{
        ...(props.tableLayout?.columnsResizable
          ? {
              width: `calc(${table.getTotalSize()}px + var(--data-grid-fill-size, 0px))`,
              ["--data-grid-fill-size" as string]: `${fillWidth}px`,
            }
          : undefined),
        ...style,
      }}
    >
      {children}
      <DataGridTableResizeIndicator viewportElement={viewportElement} />
    </div>
  );
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <thead
      className={cn(
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky
      )}
    >
      {children}
    </thead>
  );
}

function DataGridTableHeadRow<TData extends object>({
  children,
  headerGroup,
}: {
  children: ReactNode;
  headerGroup: HeaderGroup<TData>;
}) {
  const { props } = useDataGrid<TData>();

  return (
    <tr
      className={cn(
        "bg-surface-container-low",
        props.tableLayout?.headerBorder &&
          "[&>th]:border-border/20 [&>th]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped && "bg-transparent",
        props.tableLayout?.headerBackground === false && "bg-transparent",
        props.tableClassNames?.headerRow
      )}
      key={headerGroup.id}
    >
      {children}
      <DataGridTableFillHeadCell />
    </tr>
  );
}

function DataGridTableHeadRowCell<TData extends object>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  header: Header<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid<TData>();

  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1;
  let pinnedColSide: "left" | "right" | undefined;
  if (isLastLeftPinned) {
    pinnedColSide = "left";
  } else if (isFirstRightPinned) {
    pinnedColSide = "right";
  }
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  });

  return (
    <th
      className={cn(
        "relative h-10 text-left align-middle font-normal text-secondary-foreground/80 rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacing,
        props.tableLayout?.cellBorder && "border-border/20 border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "overflow-visible",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          isLastVisibleColumn &&
          "pe-8",
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          "data-pinned:bg-surface-container-high/95 data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border/20",
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 ||
          column.getIndex() === header.headerGroup.headers.length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
      data-last-col={pinnedColSide}
      data-pinned={isPinned || undefined}
      key={header.id}
      ref={dndRef}
      style={{
        ...(props.tableLayout?.width === "fixed" &&
          !props.tableLayout?.columnsResizable && {
            width: header.getSize(),
          }),
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--header-${header.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
    >
      {children}
    </th>
  );
}

function DataGridTableHeadRowCellResize<TData extends object>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const { props, table } = useDataGrid<TData>();
  const { column } = header;
  const isLastVisibleColumn =
    column.getIndex() ===
    header.getContext().table.getVisibleLeafColumns().length - 1;
  const isResizeModeOnEnd =
    (props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode) ===
    "onEnd";
  let resizeIndicatorClassName =
    "opacity-100 before:block before:w-0.5 before:bg-primary";
  if (isResizeModeOnEnd) {
    resizeIndicatorClassName = "opacity-100";
  } else if (isLastVisibleColumn) {
    resizeIndicatorClassName =
      "opacity-100 before:absolute before:inset-y-0 before:end-0 before:block before:w-0.5 before:bg-primary";
  }

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table);
      return;
    }

    header.getResizeHandler()(event);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isResizeModeOnEnd) {
      startDataGridColumnResizeOnEnd(event, header, table);
      return;
    }

    header.getResizeHandler()(event);
  };

  return (
    <div
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: handleMouseDown,
        onTouchStart: handleTouchStart,
        className: cn(
          "user-select-none absolute top-0 z-10 flex h-full cursor-col-resize touch-none",
          isLastVisibleColumn
            ? "end-0 w-5 justify-end before:hidden"
            : "-end-2 w-5 justify-center before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border/35",
          column.getIsResizing() && resizeIndicatorClassName
        ),
      }}
    />
  );
}

function DataGridTableResizeIndicator({
  viewportElement,
}: {
  viewportElement: HTMLDivElement | null;
}) {
  const { props, table } = useDataGrid();
  const columnSizingInfo = table.getState().columnSizingInfo;
  const resizingColumnId = columnSizingInfo.isResizingColumn;
  const resizeMode =
    props.tableLayout?.columnsResizeMode ?? table.options.columnResizeMode;

  if (
    !props.tableLayout?.columnsResizable ||
    resizeMode !== "onEnd" ||
    !resizingColumnId
  ) {
    return null;
  }

  const resizingHeader = table
    .getFlatHeaders()
    .find(
      (header) =>
        header.column.id === resizingColumnId || header.id === resizingColumnId
    );

  if (!resizingHeader) {
    return null;
  }

  const deltaOffset = columnSizingInfo.deltaOffset ?? 0;
  const headerHeight =
    viewportElement
      ?.querySelector('[data-slot="data-grid-table"] thead')
      ?.getBoundingClientRect().height ?? 0;
  const indicatorLeft =
    typeof columnSizingInfo.startOffset === "number" && viewportElement
      ? columnSizingInfo.startOffset -
        viewportElement.getBoundingClientRect().left
      : resizingHeader.getStart() + resizingHeader.getSize();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20"
      style={{
        left: indicatorLeft,
        transform: `translateX(${deltaOffset}px)`,
      }}
    >
      <div className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-primary/85" />
      <div
        className="absolute top-0 left-0 -translate-x-1/2 rounded-b-sm bg-primary shadow-[0_8px_24px_rgba(79,100,91,0.18)]"
        style={{
          width: 5,
          height: Math.max(headerHeight, 6),
        }}
      />
    </div>
  );
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-2" />;
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        props.tableLayout?.rowRounded && "[&_td:first-child]:rounded-l-none",
        props.tableLayout?.rowRounded && "[&_td:last-child]:rounded-r-none",
        props.tableClassNames?.body
      )}
    >
      {children}
    </tbody>
  );
}

function DataGridTableFoot({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();
  return (
    <tfoot
      className={cn("border-border/20 border-t", props.tableClassNames?.footer)}
    >
      {children}
    </tfoot>
  );
}

function DataGridTableFootRow({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();
  return (
    <tr
      className={cn(
        "bg-surface-container-low",
        props.tableLayout?.cellBorder && "*:last:border-e-0"
      )}
    >
      {children}
      <DataGridTableFillFootCell />
    </tr>
  );
}

function DataGridTableFootRowCell({
  children,
  colSpan,
  className,
}: {
  children?: ReactNode;
  colSpan?: number;
  className?: string;
}) {
  const { props } = useDataGrid();
  const spacing = footerCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  });
  return (
    <td
      className={cn(
        "border-border/20 border-t align-middle font-medium text-secondary-foreground/80",
        spacing,
        props.tableLayout?.cellBorder && "border-border/20 border-e",
        className
      )}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { table, props } = useDataGrid();

  return (
    <tr
      className={cn(
        "hover:bg-surface-container-high/70 data-[state=selected]:bg-surface-container-highest",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          "border-border/20 border-b [&:not(:last-child)>td]:border-border/20 [&:not(:last-child)>td]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped &&
          "odd:bg-surface-container/70 hover:bg-transparent odd:hover:bg-surface-container-high/80",
        table.options.enableRowSelection && "*:first:relative",
        props.tableClassNames?.bodyRow
      )}
    >
      {children}
      <DataGridTableFillBodyCell />
    </tr>
  );
}

function DataGridTableBodyRowSkeletonCell<TData extends object>({
  children,
  column,
}: {
  children: ReactNode;
  column: Column<TData>;
}) {
  const { props, table } = useDataGrid<TData>();
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  });

  return (
    <td
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-border/20 border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "truncate",
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          'data-pinned:bg-surface-container-high/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border/20',
        column.getIndex() === 0 ||
          column.getIndex() === table.getVisibleFlatColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
      style={
        props.tableLayout?.columnsResizable
          ? { width: `calc(var(--col-${column.id}-size) * 1px)` }
          : undefined
      }
    >
      {children}
    </td>
  );
}

function DataGridTableBodyRow<TData extends object>({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  row: Row<TData>;
  pinnedBoundary?: DataGridTablePinnedBoundary;
  rowRef?: React.Ref<HTMLTableRowElement>;
  dndRef?: React.Ref<HTMLTableRowElement>;
  dndStyle?: CSSProperties;
}) {
  const { props, table } = useDataGrid<TData>();
  const isRowPinned = row.getIsPinned();

  return (
    <tr
      className={cn(
        "hover:bg-surface-container-high/70 data-[state=selected]:bg-surface-container-highest",
        props.onRowClick && "cursor-pointer",
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          "border-border/20 border-b [&:not(:last-child)>td]:border-border/20 [&:not(:last-child)>td]:border-b",
        props.tableLayout?.cellBorder && "*:last:border-e-0",
        props.tableLayout?.stripped &&
          "odd:bg-surface-container/70 hover:bg-transparent odd:hover:bg-surface-container-high/80",
        table.options.enableRowSelection && "*:first:relative",
        props.tableLayout?.rowsPinnable &&
          isRowPinned &&
          "bg-surface-container/80 hover:bg-surface-container-high",
        pinnedBoundary === "top" && "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        pinnedBoundary === "bottom" &&
          "[&>td]:shadow-[0_2px_0_rgba(0,0,0,0.03)]",
        props.tableClassNames?.bodyRow
      )}
      data-row-pinned={isRowPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      data-state={
        table.options.enableRowSelection && row.getIsSelected()
          ? "selected"
          : undefined
      }
      onClick={() => props.onRowClick?.(row.original)}
      ref={(node) => {
        assignRef(rowRef, node);
        assignRef(dndRef, node);
      }}
      style={{ ...(dndStyle ? dndStyle : null) }}
    >
      {children}
      <DataGridTableFillBodyCell />
    </tr>
  );
}

function DataGridTableBodyRowExpandded<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  const { props, table } = useDataGrid<TData>();

  return (
    <tr
      className={cn(
        props.tableLayout?.rowBorder &&
          "[&:not(:last-child)>td]:border-border/20 [&:not(:last-child)>td]:border-b"
      )}
    >
      <td
        colSpan={
          row.getVisibleCells().length +
          (props.tableLayout?.columnsResizable ? 1 : 0)
        }
      >
        {table
          .getAllColumns()
          .find((column) => column.columnDef.meta?.expandedContent)
          ?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  );
}

function DataGridTableBodyRowCell<TData extends object>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  cell: Cell<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid<TData>();

  const { column, row } = cell;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right");
  let pinnedColSide: "left" | "right" | undefined;
  if (isLastLeftPinned) {
    pinnedColSide = "left";
  } else if (isFirstRightPinned) {
    pinnedColSide = "right";
  }
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? "dense" : "default",
  });

  return (
    <td
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
      className={cn(
        "align-middle",
        bodyCellSpacing,
        props.tableLayout?.cellBorder && "border-border/20 border-e",
        props.tableLayout?.columnsResizable &&
          column.getCanResize() &&
          "truncate",
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          'data-pinned:bg-surface-container-high/90 data-pinned:backdrop-blur-xs" [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border/20',
        column.getIndex() === 0 ||
          column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : ""
      )}
      data-last-col={pinnedColSide}
      data-pinned={isPinned || undefined}
      style={{
        ...(props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          getPinningStyles(column)),
        ...(props.tableLayout?.columnsResizable && {
          width: `calc(var(--col-${column.id}-size) * 1px)`,
        }),
        ...(dndStyle ? dndStyle : null),
      }}
    >
      {children}
    </td>
  );
}

function DataGridTableRenderedRow<TData extends object>({
  row,
  pinnedBoundary,
  rowRef,
}: {
  row: Row<TData>;
  pinnedBoundary?: DataGridTablePinnedBoundary;
  rowRef?: React.Ref<HTMLTableRowElement>;
}) {
  return (
    <>
      <DataGridTableBodyRow
        pinnedBoundary={pinnedBoundary}
        row={row}
        rowRef={rowRef}
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </>
  );
}

function DataGridTableEmpty() {
  const { table, props } = useDataGrid();
  const visibleColumnCount =
    table.getVisibleLeafColumns().length +
    (props.tableLayout?.columnsResizable ? 1 : 0);

  return (
    <tr>
      <td
        className="py-6 text-center text-muted-foreground text-sm"
        colSpan={Math.max(visibleColumnCount, 1)}
      >
        {props.emptyMessage || "No data available"}
      </td>
    </tr>
  );
}

function DataGridTableLoader() {
  const { props } = useDataGrid();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-2 font-medium text-muted-foreground text-sm leading-none shadow-[0_12px_32px_rgba(79,100,91,0.08)] ring-1 ring-border/20">
        <Spinner className="size-5 opacity-60" />
        {props.loadingMessage || "Loading..."}
      </div>
    </div>
  );
}

function DataGridTableRowPin<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  const isPinned = row.getIsPinned();

  return (
    <button
      aria-label={isPinned ? "Unpin row" : "Pin row"}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground",
        isPinned && "text-primary hover:text-primary/80"
      )}
      onClick={() => {
        if (isPinned) {
          row.pin(false);
        } else {
          row.pin("top");
        }
      }}
      type="button"
    >
      {isPinned ? (
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="16"
          stroke="none"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2l4.585 4.586-2.122 2.121L17.05 7.293l-3.535 3.536 1.413 5.658-2.12 2.121-4.244-4.243L4.322 18.6l-1.414-1.41 4.242-4.244-4.243-4.243 2.122-2.121 5.656 1.414 3.536-3.536-1.414-1.414z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="12" x2="12" y1="17" y2="22" />
          <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24z" />
        </svg>
      )}
    </button>
  );
}

function DataGridTableRowSelect<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-s-0 top-0 bottom-0 hidden w-0.5 bg-primary/70",
          row.getIsSelected() && "block"
        )}
      />
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        className="align-[inherit]"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    </>
  );
}

function DataGridTableRowSelectAll() {
  const { table, recordCount, isLoading } = useDataGrid();

  const isAllSelected = table.getIsAllPageRowsSelected();
  const isSomeSelected = table.getIsSomePageRowsSelected();

  return (
    <Checkbox
      aria-label="Select all"
      checked={isAllSelected}
      className="align-[inherit]"
      disabled={isLoading || recordCount === 0}
      indeterminate={isSomeSelected && !isAllSelected}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  );
}

function DataGridTableBodyRows<TData extends object>({
  table,
}: {
  table: Table<TData>;
}) {
  const { isLoading, props } = useDataGrid<TData>();
  const pagination = table.getState().pagination;

  if (isLoading && props.loadingMode === "skeleton" && pagination?.pageSize) {
    const skeletonRowIds = Array.from(
      { length: pagination.pageSize },
      (_, rowIndex) => `skeleton-row-${rowIndex}`
    );

    return (
      <>
        {skeletonRowIds.map((rowId) => (
          <DataGridTableBodyRowSkeleton key={rowId}>
            {table.getVisibleFlatColumns().map((column) => (
              <DataGridTableBodyRowSkeletonCell column={column} key={column.id}>
                {column.columnDef.meta?.skeleton}
              </DataGridTableBodyRowSkeletonCell>
            ))}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    );
  }

  if (isLoading && props.loadingMode === "spinner") {
    return (
      <tr>
        <td className="p-8" colSpan={table.getVisibleFlatColumns().length}>
          <div className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="mr-3 -ml-1 h-5 w-5 animate-spin text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            {props.loadingMessage || "Loading..."}
          </div>
        </td>
      </tr>
    );
  }

  const resolvedRows = getDataGridTableResolvedRows(
    table,
    props.tableLayout?.rowsPinnable
  );

  if (!resolvedRows.length) {
    return <DataGridTableEmpty />;
  }

  return (
    <>
      {resolvedRows.map(({ row, pinnedBoundary }) => (
        <DataGridTableRenderedRow
          key={row.id}
          pinnedBoundary={pinnedBoundary}
          row={row}
        />
      ))}
    </>
  );
}

/**
 * Memoized body rows: skip re-renders during active column resize.
 * Column widths update via CSS variables on the <table> element,
 * so the browser handles width changes without React re-renders.
 */
const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) => !!next.table.getState().columnSizingInfo.isResizingColumn
) as typeof DataGridTableBodyRows;

function DataGridTableHeader<TData extends object>() {
  const { table, props } = useDataGrid<TData>();

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        <DataGridTableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => {
            return (
              <DataGridTableHeadRow
                headerGroup={headerGroup}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  let headerContent: ReactNode = null;
                  if (!header.isPlaceholder) {
                    if (
                      props.tableLayout?.columnsResizable &&
                      column.getCanResize()
                    ) {
                      headerContent = (
                        <div className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      );
                    } else {
                      headerContent = flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      );
                    }
                  }

                  return (
                    <DataGridTableHeadRowCell header={header} key={header.id}>
                      {headerContent}
                      {props.tableLayout?.columnsResizable &&
                        column.getCanResize() && (
                          <DataGridTableHeadRowCellResize header={header} />
                        )}
                    </DataGridTableHeadRowCell>
                  );
                })}
              </DataGridTableHeadRow>
            );
          })}
        </DataGridTableHead>
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}

function DataGridTable<TData extends object>({
  footerContent,
  renderHeader = true,
}: {
  footerContent?: ReactNode;
  renderHeader?: boolean;
}) {
  const { table, props } = useDataGrid<TData>();

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => {
              return (
                <DataGridTableHeadRow
                  headerGroup={headerGroup}
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    const { column } = header;
                    let headerContent: ReactNode = null;
                    if (!header.isPlaceholder) {
                      if (
                        props.tableLayout?.columnsResizable &&
                        column.getCanResize()
                      ) {
                        headerContent = (
                          <div className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        );
                      } else {
                        headerContent = flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        );
                      }
                    }

                    return (
                      <DataGridTableHeadRowCell header={header} key={header.id}>
                        {headerContent}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    );
                  })}
                </DataGridTableHeadRow>
              );
            })}
          </DataGridTableHead>
        )}

        {renderHeader &&
          (props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

        <DataGridTableBody>
          <MemoizedDataGridTableBodyRows table={table} />
        </DataGridTableBody>

        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}

export type { DataGridTablePinnedBoundary };
export {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFoot,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableHead,
  DataGridTableHeader,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRenderedRow,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  getDataGridTableResolvedRows,
  getDataGridTableRowSections,
};
