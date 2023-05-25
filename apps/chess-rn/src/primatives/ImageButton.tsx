import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  ImageBackground,
  type ImageBackgroundProps,
  type ViewStyle,
} from 'react-native'

import { type CSS, css } from '~/style'
import ButtonShell, {type ButtonViewPropsOld, type ButtonState } from './ButtonShell'

const ImageButtonView: React.FC< 
  {
    stateImages: { [key in ButtonState]?: string }
  }
  & Omit<ButtonViewPropsOld, 'css'>
  & Omit<ImageBackgroundProps, 'source'>
> = ({
  onError,    // ignore
  resizeMode, // ignore
  children,
  state,
  stateImages,
  style,
  ...rest
}) => {
  
  const handleError = (e:any) => { console.warn(e.nativeEvent.error) }

  const toSpread = rest
  // rt error
  if ('css' in toSpread) {
    delete toSpread.css
  }

  return (
    <ImageBackground 
      source={{uri: stateImages[state]}} 
      onError={handleError} 
      resizeMode="cover" 
      style={[style, { overflow: 'hidden' }]}
      {...toSpread}
    >
      {children}
    </ImageBackground>
  )
}

const ImageButtonOld: React.FC<
  {
    onClick: () => void
    stateImages: { [key in ButtonState]?: string }
    style?: StyleProp<ViewStyle> // must be this form
  } 
  & PropsWithChildren 
  & Omit<PressableProps, 'style'>
> = ({
  children,
  onClick,
  stateImages,
  ...rest
}) => (
  <ButtonShell 
    view={ImageButtonView as React.FC<ButtonViewPropsOld>} 
    viewProps={{ stateImages }}
    onClick={onClick} 
    {...rest} 
  >
    {children}
  </ButtonShell>
)

export default ImageButtonOld
