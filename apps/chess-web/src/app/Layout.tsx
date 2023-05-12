import React, { useEffect, useState } from 'react'

import { useResizeDetector } from 'react-resize-detector'

import { styled } from '~/styles/stitches.config'
import debugBorder from '~/styles/debugBorder'
import { useDeviceInfo } from '~/services'

import { SideMenu } from '~/app/widgets'

import Dash from './Dash'
import Header from './Header'
import Board from './Board'

import '~/styles/fonts.scss'
import '~/styles/body.scss'

const Main = styled('main', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  width: '100%',
  height: '95vh',
  p: '$2',
})

const LeftWing = styled('div', {
  flex: '1 1 0',
  ...debugBorder('red', 'layout'),
  minWidth: '420px',
  display: 'none',

  '@xl': {
    display: 'block'
  }

})

const BoardArea = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  flex: '2 0 0', 
  px: '$1',
  ...debugBorder('yellow', 'layout'),
})

const BoardOuter: React.FC = () => {

  const { width, height, ref } = useResizeDetector()
  return (
    <BoardArea ref={ref} >
      <Board width={width} height={height} />
    </BoardArea>
  )
}

const RightWing = styled('div', {
  flex: '1 1 0', 
  minWidth: '420px',
  ...debugBorder('red', 'layout'),
})



const menuDrawerWidth = (w: number | undefined) => (
  w ? Math.min((0.3 * w), 360) : 360
)

const Layout: React.FC<{}> = () => {
  
  const [drawerOpen, setDrawerOpen] = useState<boolean >(false) 
  const { width, ref } = useResizeDetector()
  const { updateWidth } = useDeviceInfo()

  useEffect(() => {
    if (width) {
      updateWidth(width)
    }
  }, [width])

  const toggleMenu = () => { setDrawerOpen((prev) => (!prev)) }
  
  return (
    <div ref={ref}>
      <Header menuOpen={drawerOpen} toggleMenu={toggleMenu} />
      <Main>
        <LeftWing />
        <BoardOuter />
        <RightWing >
          <Dash />
        </RightWing>
        <SideMenu width={menuDrawerWidth(width)} open={drawerOpen} />
      </Main>
    </div>
  )
}

export default Layout
