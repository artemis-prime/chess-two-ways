import React, { PropsWithChildren } from 'react'
import { 
  ImageBackground, 
  ImageBackgroundProps
} from 'react-native'

const BGImage: React.FC<
  {
    imageURI: string,
  } 
  & PropsWithChildren 
  & Omit<ImageBackgroundProps, 'source'>
> = ({
  onError,    // ignore
  resizeMode, // ignore
  children,
  imageURI,
  style,
  ...rest
}) => {
  
  const handleError = (e:any) => { console.warn(e.nativeEvent.error) }

  return (
    <ImageBackground 
      source={{uri: imageURI}} 
      onError={handleError} 
      resizeMode="cover" 
      style={[style, {
        width: '100%',
        overflow: 'hidden'
      }]}
      {...rest}
    >
      {children}
    </ImageBackground>
  )
}

export default BGImage
