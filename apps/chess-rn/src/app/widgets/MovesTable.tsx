import React, { useRef } from 'react'
import { FlatList, View, type ListRenderItem } from 'react-native'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

import { type Move, type Side } from '@artemis-prime/chess-core'

import { styled, type CSS, deborder as deb } from '~/style'
import { Row, Box, HR, ChalkText as CT } from '~/primatives'
import { useChess, usePulses } from '~/services'

import SideSwatch from './SideSwatch'
import Rows, { type MoveRow } from './movesTable/Rows'
import HilightHelper from './movesTable/HilightHelper'
import useTableReactions from './movesTable/useTableReactions'
import TableRow from './movesTable/TableRow'

import COLS from './movesTable/COLS'
import { toJS } from 'mobx'

const Outer = styled(View, {
  ...deb('yellow', 'moves'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  height: 100
})

const MovesTable: React.FC<{
  show: boolean,
  css?: CSS
}> = observer(({
  show,
  css
}) => {

  const rowsRef = useRef<Rows>(new Rows())
  const helperRef = useRef<HilightHelper>(new HilightHelper(rowsRef.current))
  const game = useChess()
  const pulses = usePulses()

  useTableReactions(game, rowsRef.current)

  const swatchCss = computedFn((side: Side): CSS =>  ({
    width: '100%', 
    borderColor: (game.currentTurn === side && pulses.slow) ? ((side === 'white') ? '#ddd' : '#888') : '#777', 
    opacity: (game.currentTurn === side) ? 1 : ((side === 'white') ? 0.7 : 0.5)
  })) 

  const HeaderRow: React.FC = observer(() => (
    <Row align='end' css={{w: '100%', mb: '$_5', flex: 0}} key='title-row'>
      <Box css={{w: COLS[0], mr: '$_5', ...deb('yellow', 'movesH')}}><CT>{' '}</CT></Box>
      <Box css={{w: COLS[1], pr: '$1_5', ...deb('orange', 'movesH')}}>
        <SideSwatch narrow side='white' css={swatchCss('white')}/>
      </Box>
      <Box css={{w: COLS[2], pr: '$1_5', ...deb('yellow', 'movesH')}}>
        <SideSwatch narrow side='black' css={swatchCss('black')}/>
      </Box>
      <Row justify='center' align='end' css={{flexGrow: 1, ...deb('orange', 'movesH')}}>
        <CT size='short' css={{ top: 2, ...deb('white', 'movesH')}}>notes:</CT>
      </Row>
    </Row>
  ))

  return show ? (
    <Outer css={css}>
      <HeaderRow />
      <HR css={{flex: 0, mt: 0}}/>
      <FlatList<MoveRow> 
        renderItem={({item, index}) => (<TableRow row={item} i={index} h={helperRef.current} />)}
        data={rowsRef.current.rows.slice()}
        keyExtractor={(row) => (row.white.str + (row.black?.str ?? ''))}
      />
    </Outer>
  ) : null
})

export default MovesTable
 
