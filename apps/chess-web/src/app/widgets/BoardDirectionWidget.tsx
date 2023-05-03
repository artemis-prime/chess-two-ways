import React from 'react'
import { observer } from 'mobx-react'

import type { CSS } from '@stitches/react'
import { Button, Flex, Checkbox } from '~/primitives'
import { useBoardOrientation } from '~/services'

const BoardDirectionWidget: React.FC<{css?: CSS}> = observer(({css}) => {

  const bo = useBoardOrientation()

  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }
  
  return (
    <Flex direction='column' align='end' css={css}>
      <Button disabled={bo.autoOrientToCurrentTurn} onClick={swapDirection}>swap view</Button>
      <Checkbox checked={bo.autoOrientToCurrentTurn} setChecked={bo.setAutoOrientToCurrentTurn.bind(bo)}>auto-sync view</Checkbox>
    </Flex>
  )
})

export default BoardDirectionWidget
