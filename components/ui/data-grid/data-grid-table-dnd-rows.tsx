"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Modifier,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type Cell,
  flexRender,
  type HeaderGroup,
  type Row,
} from "@tanstack/react-table";
import { GripHorizontalIcon } from "lucide-react";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { useDataGrid } from "@/components/ui/data-grid/data-grid";
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRowSpacer,
  DataGridTableViewport,
} from "@/components/ui/data-grid/data-grid-table";
import { cn } from "@/lib/utils";

// Context to share sortable listeners from row to handle
type SortableContextValue = ReturnType<typeof useSortable>;
const SortableRowContext = createContext<Pick<
  SortableContextValue,
  "attributes" | "listeners"
> | null>(null);

function DataGridTableDndRowHandle({ className }: { className?: string }) {
  const context = useContext(SortableRowContext);

  if (!context) {
    // Fallback if context is not available (shouldn't happen in normal usage)
    return (
      <Button
        className={cn(
          "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
          className
        )}
        disabled
        size="icon-sm"
        variant="ghost"
      >
        <GripHorizontalIcon />
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
        className
      )}
      size="icon-sm"
      variant="ghost"
      {...context.attributes}
      {...context.listeners}
    >
      <GripHorizontalIcon />
    </Button>
  );
}

function DataGridTableDndRow<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    cursor: isDragging ? "grabbing" : undefined,
  };

  return (
    <SortableRowContext.Provider value={{ attributes, listeners }}>
      <DataGridTableBodyRow
        dndRef={setNodeRef}
        dndStyle={style}
        key={row.id}
        row={row}
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
          return (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataGridTableBodyRowCell>
          );
        })}
      </DataGridTableBodyRow>
    </SortableRowContext.Provider>
  );
}

function DataGridTableDndRows<TData extends object>({
  handleDragEnd,
  dataIds,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void;
  dataIds: UniqueIdentifier[];
  footerContent?: ReactNode;
}) {
  const { table, isLoading, props } = useDataGrid<TData>();
  const pagination = table.getState().pagination;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingRow, setIsDraggingRow] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    if (!isDraggingRow) {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyCursor = body.style.cursor;
    const previousDocumentCursor = documentElement.style.cursor;

    body.style.cursor = "grabbing";
    documentElement.style.cursor = "grabbing";

    return () => {
      body.style.cursor = previousBodyCursor;
      documentElement.style.cursor = previousDocumentCursor;
    };
  }, [isDraggingRow]);

  const modifiers = useMemo(() => {
    const restrictToTableContainer: Modifier = ({
      transform,
      draggingNodeRect,
    }) => {
      if (!(tableContainerRef.current && draggingNodeRect)) {
        return transform;
      }

      const containerRect = tableContainerRef.current.getBoundingClientRect();
      const { x, y } = transform;

      const minX = containerRect.left - draggingNodeRect.left;
      const maxX = containerRect.right - draggingNodeRect.right;
      const minY = containerRect.top - draggingNodeRect.top;
      const maxY = containerRect.bottom - draggingNodeRect.bottom;

      return {
        ...transform,
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      };
    };

    return [restrictToVerticalAxis, restrictToTableContainer];
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={useId()}
      modifiers={modifiers}
      onDragCancel={() => setIsDraggingRow(false)}
      onDragEnd={(event) => {
        setIsDraggingRow(false);
        handleDragEnd(event);
      }}
      onDragStart={() => setIsDraggingRow(true)}
      sensors={sensors}
    >
      <DataGridTableViewport
        className={
          isDraggingRow
            ? "relative cursor-grabbing **:cursor-grabbing!"
            : "relative"
        }
        viewportRef={tableContainerRef}
      >
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

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}
          <DataGridTableBody>
            {(() => {
              if (
                props.loadingMode === "skeleton" &&
                isLoading &&
                pagination?.pageSize
              ) {
                const skeletonRowIds = Array.from(
                  { length: pagination.pageSize },
                  (_, rowIndex) => `skeleton-row-${rowIndex}`
                );

                return skeletonRowIds.map((rowId) => (
                  <DataGridTableBodyRowSkeleton key={rowId}>
                    {table.getVisibleFlatColumns().map((column) => {
                      return (
                        <DataGridTableBodyRowSkeletonCell
                          column={column}
                          key={column.id}
                        >
                          {column.columnDef.meta?.skeleton}
                        </DataGridTableBodyRowSkeletonCell>
                      );
                    })}
                  </DataGridTableBodyRowSkeleton>
                ));
              }

              if (table.getRowModel().rows.length) {
                return (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row: Row<TData>) => {
                      return <DataGridTableDndRow key={row.id} row={row} />;
                    })}
                  </SortableContext>
                );
              }

              return <DataGridTableEmpty />;
            })()}
          </DataGridTableBody>

          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  );
}

export { DataGridTableDndRowHandle, DataGridTableDndRows };
