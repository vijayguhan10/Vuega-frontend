import { memo } from 'react';
import SeatCell from './SeatCell';

/* ══════════════════════════════════════════════════════
   TripSeatGrid — renders the 2D trip-seat layout
   using CSS Grid.  Matches the layout-designer's
   SeatGrid with row labels, clickable column headers,
   aisle gaps, and sleeper row-spanning support.
   ══════════════════════════════════════════════════════ */

const TripSeatGrid = memo(function TripSeatGrid({
  grid,             // 2D array of trip seats (null = aisle)
  selectedSeatId,
  selectedColumn,   // colIndex number | null
  onSelectSeat,
  onSelectColumn,
}) {
  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const aisleIdx = grid[0].indexOf(null);

  return (
    <div className="inline-flex flex-col">
      {/* Column headers — clickable for column pricing */}
      <div className="flex items-center mb-1.5" style={{ gap: '6px' }}>
        {/* Spacer for row-label column */}
        <div style={{ width: '1.25rem' }} className="shrink-0" />

        {grid[0].map((cell, colIdx) => {
          if (!cell) {
            return <div key={`ch-${colIdx}`} style={{ width: '3.5rem' }} className="h-7" />;
          }

          const isColSelected = selectedColumn === colIdx;
          const colLabel = `C${colIdx < aisleIdx ? colIdx + 1 : colIdx}`;

          return (
            <button
              key={`ch-${colIdx}`}
              onClick={() => onSelectColumn?.(isColSelected ? null : colIdx)}
              title={`Select column ${colLabel} for pricing`}
              style={{ width: '3.5rem' }}
              className={`h-7 rounded font-bold uppercase tracking-wider transition-all cursor-pointer select-none
                ${isColSelected
                  ? 'bg-v-accent-dark text-white shadow-sm'
                  : 'bg-v-secondary/60 text-v-text-muted hover:bg-v-secondary hover:text-v-text-secondary border border-transparent hover:border-v-secondary-border'
                }`}
            >
              {colLabel}
            </button>
          );
        })}
      </div>

      {/* Seat grid — CSS Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `1.25rem repeat(${cols}, 3.5rem)`,
          gridTemplateRows: `repeat(${rows}, 3.5rem)`,
          gap: '6px',
        }}
      >
        {/* Row labels */}
        {Array.from({ length: rows }, (_, r) => (
          <span
            key={`label-${r}`}
            style={{ gridRow: r + 1, gridColumn: 1 }}
            className="text-v-text-muted font-mono text-right self-center select-none"
          >
            {r + 1}
          </span>
        ))}

        {/* Seat cells */}
        {grid.flatMap((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (cell && cell.merged) return null;

            if (!cell) {
              return (
                <div
                  key={`aisle-${rowIdx}-${colIdx}`}
                  style={{ gridRow: rowIdx + 1, gridColumn: colIdx + 2 }}
                />
              );
            }

            const isSleeper = cell.type === 'sleeper' && !cell.removed;
            const nextRowCell = rowIdx + 1 < rows ? grid[rowIdx + 1]?.[colIdx] : null;
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
                  isColumnSelected={selectedColumn === colIdx}
                  onSelect={onSelectSeat}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default TripSeatGrid;
