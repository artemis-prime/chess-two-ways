import React, { type PropsWithChildren } from 'react'
import { styled, type CSS } from '~/styles/stitches.config'

const ANIM_SPEED = '150ms'

const InnerDrawer = styled('div', {

  outline: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  position: 'absolute',
  bottom: 0,
  top: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',

  variants: {
    side: {
      left: { 
        transition: 'left ' + ANIM_SPEED + ' ease-in', 
      },
      right: { 
        transition: 'right ' + ANIM_SPEED + ' ease-in',  
      }
    }
  }
})

const Drawer: React.FC<{
  side: 'left' | 'right',
  width: number,
  open: boolean,
  css?: CSS
} & PropsWithChildren
> = ({
  side,
  width,
  open,
  children,
  css
}) => {

  const style = {
    width,
    [side]: open ? 0 : -(width),
  }

  return (
    <InnerDrawer side={side} css={css} style={style}>
      {children}
    </InnerDrawer>
  )
}

export default Drawer
