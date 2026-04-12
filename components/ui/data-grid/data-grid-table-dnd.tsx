"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Modifier,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type Cell,
  flexRender,
  type Header,
  type HeaderGroup,
  type Row,
} from "@tanstack/react-table";
import { GripVerticalIcon } from "lucide-react";
import {
  type CSSProperties,
  Fragment,
  type ReactNode,
  useEffect,
  useId,
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
  DataGridTableBodyRowExpandded,
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

function DataGridTableDndHeader<TData extends object>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const { props } = useDataGrid<TData>();
  const { column } = header;

  // Check if column ordering is enabled for this column
  const canOrder =
    (column.columnDef as { enableColumnOrdering?: boolean })
      .enableColumnOrdering !== false;

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : undefined,
    whiteSpace: "nowrap",
    width: props.tableLayout?.columnsResizable
      ? `calc(var(--header-${header.id}-size) * 1px)`
      : header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DataGridTableHeadRowCell
      dndRef={setNodeRef}
      dndStyle={style}
      header={header}
    >
      <div className="flex items-center justify-start gap-0.5">
        {canOrder && (
          <Button
            className={`-ms-2 size-6 ${isDragging ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`}
            size="icon-sm"
            variant="ghost"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVerticalIcon
              aria-hidden="true"
              className="opacity-60 hover:opacity-100"
            />
          </Button>
        )}
        <span className="grow truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {props.tableLayout?.columnsResizable && column.getCanResize() && (
          <DataGridTableHeadRowCellResize header={header} />
        )}
      </div>
    </DataGridTableHeadRowCell>
  );
}

function DataGridTableDndCell<TData extends object>({
  cell,
}: {
  cell: Cell<TData, unknown>;
}) {
  const { props } = useDataGrid<TData>();
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : undefined,
    width: props.tableLayout?.columnsResizable
      ? `calc(var(--col-${cell.column.id}-size) * 1px)`
      : cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DataGridTableBodyRowCell cell={cell} dndRef={setNodeRef} dndStyle={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </DataGridTableBodyRowCell>
  );
}

function DataGridTableDnd<TData extends object>({
  handleDragEnd,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void;
  footerContent?: ReactNode;
}) {
  const { table, isLoading, props } = useDataGrid<TData>();
  const pagination = table.getState().pagination;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    if (!isDraggingColumn) {
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
  }, [isDraggingColumn]);

  // Custom modifier to restrict dragging within table bounds with edge offset
  const restrictToTableBounds: Modifier = ({ draggingNodeRect, transform }) => {
    if (!(draggingNodeRect && containerRef.current)) {
      return { ...transform, y: 0 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const edgeOffset = 0;

    const minX = containerRect.left - draggingNodeRect.left - edgeOffset;
    const maxX =
      containerRect.right -
      draggingNodeRect.left -
      draggingNodeRect.width +
      edgeOffset;

    return {
      ...transform,
      x: Math.min(Math.max(transform.x, minX), maxX),
      y: 0, // Lock vertical movement
    };
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={useId()}
      modifiers={[restrictToTableBounds]}
      onDragCancel={() => setIsDraggingColumn(false)}
      onDragEnd={(event) => {
        setIsDraggingColumn(false);
        handleDragEnd(event);
      }}
      onDragStart={() => setIsDraggingColumn(true)}
      sensors={sensors}
    >
      <DataGridTableViewport
        className={
          isDraggingColumn
            ? "relative cursor-grabbing **:cursor-grabbing!"
            : "relative"
        }
        viewportRef={containerRef}
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => {
              return (
                <DataGridTableHeadRow
                  headerGroup={headerGroup}
                  key={headerGroup.id}
                >
                  <SortableContext
                    items={table.getState().columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DataGridTableDndHeader header={header} key={header.id} />
                    ))}
                  </SortableContext>
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
                return table.getRowModel().rows.map((row: Row<TData>) => {
                  return (
                    <Fragment key={row.id}>
                      <DataGridTableBodyRow row={row}>
                        {row
                          .getVisibleCells()
                          .map((cell: Cell<TData, unknown>) => {
                            return (
                              <SortableContext
                                items={table.getState().columnOrder}
                                key={cell.id}
                                strategy={horizontalListSortingStrategy}
                              >
                                <DataGridTableDndCell cell={cell} />
                              </SortableContext>
                            );
                          })}
                      </DataGridTableBodyRow>
                      {row.getIsExpanded() && (
                        <DataGridTableBodyRowExpandded row={row} />
                      )}
                    </Fragment>
                  );
                });
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

export { DataGridTableDnd };
