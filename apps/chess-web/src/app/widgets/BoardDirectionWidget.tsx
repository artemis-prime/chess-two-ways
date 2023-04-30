import React from 'react'

import type { CSS } from '@stitches/react'
import { Button, Flex, Checkbox } from '~/primitives'
import { useBoardOrientation } from '~/services'

const BoardDirectionWidget: React.FC<{css?: CSS}> = ({css}) => {

  const {
    autoOrientToCurrentTurn,
    setAutoOrientToCurrentTurn,
    whiteOnBottom,
    setWhiteOnBottom
  } = useBoardOrientation()

  const swapDirection = () => { setWhiteOnBottom(!whiteOnBottom) }
  
  return (
    <Flex direction='column' align='end' css={css}>
      <Checkbox checked={autoOrientToCurrentTurn} setChecked={setAutoOrientToCurrentTurn}>auto-sync to turn</Checkbox>
      <Button disabled={autoOrientToCurrentTurn} onClick={swapDirection}>swap view</Button>
    </Flex>
  )
}

export default BoardDirectionWidget
