import React from 'react'
import { 
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { ImageButton } from '~/primatives'
import { useTheme } from '~/style'

const LogoButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle> // must be this form
}> = ({
  onClick,
  disabled,
  style
}) => {

  const theme = useTheme()
  return (
    <ImageButton
      defaultImageURI='knight_logo_80_normal'
      disabledState={{containerStyle: { opacity: 0.7 }}}
      onClick={onClick}
      disabled={disabled}
      containerStyle={[
        style,
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.pieceColorWhite
        }
      ]}
      imageStyle={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default LogoButton
