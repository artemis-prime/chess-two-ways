// @ts-ignore
import React, {useState, useEffect } from 'react'
import { autorun } from 'mobx'

import { positionToString } from '@artemis-prime/chess-core'

import { useGame } from '~/services'

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

    // visibility holds space in the layout, which reduces jumping around.
  return (
    <p className='in-check-indicator' style={{visibility: (squaresString.length > 0) ? 'visible' : 'hidden'}}>
      {`In check from ${squaresString}!`}
    </p> 
  )
}

export default InCheckIndicator
