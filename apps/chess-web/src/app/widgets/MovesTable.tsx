import React, { 
  useEffect,
  useRef,
  useState, 
  type ReactNode
} from 'react'
import { autorun, makeObservable, observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'

import ScrollableFeed from 'react-scrollable-feed' 

import { ActionRecord } from '@artemis-prime/chess-core'

import { useGame } from '~/services'
import { Row, Box } from '~/primatives'
import SideSwatch from './SideSwatch'
import getMoveComment from './getMoveComment'

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any

const COL_WIDTHS = ['1.5rem', '6rem', '6rem', 'auto']

interface MoveRow {
  w: {
    str: string
    rec: ActionRecord
    note: ReactNode
  }
  b: {
    str: string
    rec: ActionRecord
    note: ReactNode
  } | null
}

class Rows {
  rows: MoveRow[] = []
  lastIndex = -1

  constructor() {
    makeObservable(this, {
      rows: observable.shallow,
      setRows: action
    })
  }

  setRows(r: MoveRow[]) {this.rows = r}
}


const MovesTable: React.FC = observer(() => {

  const rowsRef = useRef<Rows>(new Rows())

  const game = useGame()

  useEffect(() => {

    return reaction(
      () => (game.actions.slice(rowsRef.current.lastIndex - (game.actions.length - 1))),
      (recs: ActionRecord[]) => {
        const currentRows = [...rowsRef.current.rows]
        let index = rowsRef.current.lastIndex + 1
        recs.forEach((rec) => {
            // Must get it from the original array, since
            // it might not be in the slice taken. (recs)
          const previousAction = game.actions[index - 1] 
          if (index % 2) {
            const row = rowsRef.current.rows[rowsRef.current.rows.length - 1]
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim first char
              // Must mutate the actual array
            currentRows[currentRows.length - 1] = {
              w: {...row.w},
              b: {
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
              w: {
                str: lan,
                rec: rec,
                note: getMoveComment(rec, previousAction)
              },
              b: null,
            }) 
          }
          index++
        })
        rowsRef.current.lastIndex = --index
        rowsRef.current.setRows(currentRows)
    })
  }, [])


  return (
    <Box css={{w: '100%', mt: '$oneAndHalf'}}>
    {rowsRef.current.rows.length > 0 && (<>
      <Row css={{w: '100%', mb: '$half'}} key='title-row'>
        <Box css={{w: COL_WIDTHS[0], mr: '$1'}}>&nbsp;</Box>
        <Box css={{w: COL_WIDTHS[1], pr: '$oneAndHalf'}}><SideSwatch side='white' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Box css={{w: COL_WIDTHS[2], pr: '$oneAndHalf'}}><SideSwatch side='black' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Row justify='center' css={{w: COL_WIDTHS[3]}}>notes:</Row>
      </Row>
      <hr />
    </>)}
    {rowsRef.current.rows.map((row: MoveRow, i) => {

      const wColor = (row.w.rec.annotatedResult || row.w.rec.action.includes('capture')) ? '$alert8' : 'white'
      const bColor = (row.b?.rec.annotatedResult || row.b?.rec.action.includes('capture')) ? '$alert8' : 'white'
      
      return (
        <Row css={{w: '100%', mb: '$half'}} key={row.w.str + (row.b?.str ?? '')}>
          <Box css={{w: COL_WIDTHS[0], flex: 'none', mr: '$1'}}>{`${i + 1})`}</Box>
          <Box css={{w: COL_WIDTHS[1], flex: 'none', color: wColor}}>{row.w.str}</Box>
          <Box css={{w: COL_WIDTHS[2], flex: 'none', color: bColor}}>{row.b?.str ?? ''}</Box>
          <Row justify='start' align='end' css={{
            w: COL_WIDTHS[3], 
            flexGrow: 3, 
            flexWrap: 'wrap', 
            whiteSpace: 'nowrap', 
            fontSize: '0.8rem',
            textAlign: 'right'
          }}>
            {row.w.note}
            {(row.w.note && row.b?.note) && <span style={{fontSize: 'inherit', marginRight: '0.3rem'}}>,</span>}
            {row.b?.note}
          </Row>
        </Row>
      )
    })}
    </Box>
  )
})

export default MovesTable