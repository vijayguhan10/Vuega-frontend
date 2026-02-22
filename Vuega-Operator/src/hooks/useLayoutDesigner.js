import { useState, useCallback, useRef } from 'react';

/* ──────────────────────────────────────────────
   useLayoutDesigner — all state & logic for the
   Layout Template Designer page.
   ────────────────────────────────────────────── */

const DEFAULT_CONFIG = {
  layoutName: '',
  rows: 10,
  leftSeats: 2,
  rightSeats: 2,
  hasUpperDeck: false,
  defaultSeatType: 'seater', // seater | sleeper | semi-sleeper
};

/* ---------- helpers ---------- */

/** Build a single deck matrix (2D array). */
function buildDeck(rows, leftSeats, rightSeats, defaultSeatType, deckLabel, startNumber = 1) {
  const cols = leftSeats + 1 + rightSeats; // +1 for aisle
  const deck = [];
  let seatCounter = startNumber;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      if (c === leftSeats) {
        // aisle
        row.push(null);
      } else {
        row.push({
          id: `${deckLabel}-${r}-${c}`,
          seatNumber: String(seatCounter++),
          type: defaultSeatType,
          deck: deckLabel,
          removed: false,
          merged: false,
          isLadies: false,
          isBlocked: false,
          row: r,
          col: c,
        });
      }
    }
    deck.push(row);
  }

  // If default type is sleeper, apply merge pairing to every seat column
  if (defaultSeatType === 'sleeper') {
    const aisleCol = leftSeats;
    for (let c = 0; c < cols; c++) {
      if (c === aisleCol) continue;
      applySleeperMergeInPlace(deck, c);
    }
  }

  return { deck, nextNumber: seatCounter };
}

/**
 * Pair consecutive non-removed seats in a column for sleeper merge (in-place).
 * First of each pair keeps seatNumber, second gets merged = true.
 */
function applySleeperMergeInPlace(deck, colIndex) {
  const available = [];
  for (let r = 0; r < deck.length; r++) {
    const cell = deck[r][colIndex];
    if (cell && !cell.removed) available.push(r);
  }
  for (let i = 0; i < available.length; i += 2) {
    const r1 = available[i];
    deck[r1][colIndex].type = 'sleeper';
    deck[r1][colIndex].merged = false;
    if (i + 1 < available.length) {
      const r2 = available[i + 1];
      deck[r2][colIndex].type = 'sleeper';
      deck[r2][colIndex].merged = true;
    }
  }
}

/** Return a deep-cloned deck with sleeper merge applied to one column. */
function applySleeperMerge(deck, colIndex) {
  const newDeck = deck.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  applySleeperMergeInPlace(newDeck, colIndex);
  return newDeck;
}

/** Return a deep-cloned deck with sleeper merge removed from one column. */
function removeSleeperMerge(deck, colIndex, newType) {
  return deck.map((row) =>
    row.map((cell) => {
      if (cell && cell.col === colIndex && !cell.removed) {
        return { ...cell, type: newType, merged: false };
      }
      return cell;
    }),
  );
}

/** Count non-removed, non-merged seats across all decks. */
function countSeats(lowerDeck, upperDeck) {
  let count = 0;
  const countInDeck = (d) => {
    if (!d) return;
    d.forEach((row) =>
      row.forEach((cell) => {
        if (cell && !cell.removed && !cell.merged) count++;
      }),
    );
  };
  countInDeck(lowerDeck);
  countInDeck(upperDeck);
  return count;
}

/** Deep-clone deck arrays (simple JSON round-trip is fine for plain objects). */
const cloneDecks = (lower, upper) => ({
  lower: JSON.parse(JSON.stringify(lower)),
  upper: upper ? JSON.parse(JSON.stringify(upper)) : null,
});

/* ---------- hook ---------- */

export default function useLayoutDesigner() {
  /* — config state — */
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });

  /* — deck matrices — */
  const [lowerDeck, setLowerDeck] = useState([]);
  const [upperDeck, setUpperDeck] = useState(null);

  /* — selection — */
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null); // { colIndex } | null

  /* — undo / redo stacks — */
  const historyRef = useRef([]);
  const futureRef = useRef([]);

  /* — generated flag — */
  const [isGenerated, setIsGenerated] = useState(false);

  /* ---------- snapshot helpers ---------- */

  const pushHistory = useCallback(() => {
    historyRef.current = [
      ...historyRef.current,
      cloneDecks(lowerDeck, upperDeck),
    ];
    futureRef.current = [];
  }, [lowerDeck, upperDeck]);

  /* ---------- config updaters ---------- */

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ---------- generate / reset ---------- */

  const generateLayout = useCallback(() => {
    const { rows, leftSeats, rightSeats, defaultSeatType, hasUpperDeck } = config;

    const lower = buildDeck(rows, leftSeats, rightSeats, defaultSeatType, 'lower', 1);
    setLowerDeck(lower.deck);

    if (hasUpperDeck) {
      const upper = buildDeck(rows, leftSeats, rightSeats, 'sleeper', 'upper', lower.nextNumber);
      setUpperDeck(upper.deck);
    } else {
      setUpperDeck(null);
    }

    setSelectedSeatId(null);
    setSelectedColumn(null);
    historyRef.current = [];
    futureRef.current = [];
    setIsGenerated(true);
  }, [config]);

  const resetLayout = useCallback(() => {
    setLowerDeck([]);
    setUpperDeck(null);
    setSelectedSeatId(null);
    setSelectedColumn(null);
    historyRef.current = [];
    futureRef.current = [];
    setIsGenerated(false);
    setConfig({ ...DEFAULT_CONFIG });
  }, []);

  /* ---------- undo / redo ---------- */

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    futureRef.current = [
      ...futureRef.current,
      cloneDecks(lowerDeck, upperDeck),
    ];
    setLowerDeck(prev.lower);
    setUpperDeck(prev.upper);
  }, [lowerDeck, upperDeck]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    historyRef.current = [
      ...historyRef.current,
      cloneDecks(lowerDeck, upperDeck),
    ];
    setLowerDeck(next.lower);
    setUpperDeck(next.upper);
  }, [lowerDeck, upperDeck]);

  /* ---------- seat operations ---------- */

  /** Generic updater — mutates the correct deck matrix by seat id. */
  const mutateSeat = useCallback(
    (seatId, mutator) => {
      pushHistory();

      const update = (deck) =>
        deck.map((row) =>
          row.map((cell) => {
            if (cell && cell.id === seatId) return mutator({ ...cell });
            return cell;
          }),
        );

      setLowerDeck((prev) => update(prev));
      if (upperDeck) setUpperDeck((prev) => (prev ? update(prev) : prev));
    },
    [pushHistory, upperDeck],
  );

  const removeSeat = useCallback(
    (seatId) => mutateSeat(seatId, (s) => ({ ...s, removed: true })),
    [mutateSeat],
  );

  const restoreSeat = useCallback(
    (seatId) => mutateSeat(seatId, (s) => ({ ...s, removed: false })),
    [mutateSeat],
  );

  /** Change a single seat's type — handles sleeper merge / un-merge logic. */
  const changeSeatType = useCallback(
    (seatId, newType) => {
      // Find the seat in the lower deck (upper deck type changes are blocked)
      let targetSeat = null;
      for (const row of lowerDeck) {
        for (const cell of row) {
          if (cell && cell.id === seatId) {
            targetSeat = cell;
            break;
          }
        }
        if (targetSeat) break;
      }

      if (!targetSeat || targetSeat.deck === 'upper' || targetSeat.merged) return;
      if (targetSeat.type === newType) return;

      pushHistory();

      setLowerDeck((prev) => {
        const nd = prev.map((r) => r.map((c) => (c ? { ...c } : null)));
        const { row, col } = targetSeat;

        if (newType === 'sleeper') {
          // Changing TO sleeper — merge with the seat directly below
          nd[row][col].type = 'sleeper';
          if (
            row + 1 < nd.length &&
            nd[row + 1][col] &&
            !nd[row + 1][col].removed &&
            !nd[row + 1][col].merged
          ) {
            nd[row + 1][col].merged = true;
            nd[row + 1][col].type = 'sleeper';
          }
        } else if (targetSeat.type === 'sleeper') {
          // Changing FROM sleeper — un-merge the cell below if it was merged
          nd[row][col].type = newType;
          if (
            row + 1 < nd.length &&
            nd[row + 1][col] &&
            nd[row + 1][col].merged
          ) {
            nd[row + 1][col].merged = false;
            nd[row + 1][col].type = newType;
          }
        } else {
          // Non-sleeper to non-sleeper (e.g. seater → semi-sleeper)
          nd[row][col].type = newType;
        }

        return nd;
      });
    },
    [pushHistory, lowerDeck],
  );

  const updateSeatProperty = useCallback(
    (seatId, key, value) => {
      // Upper deck seats are always sleeper — block type changes
      if (key === 'type') {
        // For type changes, use the dedicated changeSeatType logic
        changeSeatType(seatId, value);
        return;
      }
      mutateSeat(seatId, (s) => {
        if (s.deck === 'upper' && key === 'type') return s;
        return { ...s, [key]: value };
      });
    },
    [mutateSeat, changeSeatType],
  );

  /* ---------- auto-renumber ---------- */

  const autoRenumber = useCallback(() => {
    pushHistory();
    let counter = 1;

    const renumber = (deck) =>
      deck.map((row) =>
        row.map((cell) => {
          if (!cell || cell.removed || cell.merged) return cell;
          return { ...cell, seatNumber: String(counter++) };
        }),
      );

    const newLower = renumber(lowerDeck);
    setLowerDeck(newLower);
    if (upperDeck) {
      const newUpper = renumber(upperDeck);
      setUpperDeck(newUpper);
    }
  }, [pushHistory, lowerDeck, upperDeck]);

  /* ---------- column operations ---------- */

  /** Update the seat type for every non-removed seat in a given column (lower deck only — upper deck is always sleeper). */
  const updateColumnType = useCallback(
    (colIndex, newType) => {
      pushHistory();

      if (newType === 'sleeper') {
        // Apply sleeper merge pairing
        setLowerDeck((prev) => applySleeperMerge(prev, colIndex));
      } else {
        // Remove merge and set new type
        setLowerDeck((prev) => removeSleeperMerge(prev, colIndex, newType));
      }
      // Upper deck stays sleeper — no change
    },
    [pushHistory],
  );

  /** Collect all non-removed seats in a column (across both decks). */
  const getColumnSeats = useCallback(
    (colIndex) => {
      const seats = [];
      const collect = (deck) => {
        if (!deck) return;
        deck.forEach((row) =>
          row.forEach((cell) => {
            if (cell && cell.col === colIndex && !cell.removed) seats.push(cell);
          }),
        );
      };
      collect(lowerDeck);
      collect(upperDeck);
      return seats;
    },
    [lowerDeck, upperDeck],
  );

  /* ---------- select ---------- */

  const selectSeat = useCallback((seatId) => {
    setSelectedSeatId(seatId);
    setSelectedColumn(null); // clear column selection
  }, []);

  const selectColumn = useCallback((colIndex) => {
    setSelectedColumn({ colIndex });
    setSelectedSeatId(null); // clear seat selection
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeatId(null);
    setSelectedColumn(null);
  }, []);

  /* ---------- find selected seat object ---------- */

  const findSeat = (id) => {
    if (!id) return null;
    for (const row of lowerDeck) {
      for (const cell of row) {
        if (cell && cell.id === id) return cell;
      }
    }
    if (upperDeck) {
      for (const row of upperDeck) {
        for (const cell of row) {
          if (cell && cell.id === id) return cell;
        }
      }
    }
    return null;
  };

  const selectedSeat = findSeat(selectedSeatId);

  /* ---------- save (console only) ---------- */

  const saveLayout = useCallback(() => {
    const payload = {
      layoutName: config.layoutName,
      config: {
        rows: config.rows,
        leftSeats: config.leftSeats,
        rightSeats: config.rightSeats,
        hasUpperDeck: config.hasUpperDeck,
        defaultSeatType: config.defaultSeatType,
      },
      lowerDeck,
      upperDeck,
      totalSeats: countSeats(lowerDeck, upperDeck),
    };
    console.log('── Layout Template Saved ──');
    console.log(JSON.stringify(payload, null, 2));
    return payload;
  }, [config, lowerDeck, upperDeck]);

  /* ---------- public API ---------- */

  return {
    // config
    config,
    updateConfig,

    // decks
    lowerDeck,
    upperDeck,
    isGenerated,

    // actions
    generateLayout,
    resetLayout,
    undo,
    redo,
    canUndo: historyRef.current.length > 0,
    canRedo: futureRef.current.length > 0,

    // seat ops
    removeSeat,
    restoreSeat,
    updateSeatProperty,
    autoRenumber,

    // selection
    selectedSeat,
    selectedSeatId,
    selectSeat,
    selectedColumn,
    selectColumn,
    clearSelection,

    // column ops
    updateColumnType,
    getColumnSeats,

    // save
    saveLayout,

    // stats
    totalSeats: countSeats(lowerDeck, upperDeck),
  };
}
