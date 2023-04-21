import type { GameSnapshot } from '@artemis-prime/chess-core'

export default {
  artemisPrimeChessGame: true,
  board: {
    a1: "wR",
    b1: "wN",
    c1: "wB",
    d1: "wQ",
    e1: "wK",
    h1: "wR",
    a2: "wP",
    b2: "wP",
    c2: "wP",
    d2: "wP",
    f2: "wP",
    g2: "wP",
    h2: "wP",
    f3: "wN",
    e4: "wP",
    b5: "wB",
    d5: "bP",
    a6: "bP",
    c6: "bN",
    b7: "bP",
    c7: "bP",
    e7: "bP",
    f7: "bP",
    g7: "bP",
    h7: "bP",
    a8: "bR",
    c8: "bB",
    d8: "bQ",
    e8: "bK",
    f8: "bB",
    g8: "bN",
    h8: "bR"
  },
  actions: [
    "wPe2e4",
    "bPd7d5",
    "wBf1b5",
    "bNb8c6",
    "wNg1f3",
    "bPa7a6"
  ],
  currentTurn: "w"
} as GameSnapshot