import React, { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { styled, deborder, useQueryCallback } from '~/style'

import { SideMenu } from '~/app/widgets'

import Chalkboard from './Chalkboard'
import Header from './Header'
import Chessboard from './Chessboard'

import '~/style/fonts.scss'
import '~/style/body.scss'

const SIDEBAR_BY_BP = {
  desktopTiny: 260,
  desktopSmall: 300,
  menuBreak: 320,
  virtualStaging: 500,
  xl: 430,
  xxl: 520,
}

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
    flexBasis: `${SIDEBAR_BY_BP.xl}px`,
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
    flexBasis:  `${SIDEBAR_BY_BP.desktopTiny}px)`,
    flexGrow: 0
  },
  '@desktopSmall': {
    flexBasis:  `${SIDEBAR_BY_BP.desktopSmall}px)`,
  },
  '@menuBreak': {
    flexBasis: `${SIDEBAR_BY_BP.menuBreak}px)`,
  },
  '@virtualStaging': {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: `${SIDEBAR_BY_BP.virtualStaging}px`,
  },
  '@xl': {
    flexBasis: `${SIDEBAR_BY_BP.xl}px`,
  },
  '@xxl': {
    flexBasis: `${SIDEBAR_BY_BP.xxl}px`,
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
    width: `calc(100% - ${SIDEBAR_BY_BP.desktopTiny}px)`,
    justifyContent: 'flex-end',
  },


  '@desktopSmall': {
    width: `calc(100% - ${SIDEBAR_BY_BP.desktopSmall}px)`,
  },

  '@menuBreak': {
    width: `calc(100% - ${SIDEBAR_BY_BP.menuBreak}px)`,
  },

  '@virtualStaging': {
    width: `calc(100% - ${SIDEBAR_BY_BP.virtualStaging}px)`,
  },

  '@xl': {
    width: `calc(100% - ${SIDEBAR_BY_BP.xl * 2}px)`, 
    justifyContent: 'center',
  },
  '@xxl': {
    width: `calc(100% - ${SIDEBAR_BY_BP.xxl * 2}px)`, 
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
