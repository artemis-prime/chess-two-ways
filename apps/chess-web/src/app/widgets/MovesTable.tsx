import React, { 
  useEffect,
  useRef,
  useState, 
  type ReactNode
} from 'react'
import { autorun, makeObservable, observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import { computedFn } from 'mobx-utils'

import ScrollableFeed from 'react-scrollable-feed' 

import { ActionRecord, type Side } from '@artemis-prime/chess-core'

import { useGame } from '~/services'
import { Row, Box } from '~/primatives'
import SideSwatch from './SideSwatch'
import getMoveComment from './getMoveComment'

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any

const COL_WIDTHS = ['1.5rem', '6rem', '6rem', 'auto']

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

const MovesTable: React.FC = observer(() => {

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

    if (rowsRef.current.hilightedMoveRow !== null) {
      if (moveRow > rowsRef.current.hilightedMoveRow) {
        return '$dashTextDisabled'
      }
      else if (moveRow === rowsRef.current.hilightedMoveRow) {
        if (side === 'black' && rowsRef.current.hilightedSide === 'white') {
          return '$dashTextDisabled' 
        }
      }
    }
    const half = rowsRef.current.rows[moveRow][side]
    return half ? ((half.rec.annotatedResult || half.rec.action.includes('capture')) ? '$alert8' : '$dashText')  : '$dashText'
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
    const cleanupReaction = reaction(
      () => {
        /*
        if (game.actions.length <= r.lastActionIndex) {

        }
        */

        return (game.actions.slice(r.lastActionIndex - (game.actions.length - 1)))
      },
      (recs: ActionRecord[]) => {
        const currentRows = [...r.rows]
        let index = r.lastActionIndex + 1
        recs.forEach((rec) => {
            // Must get it from the original array, since
            // it might not be in the slice taken. (recs)
          const previousAction = game.actions[index - 1] 
          if (index % 2) {
            const row = r.rows[r.rows.length - 1]
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim first char
              // Must mutate the actual array
            currentRows[currentRows.length - 1] = {
              white: {...row.white},
              black: {
                str: lan, 
                rec: rec,
                note: getMoveComment(rec, previousAction)
              },
            }
          } 
          else {
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim first char
            currentRows.push({
              white: {
                str: lan,
                rec: rec,
                note: getMoveComment(rec, previousAction)
              },
              black: null,
            }) 
          }
          index++
        })
        r.lastActionIndex = --index
        r.setRows(currentRows)
    })

    const cleanupAutorun = autorun(() => {
      if (game.actions.length - 1 > game.actionIndex) {
        if (game.actionIndex === -1) {
          rowsRef.current.setHilightedMoveRow(-1)
        }
        else {
          rowsRef.current.setHilightedMoveRow((game.actionIndex % 2) ? ((game.actionIndex - 1) / 2) : (game.actionIndex / 2))
          rowsRef.current.setHilightedSide((game.actionIndex % 2) ? 'black' : 'white') 
        }
      }
      else {
        rowsRef.current.setHilightedMoveRow(null)
      }
    })

    return () => {cleanupReaction(); cleanupAutorun()}
  }, [])

  return (
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
            (row.white.note && row.black?.note) ?  <span style={{color: 'gray', fontSize: '25px', lineHeight: '1rem', alignSelf: 'flex-start'}}>...</span> : ''
          ) : (<>
            {row.white.note}
            {(row.white.note && row.black?.note) && <span style={{fontSize: 'inherit', marginRight: '0.3rem'}}>,</span>}
            {row.black?.note}
          </>)}
        </Row>
      </Row>
    ))}
    </Box>
  )
})

export default MovesTable