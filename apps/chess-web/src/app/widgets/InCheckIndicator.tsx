import React, {useState, useEffect } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { positionToString } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { useGame, usePulses } from '~/services'

const StyledView = styled('div', {
  color: '$alert8',
  variants: {
    hidden: {
      true: {
        visibility: 'hidden'
      }
    },
    pulse: {
      false: {
        color: '$alert9',
      }
    }
  }
}) 

const InCheckIndicator: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const game = useGame()
  const pulses = usePulses()
  const [squaresString, setSquaresString] = useState<string>('')

    // Returning autorun's disposer as per mobx docs
  useEffect(() => (autorun(() => {
    let str = ''
    if (game.check) {
      str = game.check.from.reduce((acc, current, i) => (
        ((i > 0) ? ', ' : '') + acc + positionToString(current)
      ), '')
    }
    setSquaresString(str)
  })), [])

    // Using 'visibility' (vs 'display') holds space in the layout, which reduces jumping around.
  return (
    <StyledView hidden={(squaresString.length === 0)} pulse={pulses.slow} css={css}>
      {`In check from ${squaresString}!`}
    </StyledView> 
  )
})

export default InCheckIndicator
