import {
  Image,
  StatusBar,
  View,
} from 'react-native'

import { styled } from '~/style/stitches.config'
import { BGImage } from '~/primatives'

const OuterContainer = styled(View, {
  height: '100%', 
  backgroundColor: '$headerBG'
})

const GameAreaView = styled(View, {

  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',

  h: '100%',
  pl: '$2',
  pr: '$2',
  pt: '$2',
  pb: 0,
  gap: 11, // bug? Doesn't seem to recognize size token values.
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  
  variants: {
    showBorder: {
      false: {},
      true: {
        borderColor: '#444',
        borderTopLeftRadius: '$md',
        borderWidth: 2,
      }
    }
  }
})

const StatusBarSpacer = styled(View, {
  width: '100%', 
  height: StatusBar.currentHeight!,
  variants: {
    menuVisible: {
      true: {
        backgroundColor: '$headerBG'
      },
      false: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)' // to match the rest of the app area  
      }
    }
  } 
})

  // Creates the appearance of border radius though only
  // siblings are involved.  Yes, I tried everything else, 
  // believe you me!  Yessiree
const CornerShim: React.FC<{
  left: number,
  top: number
}> = ({
  left,
  top
}) => (
  <Image 
    source={{uri: 'menu_corner_shim_14x14'}} 
    resizeMode='cover'
    style={{
      position: 'absolute',
      width: 7, // half since image was captured at double density (ok for both case)
      height: 7,
      left,
      top,
    }} 
  />
)

const GameBGImage = styled(BGImage, {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  height: '100%',
})

export {
  OuterContainer,
  GameAreaView,
  StatusBarSpacer,
  CornerShim,
  GameBGImage
}