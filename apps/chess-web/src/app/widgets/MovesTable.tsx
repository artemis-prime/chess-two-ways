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
          const previousAction = game.actions[index - 1] // reference original since it might now be in our slice (recs)
          if (index % 2) {
            const row = currentRows[currentRows.length - 1]
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim off first char
            const newRow = {
              w: {...row.w},
              b: {
                str: lan, 
                rec: rec,
                note: getMoveComment(rec, previousAction)
              },
            }
            currentRows[currentRows.length - 1] = newRow // must mutate the array
          } 
          else {
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim off first char
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
        <Box css={{w: '1.5rem', mr: '$1'}}>&nbsp;</Box>
        <Box css={{w: '6rem', pr: '$oneAndHalf'}}><SideSwatch side='white' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Box css={{w: '6rem', pr: '$oneAndHalf'}}><SideSwatch side='black' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Box css={{w: 'auto'}}>&nbsp;</Box>
      </Row>
      <hr />
    </>)}
    {rowsRef.current.rows.map((row: MoveRow, i) => (
      <Row css={{w: '100%', mb: '$half'}} key={row.w.str + row.b?.str}>
        <Box css={{w: '1.5rem', mr: '$1'}}>{`${i + 1})`}</Box>
        <Box css={{w: '6rem', color: (row.w.rec.annotatedResult || row.w.rec.action.includes('capture')) ? '$alert8' : 'white'}}>{row.w.str}</Box>
        <Box css={{w: '6rem', color: (row.b?.rec.annotatedResult || row.w.rec.action.includes('capture')) ? '$alert8' : 'white'}}>{row.b ? row.b.str : ''}</Box>
        <Row justify='end' align='end' css={{w: 'auto', flexWrap: 'wrap', flexGrow: 3, whiteSpace: 'nowrap'}}>
          {row.w.note}
          {row.b?.note && <span style={{fontSize: '0.8rem', marginRight: '0.3rem'}}>,</span>}
          {row.b?.note}
        </Row>
      </Row>
    ))}
    </Box>
  )
})

export default MovesTable