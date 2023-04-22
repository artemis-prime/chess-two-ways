// @ts-ignore
import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { autorun } from 'mobx'

import { positionToString } from '@artemis-prime/chess-core'

import { styled, common } from '~/style/stitches.config'
import { useGame } from '~/service'

const StyledText = styled(Text, common.dashTextAlertSmaller)

const InCheckIndicator: React.FC = () => {

  const game = useGame()
  const [squaresString, setSquaresString] = useState<string>('')

    // Note that autorun returns a cleanup function that deletes the created listener
    // This is advised by mobx docs: https://mobx.js.org/reactions.html
  useEffect(() => (autorun(() => {
    let str = ''
    if (game.check) {
      str = game.check.from.reduce((acc, current, i) => (
        ((i > 0) ? ', ' : '') + acc + positionToString(current)
      ), '')
    }
    setSquaresString(str)
  })), [])

  return squaresString ? (
    <StyledText>{`In check from ${squaresString}!`}</StyledText> 
  ) : null
}

export default InCheckIndicator
