// @ts-ignore
import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { autorun } from 'mobx'

import { type Position, positionToString } from '@artemis-prime/chess-core'

import { styled, common } from '~/styles/stitches.config'
import { useGame } from '~/services'

const StyledText = styled(Text, common.dashTextAlertSmaller)

const InCheckIndicator: React.FC = () => {

  const game = useGame()
  const [squaresString, setSquaresString] = useState<string>('')

  useEffect(() => (
      // return autorun()'s cleanup function: https://mobx.js.org/reactions.html#always-dispose-of-reactions
    autorun(() => {
      let str = ''
      if (game.check) {
        str = game.check.from.reduce((acc: string, current: Position, i: number) => (
          ((i > 0) ? ', ' : '') + acc + positionToString(current)
        ), '')
      }
      setSquaresString(str)
    })
  ), [])

  return squaresString ? (
    <StyledText>{`In check from ${squaresString}!`}</StyledText> 
  ) : null
}

export default InCheckIndicator
