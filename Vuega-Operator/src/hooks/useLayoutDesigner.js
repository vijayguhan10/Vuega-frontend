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
          isLadies: false,
          isBlocked: false,
          row: r,
          col: c,
        });
      }
    }
    deck.push(row);
  }

  return { deck, nextNumber: seatCounter };
}

/** Count non-removed seats across all decks. */
function countSeats(lowerDeck, upperDeck) {
  let count = 0;
  const countInDeck = (d) => {
    if (!d) return;
    d.forEach((row) =>
      row.forEach((cell) => {
        if (cell && !cell.removed) count++;
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
      const upper = buildDeck(rows, leftSeats, rightSeats, defaultSeatType, 'upper', lower.nextNumber);
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

  const updateSeatProperty = useCallback(
    (seatId, key, value) =>
      mutateSeat(seatId, (s) => ({ ...s, [key]: value })),
    [mutateSeat],
  );

  /* ---------- auto-renumber ---------- */

  const autoRenumber = useCallback(() => {
    pushHistory();
    let counter = 1;

    const renumber = (deck) =>
      deck.map((row) =>
        row.map((cell) => {
          if (!cell || cell.removed) return cell;
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

  /** Update the seat type for every non-removed seat in a given column (both decks). */
  const updateColumnType = useCallback(
    (colIndex, newType) => {
      pushHistory();

      const updateDeck = (deck) =>
        deck.map((row) =>
          row.map((cell) => {
            if (cell && cell.col === colIndex && !cell.removed) {
              return { ...cell, type: newType };
            }
            return cell;
          }),
        );

      setLowerDeck((prev) => updateDeck(prev));
      if (upperDeck) setUpperDeck((prev) => (prev ? updateDeck(prev) : prev));
    },
    [pushHistory, upperDeck],
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
