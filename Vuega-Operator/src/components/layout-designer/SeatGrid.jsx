import React, { memo } from 'react';
import SeatCell from './SeatCell';

/* ──────────────────────────────────────────────
   SeatGrid — renders a 2-D matrix of seats.
   Each row is a flex row; null cells = aisle.
   ────────────────────────────────────────────── */

const SeatGrid = memo(function SeatGrid({
  deck, // 2D array
  selectedSeatId,
  selectedColumn, // { colIndex } | null
  onSelect,
  onRemove,
  onRestore,
  onSelectColumn,
}) {
  if (!deck || deck.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Column headers — clickable to select entire column */}
      <div className="flex gap-1.5 items-center">
        {/* Spacer for row-number label */}
        <div className="w-5 shrink-0" />

        {deck[0].map((cell, colIdx) => {
          if (!cell) {
            // aisle — empty spacer
            return <div key={`ch-${colIdx}`} className="w-12 h-6 md:w-14" />;
          }

          const isColSelected = selectedColumn?.colIndex === colIdx;

          return (
            <button
              key={`ch-${colIdx}`}
              onClick={() => onSelectColumn(colIdx)}
              title={`Select column ${colIdx + 1}`}
              className={`w-12 h-6 md:w-14 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none
                ${isColSelected
                  ? 'bg-v-accent-dark text-white shadow-sm'
                  : 'bg-v-secondary/60 text-v-text-muted hover:bg-v-secondary hover:text-v-text-secondary border border-transparent hover:border-v-secondary-border'
                }`}
            >
              C{colIdx < deck[0].indexOf(null) ? colIdx + 1 : colIdx}
            </button>
          );
        })}
      </div>

      {/* Seat rows */}
      {deck.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5 items-center">
          {/* Row number label */}
          <span className="w-5 text-[10px] text-v-text-muted font-mono text-right shrink-0 select-none">
            {rowIdx + 1}
          </span>

          {row.map((cell, colIdx) => (
            <SeatCell
              key={cell ? cell.id : `aisle-${rowIdx}-${colIdx}`}
              seat={cell}
              isSelected={cell ? cell.id === selectedSeatId : false}
              isColumnSelected={cell ? selectedColumn?.colIndex === colIdx : false}
              onSelect={onSelect}
              onRemove={onRemove}
              onRestore={onRestore}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default SeatGrid;
