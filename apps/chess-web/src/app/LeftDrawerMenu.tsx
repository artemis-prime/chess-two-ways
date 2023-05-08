import React, { type PropsWithChildren } from 'react'
import { styled, type CSS } from '~/styles/stitches.config'

import { 
  Drawer, 
  Flex, 
} from '~/primatives'

const Menu = styled('div', {
  width: '100%', 
  height: '100%', 
  backgroundColor: '$headerBG' 
})


const LeftDrawerMenu: React.FC<{
  open: boolean
  width: number
}> = ({
  open,
  width
}) => {

  return (
    <Drawer side='left' width={width} open={open} >
      <Menu />
    </Drawer>
  )
}

export default LeftDrawerMenu