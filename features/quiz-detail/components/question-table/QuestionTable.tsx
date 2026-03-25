'use client';

import { flexRender, type Table } from '@tanstack/react-table';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

interface QuestionTableProps {
  table: Table<Question>;
}

export function QuestionTable({ table }: QuestionTableProps) {
  return (
    <div className="hidden rounded-lg border md:block">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-muted/30 border-b transition-colors last:border-b-0"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
