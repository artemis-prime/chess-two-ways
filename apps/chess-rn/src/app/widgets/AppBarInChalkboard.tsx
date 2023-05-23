import React from 'react'
import { View } from 'react-native'

import { styled, type CSS } from '~/style'

import type MenuControlProps from './MenuControlProps'
import MenuButton from './MenuButton'

const AppBarView = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'flex-start', 
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
  <AppBarView css={css}>
    <MenuButton {...rest}/>
  </AppBarView>
)


export default AppBarInChalkboard
