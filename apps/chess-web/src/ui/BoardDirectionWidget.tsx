  // @ts-ignore
import React from 'react'

import type { CSS } from '@stitches/react'
import { Button, Flex, Checkbox } from '~/primitives'
import { useUIState } from '../board/UIState'

const BoardDirectionWidget: React.FC<{css?: CSS}> = ({css}) => {

  const {
    alternateBoard, 
    setAlternateBoard, 
    whiteOnBottom,
    setWhiteOnBottom
  } = useUIState()

  const swapDirection = () => {
    setWhiteOnBottom(!whiteOnBottom)  
  }
  
  return (
    <Flex direction='column' align='end' css={css}>
      <Checkbox checked={alternateBoard} setChecked={setAlternateBoard}>auto-sync view</Checkbox>
      <Button disabled={alternateBoard} onClick={swapDirection}>swap view</Button>
    </Flex>
  )

}

export default BoardDirectionWidget
