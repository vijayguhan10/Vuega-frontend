import React, { useState } from 'react';
import DeckSection from './DeckSection';

/* ──────────────────────────────────────────────
 SeatCanvas — centre panel with tab switching
 between lower and upper deck.
 ────────────────────────────────────────────── */

export default function SeatCanvas({
 lowerDeck,
 upperDeck,
 isGenerated,
 config,
 selectedSeatId,
 selectedColumn,
 selectSeat,
 selectColumn,
 removeSeat,
 restoreSeat,
 totalSeats,
}) {
 const [activeDeck, setActiveDeck] = useState('lower');

 /* ── empty state ── */
 if (!isGenerated || lowerDeck.length === 0) {
 return (
 <div className="flex-1 flex items-center justify-center min-h-100">
 <div className="text-center space-y-3">
 <div className="w-16 h-16 mx-auto rounded-2xl bg-v-secondary border border-v-secondary-border flex items-center justify-center">
 <svg className="w-8 h-8 text-v-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 3h4" />
 </svg>
 </div>
 <div>
 <p className=" font-medium text-v-text">No layout generated</p>
 <p className=" text-v-text-muted mt-0.5">
 Configure the layout on the left and click <span className="font-semibold">Generate Layout</span>
 </p>
 </div>
 </div>
 </div>
 );
 }

 const currentDeck = activeDeck === 'upper' && upperDeck ? upperDeck : lowerDeck;
 const currentTitle = activeDeck === 'upper' && upperDeck ? 'Upper Deck' : 'Lower Deck';
 const showDriver = activeDeck === 'lower';

 return (
 <div className="flex-1 overflow-auto p-4 md:p-6">
 {/* Stats bar + deck tabs */}
 <div className="flex items-center gap-4 mb-6 flex-wrap">
 <span className=" font-medium text-v-text-secondary bg-v-secondary px-3 py-1.5 rounded-lg border border-v-secondary-border">
 Total seats: <span className="font-bold text-v-text">{totalSeats}</span>
 </span>

 {/* Deck tabs — only show when upper deck exists */}
 {upperDeck && (
 <div className="flex rounded-lg border border-v-border overflow-hidden">
 <button
 onClick={() => setActiveDeck('lower')}
 className={`px-3 py-1.5 font-medium transition-colors ${
 activeDeck === 'lower'
 ? 'bg-v-accent text-v-text'
 : 'bg-v-primary-bg text-v-text-muted hover:bg-v-secondary'
 }`}
 >
 Lower Deck
 </button>
 <button
 onClick={() => setActiveDeck('upper')}
 className={`px-3 py-1.5 font-medium border-l border-v-border transition-colors ${
 activeDeck === 'upper'
 ? 'bg-v-accent text-v-text'
 : 'bg-v-primary-bg text-v-text-muted hover:bg-v-secondary'
 }`}
 >
 Upper Deck
 </button>
 </div>
 )}

 <span className=" text-v-text-muted ml-auto hidden md:block">
 Click to select · Right-click to remove
 </span>
 </div>

 {/* Active deck */}
 <DeckSection
 title={currentTitle}
 deck={currentDeck}
 showDriver={showDriver}
 leftSeats={config.leftSeats}
 selectedSeatId={selectedSeatId}
 selectedColumn={selectedColumn}
 onSelect={selectSeat}
 onRemove={removeSeat}
 onRestore={restoreSeat}
 onSelectColumn={selectColumn}
 />
 </div>
 );
}
