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

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any

interface MoveRow {
  w: {
    str: string
    rec: ActionRecord
  }
  b: {
    str: string
    rec: ActionRecord
  } | null
  note: ReactNode
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

    const getNotesForRecord = (r: ActionRecord, existing?: ReactNode): ReactNode => (
      (existing) ? 'both' : 'white'
    )

    return reaction(
      () => (game.actions.slice(rowsRef.current.lastIndex - (game.actions.length - 1))),
      (recs: ActionRecord[]) => {
        const currentRows = [...rowsRef.current.rows]
        let index = rowsRef.current.lastIndex + 1
        recs.forEach((rec) => {
          if (index % 2) {
            const row = currentRows[currentRows.length - 1]
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim off first char
            const newRow = {
              w: {...row.w},
              b: {
                str: lan, 
                rec: rec
              },
              note: getNotesForRecord(rec, row.note)
            }
            currentRows[currentRows.length - 1] = newRow // must mutate the array
          } 
          else {
            let lan = rec.toLANString()
            lan = lan.slice(-(lan.length - 1)) // trim off first char
            currentRows.push({
              w: {
                str: lan,
                rec: rec
              },
              b: null,
              note: getNotesForRecord(rec)
            }) 
          }
          index++
        })
        rowsRef.current.lastIndex = --index
        rowsRef.current.setRows(currentRows)
    })
  }, [])


  return (
    <Box css={{mt: '$oneAndHalf'}}>
    {rowsRef.current.rows.length > 0 && (
      <Row css={{w: '100%', mb: '$half'}} key='title-row'>
        <Box css={{w: '1.5rem', mr: '$1'}}>&nbsp;</Box>
        <Box css={{w: '6rem', pr: '$oneAndHalf'}}><SideSwatch side='white' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Box css={{w: '6rem', pr: '$oneAndHalf'}}><SideSwatch side='black' css={{width: '100%', height: '16px', borderWidth: '$normal'}}/></Box>
        <Box css={{w: 'auto'}}>&nbsp;</Box>
      </Row>
    )}
    {rowsRef.current.rows.map((row: MoveRow, i) => (
      <Row css={{w: '100%', mb: '$half'}} key={row.w.str + row.b?.str}>
        <Box css={{w: '1.5rem', mr: '$1'}}>{`${i + 1})`}</Box>
        <Box css={{w: '6rem', color: (row.w.rec.annotatedResult) ? '$alert8' : 'white'}}>{row.w.str}</Box>
        <Box css={{w: '6rem', color: (row.b?.rec.annotatedResult) ? '$alert8' : 'white'}}>{row.b ? row.b.str : ''}</Box>
        <Box css={{w: 'auto'}}>{row.note}</Box>
      </Row>
    ))}
    </Box>
  )
})

export default MovesTable