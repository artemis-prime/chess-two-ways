import React from 'react'

import Board from './Board'
import { ChessDnDShell } from './ChessDnD'

const ChessBoard: React.FC = () => (
  <ChessDnDShell>
    <Board />
  </ChessDnDShell>
)

export default ChessBoard
