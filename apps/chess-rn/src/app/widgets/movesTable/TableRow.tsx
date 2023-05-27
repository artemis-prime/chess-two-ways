import React from 'react'
import { observer } from 'mobx-react-lite'

import { deborder } from '~/style'
import { Row, Box, ChalkText as CT } from '~/primatives'

import { type MoveRow } from './Rows'
import COLS from './COLS'
import RenderHelper from './RenderHelper'

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
  h: RenderHelper
  i: number
}> = observer(({
  row,
  h,
  i
}) => (
  <Row css={{mb: '$_5'}} align='center'>
    <Box css={{
      minWidth: COLS[0], 
      flex: -1, // https://reactnative.dev/docs/layout-props#flex
    }}>
      <CT size='small' css={{opacity: 0}}>{h.sizingString()}</CT>
      <CT size='small' css={{
          position: 'absolute', t: 0, l: 0, b: 0, r: 0,
          color: h.disableRow(i) ? '$chalkboardTextColorDisabled' : '$chalkboardTextColor',
          ...deborder('red')
      }}>
        {`${i + 1})`}
      </CT>
    </Box>
    <Box css={{
      w: COLS[1], 
      flex: 0, 
      ...h.sideHilight(i, 'white')
    }}>
      <CT size='small' css={h.sideColor(row, i, 'white')}>
        {row.white.str}
      </CT>
    </Box>
    <Box css={{
      w: COLS[2], 
      flex: 0, 
      ...h.sideHilight(i, 'black'), 
      ...h.pulsingOpacity(!row.black)
    }}>
      <CT size='small' css={{
        ...h.sideColor(row, i, 'black'), 
        ...h.pulsingFontSize('$fontSizeSmaller', '$fontSizeSmall', !row.black)
      }}>
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
))

export default TableRow
