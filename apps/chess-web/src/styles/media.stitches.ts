const media = {
  motion: '(prefers-reduced-motion)',
  hover: '(any-hover: hover)',
} as {
  [key in string]: string
}

const BREAKPOINTS = {
  phone: 0,
  tablet: 575,
  md: 768,
  menuBreak: 950,
  headerStaging: 1250,
  xl: 1575
} as {
  [key in string]: number
}

const keys = Object.keys(BREAKPOINTS)
type Breakpoint = typeof keys[number]

keys.forEach((el: string) => {
  media[el] = `(min-width: ${BREAKPOINTS[el]}px)`
})

export {
  media as default,
  BREAKPOINTS,
  type Breakpoint
}
