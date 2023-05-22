import React from 'react'
import { observer } from 'mobx-react-lite'
import type { StyleProp, ViewStyle } from 'react-native'
import type { CSS } from 'stitches-native'

import { useChess } from '~/services'
import { Row, ChalkText } from '~/primatives'

import SideSwatch from './SideSwatch'

const TurnIndicator: React.FC<{
  style?: StyleProp<ViewStyle>,
  css?: CSS
}> = observer(({
  style,
  css
}) => {
  const game = useChess()
  return (
    <Row style={style} css={css}>
      <SideSwatch side={game.currentTurn} />
      <ChalkText>'s turn</ChalkText>
    </Row>
  )
})

export default TurnIndicator
