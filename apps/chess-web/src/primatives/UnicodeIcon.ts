import type { CSSProperties } from "@stitches/react"

interface IconAndStyles {
  icon: string 
  style: CSSProperties
}

type UnicodeIcon = 'empty' | string | IconAndStyles

export {
  type UnicodeIcon as default,
  type IconAndStyles
}
