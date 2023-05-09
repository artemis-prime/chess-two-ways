import type { StyleProp, TextStyle } from "react-native/types"

interface IconAndStyles {
  icon: string 
  style: StyleProp<TextStyle>
}

type UnicodeIcon = 'empty' | string | IconAndStyles

export {
  type UnicodeIcon as default,
  type IconAndStyles
}
