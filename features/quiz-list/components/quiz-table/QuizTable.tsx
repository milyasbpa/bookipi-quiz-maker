'use client';

import { flexRender, type Table } from '@tanstack/react-table';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';

interface QuizTableProps {
  table: Table<QuizWithQuestions>;
}

export function QuizTable({ table }: QuizTableProps) {
  return (
    <div className="bg-card hidden rounded-lg border md:block">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold">
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
            <tr key={row.id} className="hover:bg-muted/30 border-b last:border-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
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
