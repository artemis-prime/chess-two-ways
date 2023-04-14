import React, { PropsWithChildren, useEffect, useState } from 'react'
import { 
  ImageBackground, 
  Image, 
  ImageSourcePropType, 
  StyleProp, 
  ViewStyle 
} from 'react-native'


import { styled } from '~/stitches.config'

const StyledImageBackground = styled(ImageBackground, {
  width: '100%',
  overflow: 'hidden'
})


const BGImage: React.FC<{
  imageURI: string,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  children,
  imageURI,
  style
}) => {
  
  const handleError = (e:any) => { console.warn(e.nativeEvent.error) }

  return (
    <StyledImageBackground 
      source={{uri: imageURI}} 
      onError={handleError} 
      resizeMode="cover" 
      style={style}
    >
      {children}
    </StyledImageBackground>
  )
}

export default BGImage
