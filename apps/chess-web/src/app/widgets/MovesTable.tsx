import React, { 
  useEffect,
  useRef,
  type ReactNode
} from 'react'
import { 
  makeObservable, 
  observable, 
  action, 
  reaction, 
  type IReactionDisposer 
} from 'mobx'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

import ScrollableFeed from 'react-scrollable-feed' 

import { ActionRecord, type Side } from '@artemis-prime/chess-core'

import { styled, type CSS, deborder } from '~/style'
import { useChess, usePulses, useTransientMessage } from '~/services'
import { Row, Box, HR } from '~/primatives'

import SideSwatch from './SideSwatch'
import getMoveComment from './getMoveComment'

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any
const COL_WIDTHS = ['1.1em', '6em', '6em', 'auto']

const StyledSpan = styled('span', {})

const Ellipses: React.FC = () => (
  <StyledSpan css={{color: '$chalkboardTextColorDisabled', fontSize: '1.6em', lineHeight: '1em', alignSelf: 'flex-start'}}>...</StyledSpan>
)

const Comma: React.FC = () => (
  <StyledSpan css={{fontSize: 'inherit', mr: '0.3em'}}>,</StyledSpan>
)

const Outer = styled('div', {
  ...deborder('yellow', 'chalk'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
})

const ScrollableOuter = styled('div', {
  flex: '1 0 auto', 
  position: 'relative', 
  ...deborder('red', 'chalk')
})

interface MoveRow {
  white: {
    str: string
    rec: ActionRecord
    note: ReactNode
  }
  black: {
    str: string
    rec: ActionRecord
    note: ReactNode
  } | null
} 

class Rows {

  rows: MoveRow[] = []
  lastActionIndex = -1

  hilightedMoveRow: number | null = null
  hilightedSide: Side = 'white' // arbitrary.  only dereferenced after being set  

  constructor() {
    makeObservable(this, {
      rows: observable.shallow,
      hilightedMoveRow: observable,
      hilightedSide: observable,
      setRows: action,
      setHilightedMoveRow: action,
      setHilightedSide: action,
    })
  }

  setRows(rows: MoveRow[]) {this.rows = rows}
  setHilightedMoveRow(r: number | null) {this.hilightedMoveRow = r}
  setHilightedSide(s: Side) {this.hilightedSide = s}
}

const StyledScrollable = styled(Scrollable, {

  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  mt: '$1',
  overflowX: 'hidden',

  '&::-webkit-scrollbar': {
    width: '10px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#444',
    border: '1px solid #777',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor: '#777',
    '&:hover': {
      backgroundColor: '#aaa'
    }
  }
})

const MovesTable: React.FC<{
  show: boolean,
  css?: CSS
}> = observer(({
  show,
  css
}) => {

  const rowsRef = useRef<Rows>(new Rows())
  const game = useChess()
  const pulses = usePulses()
  const tm = useTransientMessage()

  const sideHilight = computedFn((moveRow: number, side: Side): any => {
    if (rowsRef.current.hilightedMoveRow !== null) {
      if (rowsRef.current.hilightedMoveRow === moveRow && rowsRef.current.hilightedSide === side) {
        return {
          p: '0.15em',
          border: '0.1em dashed $alert8',
          borderRadius: '3px'
        }
      }
    }
    return {p: '0.25em'}
  })

  const sideColor = computedFn((moveRow: number, side: Side): CSS => {

    if (disableSide(moveRow, side)) {
      return { color: '$chalkboardTextColorDisabled'}
    }
    const half = rowsRef.current.rows[moveRow][side]
    return {color:  half ? ((half.rec.annotatedResult || half.rec.action.includes('capture')) ? '$alert8' : '$chalkboardTextColor')  : '$chalkboardTextColor'}
  })

  const disableSide = computedFn((moveRow: number, side: Side): boolean => {

    if (rowsRef.current.hilightedMoveRow !== null) {
      if (moveRow > rowsRef.current.hilightedMoveRow) {
        return true
      }
      else if (moveRow === rowsRef.current.hilightedMoveRow) {
        if (side === 'black' && rowsRef.current.hilightedSide === 'white') {
          return true 
        }
      }
    }
    return false
  })

  const disableRow = computedFn((moveRow: number): boolean => {
    if (rowsRef.current.hilightedMoveRow !== null) {
      if (moveRow > rowsRef.current.hilightedMoveRow) {
        return true
      }
    }
    return false
  })

  useEffect(() => {

    const r = rowsRef.current
    const disposers: IReactionDisposer[] = []
    disposers.push(reaction(
      () => {
          // Reaction firing as the result of an action after an undo
          // So must rewind lastActionIndex to exactly the second to last
          // element (since that is the last index handled that is still valid) 
        if (r.lastActionIndex >= 0 && game.actions.length - 1 <= r.lastActionIndex) {
          r.lastActionIndex = game.actions.length - 2
        }
        
        return ({
          first: r.lastActionIndex, 
          last: game.actions.length - 1
        })
      },
      ({first, last}) => {
        const lastRow = first % 2 ? (first - 1) / 2 : first / 2
          // If there have been undo's...
        const currentRows = (lastRow < r.rows.length - 1) ? 
            // ...truncate the array 
          r.rows.slice(0, lastRow + 1) 
          : 
          [...r.rows]

        let index = first + 1
        for ( ; index <= last; index++) {
          const currentAction = game.actions[index] 
          const previousAction = game.actions[index - 1] 
            // black
          if (index % 2) {
            const row = r.rows[r.rows.length - 1]
              // Must mutate the actual array
            currentRows[currentRows.length - 1] = {
              white: {...row.white},
              black: {
                str: currentAction.toCommonLANString(), 
                rec: currentAction,
                note: getMoveComment(currentAction, previousAction)
              },
            }
          } 
            // white
          else {
            currentRows.push({
              white: {
                str: currentAction.toCommonLANString(),
                rec: currentAction,
                note: getMoveComment(currentAction, previousAction)
              },
              black: null,
            }) 
          }
        }
        r.lastActionIndex = --index
        r.setRows(currentRows)
    }))

    disposers.push(reaction(
      () => {
        let hilightedRow: number | null = null // not in undo / redo "state" 
        let hilightedSide: Side = 'white'  // arbitrary (avoiding null)
          // in undo / redo "state"
        if (game.actionIndex < game.actions.length - 1) {
            // boundary condition
          if (game.actionIndex === -1) {
            hilightedRow = -1
          }
          else {
            hilightedRow = (game.actionIndex % 2) ? ((game.actionIndex - 1) / 2) : (game.actionIndex / 2)
            hilightedSide = (game.actionIndex % 2) ? 'black' : 'white' 
          }
        }
        return {
          hilightedRow,
          hilightedSide
        }
      },
      ({hilightedRow, hilightedSide}) => {
        r.setHilightedMoveRow(hilightedRow)
        r.setHilightedSide(hilightedSide) 
      }
    ))

    return () => {disposers.forEach((disposer) => { disposer() })}
  }, [])

  const pulsingOpacity = computedFn((enabled: boolean): CSS => (
    (enabled) ? { opacity: pulses.slow ? .8 : .7} : {}
  )) 

  const swatchCss = computedFn((side: Side): CSS =>  ({
    width: '100%', 
    borderColor: (game.currentTurn === side && pulses.slow) ? ((side === 'white') ? '#ddd' : '#888') : '#777', 
    opacity: (game.currentTurn === side) ? 1 : ((side === 'white') ? 0.7 : 0.5)
  })) 

  const r = rowsRef.current
  return show ? (
    <Outer css={css}>
    {r.rows.length > 0 && (<>
      <Row css={{w: '100%', mb: '$_5', flex: 'none'}} key='title-row'>
        <Box css={{w: COL_WIDTHS[0], mr: '$_5'}}>&nbsp;</Box>
        <Box css={{w: COL_WIDTHS[1], pr: '$1_5'}}><SideSwatch narrow side='white' css={swatchCss('white')}/></Box>
        <Box css={{w: COL_WIDTHS[2], pr: '$1_5'}}><SideSwatch narrow side='black' css={swatchCss('black')}/></Box>
        <Row justify='center' css={{w: COL_WIDTHS[3]}}>notes:</Row>
      </Row>
      <HR css={{flex: 'none'}}/>
    </>)}
      <ScrollableOuter>
        <StyledScrollable>
        {r.rows.map((row: MoveRow, i) => (
          <Row css={{w: '100%', mb: '$_5'}} key={row.white.str + (row.black?.str ?? '')} align='center'>
            <Box 
              css={{
                minWidth: COL_WIDTHS[0], 
                flex: 'none', 
                color: disableRow(i) ? '$chalkboardTextColorDisabled' : '$chalkboardTextColor' 
              }}
            >{`${i + 1})`}</Box>
            <Box 
              css={{
                w: COL_WIDTHS[1], 
                flex: 'none', 
                ...sideColor(i, 'white'), 
                ...sideHilight(i, 'white')
              }}
            >{row.white.str}</Box>
            <Box 
              css={{
                w: COL_WIDTHS[2], 
                flex: 'none', 
                ...sideColor(i, 'black'), 
                ...sideHilight(i, 'black'), 
                ...pulsingOpacity(!row.black)
              }}
            >{row.black?.str ?? '?'}</Box>
            <Row 
              justify='start' 
              align='start' 
              css={{
                w: COL_WIDTHS[3], 
                flexGrow: 3, 
                flexWrap: 'wrap', 
                whiteSpace: 'nowrap', 
                fontSize: '0.9em',
                lineHeight: '1em',
                textAlign: 'right',
              }}
            >
              {disableRow(i) ? (
                (row.white.note || row.black?.note) ? <Ellipses /> : ''
              ) : (<>
                { row.white.note }
                {(row.white.note && row.black?.note) && <Comma />}
                { row.black?.note ? ((disableSide(i, 'black')) ? <Ellipses /> : row.black!.note) : '' } 
              </>)}
            </Row>
          </Row>
        ))}
        
        { // If the previous row was complete, create a fake last row for the pulsing '?' for white.
        !disableRow(r.rows.length /* safe */) && r.rows.length > 0 && r.rows[r.rows.length - 1].black != null && (
          <Row css={{w: '100%', mb: '$_5'}} key='last'>
            <Box css={{minWidth: COL_WIDTHS[0], flex: 'none', mr: '$_5', color:'$chalkboardTextColor' }}>{`${r.rows.length + 1})`}</Box>
            <Box css={{w: COL_WIDTHS[1], flex: '5 0 auto', color: '$chalkboardTextColor', ...pulsingOpacity(true)}}>?</Box>
          </Row>
        )}
        {tm.message && <Box css={{color: tm.message.type.includes('warning') ? '$alert8' : '$chalkboardTextColor'}}>{tm.message.content}</Box>}
        </StyledScrollable>
      </ScrollableOuter>
    </Outer>
  ) : tm.message ? <Box css={{color: tm.message.type.includes('warning') ? '$alert8' : '$chalkboardTextColor'}}>{tm.message.content}</Box> : null
})

export default MovesTable
