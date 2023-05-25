import React from 'react'
import { View } from 'react-native'

import { styled, type CSS } from '~/style'

import type MenuControlProps from './MenuControlProps'
import MenuButton from './MenuButton'
import UndoRedoWidget from './UndoRedoWidget'

const AppBarOuter = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'stretch',
  h: '$appBarHeight', 
  w: '100%', 
  backgroundColor: '$menuBGColor',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInChalkboard: React.FC<{
  css?: CSS
} & MenuControlProps> = ({
  css,
  ...rest
}) => (
  <AppBarOuter css={css}>
    <MenuButton {...rest}/>
    <UndoRedoWidget menu/>
  </AppBarOuter>
)


export default AppBarInChalkboard
