import React, { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { 
  styled, 
  deborder, 
  sideArea, 
  applySideWidthsToStyles, 
  useQueryCallback 
} from '~/style'

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
  ...deborder('red', 'layout'),
  fontSize: '0.75rem',
  p: '$_5',
  gap: '$_5',

  '@allMobilePortrait': {
    flexDirection: 'column',
    pb: 0,
  },
  '@deskPortrait': {
    flexDirection: 'column',
    pb: 0,
  },
  '@deskSmaller': {
    fontSize: '0.8rem',
  },
  '@deskSmall': {
    fontSize: '0.9rem',
  },
  '@menuBreak': {
    fontSize: '1rem',
    p: '$1',
    gap: '$1',
  },
  
})

const StartDiv = styled('div', {
  ...deborder('green', 'layout'),
  display: 'none',

  '@maxStaging': {
    display: 'block',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: sideArea.maxStaging,
  },
  '@xl': {
    flexBasis: sideArea.xl,
  },
  '@xxl': {
    flexBasis: sideArea.xxl,
  }
})

const EndDiv = styled('div', 
  applySideWidthsToStyles(
    {
      flexShrink: 0,
      flexGrow: 0,
      ...deborder('blue', 'layout'),

      '@allMobilePortrait': {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
      '@deskPortrait': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '260px',
        transition: '$chalkboardInPortraitOpenTransition',
        flex: 'none',
      },
      '@maxStaging': {
        flexGrow: 1,
        flexShrink: 0,
      },
    }
    ,
    'flexBasis',
    (value: any): string => ((typeof value === 'number') ? `${value}px` : value as string)
  ),
  {
    variants: {
      showMoves: {
        false: {
          '@deskPortrait': {
            height: '80px',
          }
        }
      }
    }
  }
)

const ChessboardOuter = styled('div', 
  applySideWidthsToStyles(
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      ...deborder('yellow', 'layout'),

      '@allMobilePortrait': {
        px: 0,
        flexGrow: 0,
      },
      '@deskPortrait': {
        px: 0,
        flexGrow: 1,
        flexShrink: 1,
      },
      '@deskSmallest': {
        flexShrink: 1,
        flexGrow: 0,
        justifyContent: 'flex-end',
      },
      '@maxStaging': {
        justifyContent: 'center',
      },
    },
    'width',
    (value: any): string => (`calc(100% - ${((typeof value === 'number') ? `${value * 2}px` : value as string)})`),
    true
  )
)

const ChessboardArea: React.FC = () => {

  const [tall, setTall] = useState<boolean>(false)
  const { ref } = useResizeDetector({
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

  useQueryCallback('maxStaging', () => {setSideMenuOpen(false)})
  const toggleMenu = () => { setSideMenuOpen((prev) => (!prev)) }
  
  return (
    <Outer>
      <Header menuOpen={sideMenuOpen} toggleMenu={toggleMenu} />
      <Main>
        <StartDiv />
        <ChessboardArea />
        <EndDiv showMoves={showMoves}>
          <Chalkboard showMoves={showMoves} setShowMoves={setShowMoves} />
        </EndDiv>
        <SideMenu open={sideMenuOpen} css={{ 
          '@maxStaging': { display: 'none'},
          '$$drawerWidth': '85%',
          '@deskPortrait': { '$$drawerWidth': '280px' },
          '@tabletPortrait': { '$$drawerWidth': '280px' },
          '@deskSmaller': { '$$drawerWidth': '280px' }
        }} />
      </Main>
    </Outer>
  )
}

export default Layout
