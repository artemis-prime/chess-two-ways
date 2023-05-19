import React, { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { styled, deborder, sideArea, useQueryCallback } from '~/style'

import { SideMenu } from '~/app/widgets'

import Chalkboard from './Chalkboard'
import Header from './Header'
import Chessboard from './Chessboard'

import '~/style/fonts.scss'
import '~/style/body.scss'

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
  },
  '@desktopTiny': {
    py: '$1'
  },
})

const StartDiv = styled('div', {
  ...deborder('green', 'layout'),
  display: 'none',

  '@xl': {
    display: 'block',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: sideArea.xl,
  }
})

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
  '@desktopTiny': {
    flexBasis:  sideArea.desktopTiny,
    flexGrow: 0
  },
  '@desktopSmall': {
    flexBasis:  sideArea.desktopSmall,
  },
  '@menuBreak': {
    flexBasis: sideArea.menuBreak,
  },
  '@virtualStaging': {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: sideArea.virtualStaging,
  },
  '@xl': {
    flexBasis: sideArea.xl,
  },
  '@xxl': {
    flexBasis: sideArea.xxl,
  }
})

const ChessboardOuter = styled('div', {
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
  '@desktopTiny': {
    width: `calc(100% - ${sideArea.desktopTiny})`,
    justifyContent: 'flex-end',
  },
  '@desktopSmall': {
    width: `calc(100% - ${sideArea.desktopSmall})`,
  },
  '@menuBreak': {
    width: `calc(100% - ${sideArea.menuBreak})`,
  },
  '@virtualStaging': {
    width: `calc(100% - ${sideArea.virtualStaging})`,
  },
  '@xl': {
    width: `calc(100% - ${sideArea.xlDoubled})`, 
    justifyContent: 'center',
  },
  '@xxl': {
    width: `calc(100% - ${sideArea.xxlDoubled})`, 
  }
})

const ChessboardArea: React.FC = () => {

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
    <ChessboardOuter ref={ref} >
      <Chessboard tall={tall} />
    </ChessboardOuter>
  )
}

const Layout: React.FC<{}> = () => {
  
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean >(false) 
  const [showMoves, setShowMoves] = useState<boolean>(false)

  useQueryCallback('virtualStaging', () => {setSideMenuOpen(false)})
  const toggleMenu = () => { setSideMenuOpen((prev) => (!prev)) }
  
  return (
    <Outer>
      <Header menuOpen={sideMenuOpen} toggleMenu={toggleMenu} />
      <Main>
        <StartDiv />
        <ChessboardArea />
        <EndDiv >
          <Chalkboard showMoves={showMoves} setShowMoves={setShowMoves} />
        </EndDiv>
        <SideMenu open={sideMenuOpen} css={{ 
          '@virtualStaging': { display: 'none'},
          '$$drawerWidth': '85%',
          '@tabletPortrait': { '$$drawerWidth': '280px' },
          '@desktopTiny': { '$$drawerWidth': '280px' }
        }} />
      </Main>
    </Outer>
  )
}

export default Layout
