import React, { type PropsWithChildren } from 'react'
import { 
  type PressableProps,
  type StyleProp,
  ImageBackground,
  type ImageBackgroundProps,
  type ViewStyle,
} from 'react-native'

import ButtonShell, {type ButtonViewProps, type ButtonState } from './ButtonShell'


const ButtonImageStates: React.FC< 
  {
    stateImages: { [key in ButtonState]?: string }
  }
  & ButtonViewProps
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

  return (
    <ImageBackground 
      source={{uri: stateImages[state]}} 
      onError={handleError} 
      resizeMode="cover" 
      style={[style, {
        //width: '100%',
        overflow: 'hidden'
      }]}
      {...rest}
    >
      {children}
    </ImageBackground>
  )
}

const ImageButton: React.FC<
  {
    onClick: () => void
    stateImages: {
      [key in ButtonState]?: string
    },
    style?: StyleProp<ViewStyle>
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
    view={ButtonImageStates as React.FC<ButtonViewProps>} 
    viewProps={{ stateImages }}
    onClick={onClick} 
    {...rest} 
  >
    {children}
  </ButtonShell>
)

export default ImageButton
