import React, { useEffect, useState, useRef } from 'react'

import { useResizeDetector } from 'react-resize-detector'

import { styled, deborder } from '~/styles/stitches.config'
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
  py: '$2',
  ...deborder('white', 'layout'),
})

const LeftWing = styled('div', {
  ...deborder('red', 'layout'),

  display: 'none',

  '@xl': {
    display: 'block',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '430px',
  }
})

const BoardArea = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  px: '$1',
  ...deborder('yellow', 'layout'),

  '@tablet': {
    width: 'calc(100% - 380px)',
    justifyContent: 'flex-end',
  },

  '@md': {
    width: 'calc(100% - 300px)',
  },

  '@menuBreak': {
    width: 'calc(100% - 320px)',
  },

  '@headerStaging': {
    width: 'calc(100% - 500px)',
  },

  '@xl': {
    width: 'calc(100% - 860px)', // 2 * 430
    justifyContent: 'center',

  }
})

const BoardOuter: React.FC = () => {

  const [tall, setTall] = useState<boolean>(false)
  const {  ref } = useResizeDetector({
    onResize: (width, height) => {
      if (!width || !height) return ;
      const current = (height > width)
      if (current != tall) {
        setTall(current)  
      } 
    } 
  })

  return (
    <BoardArea ref={ref} >
      <Board tall={tall} />
    </BoardArea>
  )
}

const RightWing = styled('div', {
  
  ...deborder('red', 'layout'),
  pr: '$1',

  '@tablet': {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '380px'
  },

  '@md': {
    flexBasis: '300px'
  },

  '@menuBreak': {
    flexBasis: '320px'
  },

  '@headerStaging': {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '500px'
  },

  '@xl': {
    flexBasis: '430px'
  }
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
    <div ref={ref} style={{/* containerType: 'size' */} }>
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
