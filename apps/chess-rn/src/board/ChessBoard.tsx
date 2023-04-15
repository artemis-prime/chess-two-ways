import React from 'react'

import Board from './Board'
import { ChessDnD } from './ChessDragAndDrop'

const ChessBoard: React.FC = () => (
  <ChessDnD>
    <Board />
  </ChessDnD>
)

export default ChessBoard
