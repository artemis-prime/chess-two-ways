import React, { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { styled, deborder } from '~/styles/stitches.config'
import { BREAKPOINTS } from '~/styles/media.stitches'

import { SideMenu } from '~/app/widgets'

import Dash from './Dash'
import Header from './Header'
import Board from './Board'

import '~/styles/fonts.scss'
import '~/styles/body.scss'

const Outer = styled('div', {
  boxSizing: 'border-box',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  ...deborder('orange', 'layout'),

})

const Main = styled('main', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: '1',
  py: '$2',
  ...deborder('red', 'layout'),

  '@allMobilePortrait': {
    flexDirection: 'column',
    pt: '$1_5',
    pb: 0,
    px: '$_5',
  }
})

const StartDiv = styled('div', {
  ...deborder('green', 'layout'),

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

  '@allMobilePortrait': {
    px: 0,
    flexGrow: 0,
  },

  '@desktopSmall': {
    width: 'calc(100% - 300px)',
  },

  '@menuBreak': {
    width: 'calc(100% - 320px)',
  },

  '@virtualStaging': {
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

const EndDiv = styled('div', {
  
  ...deborder('blue', 'layout'),
  pr: '$1',

  '@allMobilePortrait': {
    pr: 0,
    pt: '$1',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  '@desktopSmall': {
    flexBasis: '300px'
  },

  '@menuBreak': {
    flexBasis: '320px'
  },

  '@virtualStaging': {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '500px'
  },

  '@xl': {
    flexBasis: '430px'
  }
})


const Layout: React.FC<{}> = () => {
  
  const [drawerOpen, setDrawerOpen] = useState<boolean >(false) 
  const [showMoves, setShowMoves] = useState<boolean>(false)

  const { width, height, ref } = useResizeDetector()

  const menuDrawerWidth = (): number | string => {
    if (width && width < BREAKPOINTS.Tablet) {
      return '85%'
    }
    return 280
  }

  const toggleMenu = () => { setDrawerOpen((prev) => (!prev)) }
  
  return (
    <Outer ref={ref}>
      <Header menuOpen={drawerOpen} toggleMenu={toggleMenu} />
      <Main>
        <StartDiv />
        <BoardOuter />
        <EndDiv >
          <Dash showMoves={showMoves} setShowMoves={setShowMoves} />
        </EndDiv>
        <SideMenu width={menuDrawerWidth()} open={drawerOpen} />
      </Main>
    </Outer>
  )
}

export default Layout
