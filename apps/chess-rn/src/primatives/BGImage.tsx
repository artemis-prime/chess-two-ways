import React, { PropsWithChildren, useEffect, useState } from 'react'
import { 
  ImageBackground, 
  Image, 
  ImageSourcePropType, 
  StyleProp, 
  ViewStyle 
} from 'react-native'

const BGImage: React.FC<{
  imagePath: ImageSourcePropType,
  style?: StyleProp<ViewStyle>
} & PropsWithChildren> = ({
  children,
  imagePath,
  style
}) => {
  
  const [imageUri, setImageUri] = useState<string>('')

  useEffect(() => {
    setImageUri(Image.resolveAssetSource(imagePath).uri)
  })

  const handleError = (e:any) => { console.warn(e.nativeEvent.error) }

  return imageUri ? (
    <ImageBackground 
      source={{uri: imageUri}} 
      onError={handleError} 
      resizeMode="cover" 
      style={{ height: '100%', ...(style as object) }}
    >
      {children}
    </ImageBackground>
  ) : (<>{children}</>)
}

export default BGImage
