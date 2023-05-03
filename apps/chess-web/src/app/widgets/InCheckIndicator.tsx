import React, {useState, useEffect } from 'react'
import { autorun } from 'mobx'
import type { CSS } from '@stitches/react'
import { styled } from '~/styles/stitches.config'

import { positionToString } from '@artemis-prime/chess-core'

import { useGame } from '~/services'

const StyledView = styled('div', {
  color: '$alert9',
  variants: {
    hidden: {
      true: {
        visibility: 'hidden'
      }
    }
  }
}) 

const InCheckIndicator: React.FC<{
  css?: CSS
}> = ({
  css
}) => {

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
    <StyledView hidden={(squaresString.length === 0)} css={css}>
      {`In check from ${squaresString}!`}
    </StyledView> 
  )
}

export default InCheckIndicator
