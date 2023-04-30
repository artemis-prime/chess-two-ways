import React, { type PropsWithChildren } from 'react'
import { styled } from '~/styles/stitches.config'

const InnerDrawer = styled('div', {

  outline: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  transition: 'right 300ms', 
  position: 'fixed',
  bottom: 0,
  top: 0,
  right: -350,
  width: '325px',
  boxSizing: 'border-box',
  overflow: 'hidden',

  variants: {
    state: {
      open: {
        right: 0,
      },
      closed: {
      }
    }
  }
})

const Drawer: React.FC<{
  open: boolean,
  className?: string
} & PropsWithChildren
> = ({
  open,
  children,
  className
}) => {
  return (
    <InnerDrawer className={className} state={open ? 'open' : 'closed'}>
      {children}
    </InnerDrawer>
  )

}

export default Drawer
