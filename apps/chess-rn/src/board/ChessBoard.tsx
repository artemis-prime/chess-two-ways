import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import Board from './Board'
import { ChessDnDShell } from './ChessDnD'

const ChessBoard: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style 
}) => (
  <ChessDnDShell>
    <Board style={style} />
  </ChessDnDShell>
)

export default ChessBoard
