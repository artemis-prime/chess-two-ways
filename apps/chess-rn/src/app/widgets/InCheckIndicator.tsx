import React, { useState, useEffect } from 'react'
import { autorun } from 'mobx'

import { type Position, positionToString } from '@artemis-prime/chess-core'

import { useChess } from '~/services'
import { DashText } from '~/primatives'

const InCheckIndicator: React.FC = () => {

  const game = useChess()
  const [squaresString, setSquaresString] = useState<string>('')

  useEffect(() => (
      // returning autorun()'s cleanup function: https://mobx.js.org/reactions.html#always-dispose-of-reactions
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
    <DashText size='smaller' alert>{`In check from ${squaresString}!`}</DashText> 
  ) : null
}

export default InCheckIndicator
