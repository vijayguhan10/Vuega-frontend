import React, { memo } from 'react';
import SeatGrid from './SeatGrid';
import { DriverCell } from './SeatCell';

/* ──────────────────────────────────────────────
 DeckSection — one deck (lower or upper) with
 a FRONT indicator and optional driver cell.
 ────────────────────────────────────────────── */

const DeckSection = memo(function DeckSection({
 title, // "Lower Deck" | "Upper Deck"
 deck, // 2D array
 showDriver, // only true for lower deck
 leftSeats, // number of columns on the left (for driver positioning)
 selectedSeatId,
 selectedColumn,
 onSelect,
 onRemove,
 onRestore,
 onSelectColumn,
}) {
 if (!deck || deck.length === 0) return null;

 return (
 <div className="flex flex-col gap-3">
 {/* Title bar */}
 <div className="flex items-center gap-2">
 <span className=" font-semibold text-v-text-secondary uppercase tracking-wider">
 {title}
 </span>
 <div className="flex-1 h-px bg-v-border" />
 </div>

 {/* FRONT indicator + driver */}
 <div className="flex items-center gap-1.5">
 {/* offset for row-number label column */}
 <div className="w-5 shrink-0" />

 {/* left-side spacers to push driver to the right end */}
 {Array.from({ length: leftSeats }).map((_, i) => (
 <div key={`sp-${i}`} className="w-12 h-12" />
 ))}

 {/* aisle spacer */}
 <div className="w-12 h-12 flex items-center justify-center">
 <span className=" text-v-text-muted font-semibold uppercase tracking-wider select-none">
 Front
 </span>
 </div>

 {/* driver or empty spacer on right end */}
 {showDriver ? (
 <>
 {/* spacers for rightSeats minus 1 (driver takes last spot) */}
 {Array.from({ length: Math.max(0, (deck[0]?.length ?? 0) - leftSeats - 1 - 1) }).map((_, i) => (
 <div key={`dr-sp-${i}`} className="w-12 h-12" />
 ))}
 <DriverCell />
 </>
 ) : null}
 </div>

 {/* Seat grid */}
 <SeatGrid
 deck={deck}
 selectedSeatId={selectedSeatId}
 selectedColumn={selectedColumn}
 onSelect={onSelect}
 onRemove={onRemove}
 onRestore={onRestore}
 onSelectColumn={onSelectColumn}
 />

 {/* REAR label */}
 <div className="flex items-center gap-1.5">
 <div className="w-5 shrink-0" />
 <div className="flex-1 flex items-center justify-center">
 <span className=" text-v-text-muted font-semibold uppercase tracking-wider select-none">
 Rear
 </span>
 </div>
 </div>
 </div>
 );
});

export default DeckSection;
