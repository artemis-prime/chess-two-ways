import React from 'react'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

import { type CSS } from '~/style'
import { Row, Box, ChalkText as CT } from '~/primatives'

import { type MoveRow } from './Rows'
import { usePulses } from '~/services'
import COLS from './COLS'
import HilightHelper from './HilightHelper'

const Ellipses: React.FC = () => (
  <CT css={{
    color: '$chalkboardTextColorDisabled', 
    alignSelf: 'flex-start'
  }}>...</CT>
)

const Comma: React.FC = () => (
  <CT css={{mr: '$_5'}}>,</CT>
)

const TableRow: React.FC<{
  row: MoveRow
  h: HilightHelper
  i: number
}> = observer(({
  row,
  h,
  i
}) => {

  const pulses = usePulses()

  const pulsingOpacity = computedFn((enabled: boolean): CSS => (
    (enabled) ? { opacity: pulses.slow ? .8 : .7} : {}
  )) 

  return (
    <Row css={{mb: '$_5'}} align='center'>
      <Box css={{
        minWidth: COLS[0], 
        flex: -1, // https://reactnative.dev/docs/layout-props#flex
      }}>
        <CT size='smaller' css={{color: h.disableRow(i) ? '$chalkboardTextColorDisabled' : '$chalkboardTextColor'}}>
          {`${i + 1})`}
        </CT>
      </Box>
      <Box css={{
        w: COLS[1], 
        flex: 0, 
        ...h.sideHilight(i, 'white')
      }}>
        <CT size='smaller' css={h.sideColor(row, i, 'white')}>
          {row.white.str}
        </CT>
      </Box>
      <Box css={{
        w: COLS[2], 
        flex: 0, 
        ...h.sideHilight(i, 'black'), 
        ...pulsingOpacity(!row.black)
      }}>
        <CT size='smaller' css={h.sideColor(row, i, 'black')}>
          {row.black?.str ?? '?'}
        </CT>
      </Box>
      <Row justify='start' align='start' css={{
        flex: 1, 
        flexWrap: 'wrap', 
        textAlign: 'right',
      }}>
        <CT size='short' css={{
          textAlign: 'right'
        }}>
        {h.disableRow(i) ? (
          (row.white.note || row.black?.note) ? <Ellipses /> : ''
        ) : (<>
          { row.white.note }
          {(row.white.note && row.black?.note) && <Comma />}
          { row.black?.note ? ((h.disableSide(i, 'black')) ? <Ellipses /> : row.black!.note) : '' } 
        </>)}
        </CT>
      </Row>
    </Row>
  )
})

export default TableRow
