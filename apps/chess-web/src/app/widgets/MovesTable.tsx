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

import { styled } from '~/styles/stitches.config'

import { useGame } from '~/services'
import { Row, Box } from '~/primatives'
import SideSwatch from './SideSwatch'
import getMoveComment from './getMoveComment'

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any

const COL_WIDTHS = ['1.5rem', '6rem', '6rem', 'auto']

const StyledSpan = styled('span', {})

const Ellipses: React.FC = () => (
  <StyledSpan css={{color: '$dashTextDisabled', fontSize: '25px', lineHeight: '1rem', alignSelf: 'flex-start'}}>...</StyledSpan>
)

const Comma: React.FC = () => (
  <StyledSpan css={{fontSize: 'inherit', mr: '0.3rem'}}>,</StyledSpan>
)

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

const MovesTable: React.FC<{
  show: boolean
}> = observer(({
  show
}) => {

  const rowsRef = useRef<Rows>(new Rows())
  const game = useGame()

  const getHilight = computedFn((moveRow: number, side: Side): any => {
    if (rowsRef.current.hilightedMoveRow !== null) {
      if (rowsRef.current.hilightedMoveRow === moveRow && rowsRef.current.hilightedSide === side) {
        return {
          p: '2px',
          border: '2px dashed $alert8',
          borderRadius: '3px'
        }
      }
    }
    return {p: '4px'}
  })

  const getMoveColor = computedFn((moveRow: number, side: Side): string => {

    if (disableHalf(moveRow, side)) {
      return '$dashTextDisabled'
    }
    const half = rowsRef.current.rows[moveRow][side]
    return half ? ((half.rec.annotatedResult || half.rec.action.includes('capture')) ? '$alert8' : '$dashText')  : '$dashText'
  })

  const disableHalf = computedFn((moveRow: number, side: Side): boolean => {

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

  return show ? (
    <Box css={{w: '100%', mt: '$oneAndHalf'}}>
    {rowsRef.current.rows.length > 0 && (<>
      <Row css={{w: '100%', mb: '$half'}} key='title-row'>
        <Box css={{w: COL_WIDTHS[0], mr: '$1'}}>&nbsp;</Box>
        <Box css={{w: COL_WIDTHS[1], pr: '$oneAndHalf'}}><SideSwatch side='white' css={{width: '100%', height: '16px', borderWidth: '$normal', opacity: 0.8}}/></Box>
        <Box css={{w: COL_WIDTHS[2], pr: '$oneAndHalf'}}><SideSwatch side='black' css={{width: '100%', height: '16px', borderWidth: '$normal', opacity: 0.8}}/></Box>
        <Row justify='center' css={{w: COL_WIDTHS[3]}}>notes:</Row>
      </Row>
      <hr />
    </>)}
    {rowsRef.current.rows.map((row: MoveRow, i) => (
      <Row css={{w: '100%', mb: '$half'}} key={row.white.str + (row.black?.str ?? '')}>
        <Box css={{w: COL_WIDTHS[0], flex: 'none', mr: '$1', color: disableRow(i) ? '$dashTextDisabled' : '$dashText' }}>{`${i + 1})`}</Box>
        <Box css={{w: COL_WIDTHS[1], flex: 'none', color: getMoveColor(i, 'white'), ...getHilight(i, 'white')}}>{row.white.str}</Box>
        <Box css={{w: COL_WIDTHS[2], flex: 'none', color: getMoveColor(i, 'black'), ...getHilight(i, 'black')}}>{row.black?.str ?? ''}</Box>
        <Row justify='start' align='end' css={{
          w: COL_WIDTHS[3], 
          flexGrow: 3, 
          flexWrap: 'wrap', 
          whiteSpace: 'nowrap', 
          fontSize: '0.8rem',
          lineHeight: '1rem',
          textAlign: 'right',
        }}>
          {disableRow(i) ? (
            (row.white.note || row.black?.note) ? <Ellipses /> : ''
          ) : (<>
            { row.white.note }
            {(row.white.note && row.black?.note) && <Comma />}
            { row.black?.note ? ((disableHalf(i, 'black')) ? <Ellipses /> : row.black!.note) : '' } 
          </>)}
        </Row>
      </Row>
    ))}
    </Box>
  ) : null
})

export default MovesTable
