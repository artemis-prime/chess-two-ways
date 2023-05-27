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
import RenderHelper from './movesTable/RenderHelper'
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
  const pulses = usePulses()
  const helperRef = useRef<RenderHelper>(new RenderHelper(rowsRef.current, pulses))
  const game = useChess()

  useTableReactions(game, rowsRef.current)

  const swatchCss = computedFn((side: Side): CSS =>  ({
    width: '100%', 
    borderColor: (game.currentTurn === side && pulses.slow) ? ((side === 'white') ? '#ddd' : '#888') : '#777', 
    opacity: (game.currentTurn === side) ? 1 : ((side === 'white') ? 0.7 : 0.5)
  })) 

  const HeaderRow: React.FC = observer(() => (
    <Row align='end' css={{w: '100%', mb: '$_5', flex: 0}} key='title-row'>
      <Box css={{ mr: '$_5', ...deb('yellow', 'movesH')}}><CT size='small' css={{opacity: 0}}>{helperRef.current.sizingString()}</CT></Box>
      <Box css={{w: COLS[1], pr: '$1_5', ...deb('orange', 'movesH')}}>
        <SideSwatch narrow side='white' css={swatchCss('white')}/>
      </Box>
      <Box css={{w: COLS[2], pr: '$1_5', ...deb('yellow', 'movesH')}}>
        <SideSwatch narrow side='black' css={swatchCss('black')}/>
      </Box>
      <Row justify='start' align='end' css={{flexGrow: 1, pl: '$1', ...deb('orange', 'movesH')}}>
        <CT size='short' css={{ top: 2, ...deb('white', 'movesH')}}>notes:</CT>
      </Row>
    </Row>
  ))

  const Footer: React.FC = observer(() => (
    // If the previous row was complete, create a fake last row for the pulsing '?' in white's column.
    (!helperRef.current.disableRow(rowsRef.current.rows.length /* safe */) 
      && rowsRef.current.rows.length > 0 
      && rowsRef.current.rows[rowsRef.current.rows.length - 1].black != null
    ) ? (
      <Row css={{w: '100%', mb: '$_5'}} key='last'>
        <Box css={{minWidth: COLS[0], flex: -1, mr: '$_5', color:'$chalkboardTextColor', ...deb('red', 'moves')}}>
          <CT size='small' css={{opacity: 0}}>{helperRef.current.sizingString()}</CT>
          <CT size='small' css={{position: 'absolute', t: 0, l: 0, b: 0, r: 0}}>
            {`${rowsRef.current.rows.length + 1})`}
          </CT>
        </Box>
        <Box css={{w: COLS[1], flex: '5 0 auto', color: '$chalkboardTextColor', ...helperRef.current.pulsingOpacity(true)}}>
          <CT size='small' css={helperRef.current.pulsingFontSize('$fontSizeSmaller', '$fontSizeSmall', true)}>?</CT>
        </Box>
      </Row>
    ) 
    : 
    null
  )) 

  return show ? (
    <Outer css={css}>
      <HeaderRow />
      <HR css={{flex: 0, mt: 0}}/>
      <FlatList<MoveRow> 
        renderItem={({item, index}) => (<TableRow row={item} i={index} h={helperRef.current} />)}
        data={rowsRef.current.rows.slice()}
        keyExtractor={(row) => (row.white.str + (row.black?.str ?? ''))}
        ListFooterComponent={Footer}
      />
    </Outer>
  ) : null
})

export default MovesTable
 
