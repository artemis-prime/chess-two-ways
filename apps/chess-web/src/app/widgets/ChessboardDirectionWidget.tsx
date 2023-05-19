import React from 'react'
import { observer } from 'mobx-react-lite'

import type { CSS } from '@stitches/react'
import { Button, Flex, Checkbox } from '~/primatives'
import { useChessboardOrientation } from '~/services'

const ChessboardDirectionWidget: React.FC<{css?: CSS}> = observer(({css}) => {

  const bo = useChessboardOrientation()

  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }
  
  return (
    <Flex direction='column' align='end' css={css}>
      <Button disabled={bo.autoOrientToCurrentTurn} onClick={swapDirection}>swap view</Button>
      <Checkbox checked={bo.autoOrientToCurrentTurn} setChecked={bo.setAutoOrientToCurrentTurn.bind(bo)}>auto-sync view</Checkbox>
    </Flex>
  )
})

export default ChessboardDirectionWidget
