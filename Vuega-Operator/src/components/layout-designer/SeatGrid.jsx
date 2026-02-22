import React, { memo } from 'react';
import SeatCell from './SeatCell';

/* ──────────────────────────────────────────────
   SeatGrid — renders a 2-D matrix of seats
   using CSS Grid so sleeper seats can span
   two rows (1 sleeper = 2 seater spaces).
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

  const rows = deck.length;
  const cols = deck[0].length;
  const aisleIdx = deck[0].indexOf(null);

  return (
    <div className="inline-flex flex-col">
      {/* Column headers — clickable to select entire column */}
      <div className="flex items-center mb-1.5" style={{ gap: '6px' }}>
        {/* Spacer matching grid row-label column */}
        <div style={{ width: '1.25rem' }} className="shrink-0" />

        {deck[0].map((cell, colIdx) => {
          if (!cell) {
            // aisle header spacer
            return <div key={`ch-${colIdx}`} style={{ width: '3rem' }} className="h-6" />;
          }

          const isColSelected = selectedColumn?.colIndex === colIdx;

          return (
            <button
              key={`ch-${colIdx}`}
              onClick={() => onSelectColumn(colIdx)}
              title={`Select column ${colIdx + 1}`}
              style={{ width: '3rem' }}
              className={`h-6 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none
                ${isColSelected
                  ? 'bg-v-accent-dark text-white shadow-sm'
                  : 'bg-v-secondary/60 text-v-text-muted hover:bg-v-secondary hover:text-v-text-secondary border border-transparent hover:border-v-secondary-border'
                }`}
            >
              C{colIdx < aisleIdx ? colIdx + 1 : colIdx}
            </button>
          );
        })}
      </div>

      {/* Seat grid — CSS Grid for sleeper row-spanning */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `1.25rem repeat(${cols}, 3rem)`,
          gridTemplateRows: `repeat(${rows}, 3rem)`,
          gap: '6px',
        }}
      >
        {/* Row labels (column 1 of grid) */}
        {Array.from({ length: rows }, (_, r) => (
          <span
            key={`label-${r}`}
            style={{ gridRow: r + 1, gridColumn: 1 }}
            className="text-[10px] text-v-text-muted font-mono text-right self-center select-none"
          >
            {r + 1}
          </span>
        ))}

        {/* Seat cells placed by grid position */}
        {deck.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            // Skip merged cells — covered by the sleeper above
            if (cell && cell.merged) return null;

            // Aisle gap — empty grid cell
            if (!cell) {
              return (
                <div
                  key={`aisle-${rowIdx}-${colIdx}`}
                  style={{ gridRow: rowIdx + 1, gridColumn: colIdx + 2 }}
                />
              );
            }

            // Detect sleeper row-span (sleeper + next cell merged)
            const isSleeper = cell.type === 'sleeper' && !cell.removed;
            const nextRowCell = rowIdx + 1 < rows ? deck[rowIdx + 1]?.[colIdx] : null;
            const hasSpan = isSleeper && nextRowCell && nextRowCell.merged;

            return (
              <div
                key={cell.id}
                style={{
                  gridRow: hasSpan ? `${rowIdx + 1} / span 2` : `${rowIdx + 1}`,
                  gridColumn: colIdx + 2,
                }}
              >
                <SeatCell
                  seat={cell}
                  isSelected={cell.id === selectedSeatId}
                  isColumnSelected={selectedColumn?.colIndex === colIdx}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  onRestore={onRestore}
                />
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
});

export default SeatGrid;
