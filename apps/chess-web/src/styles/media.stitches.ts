const media = {
  motion: '(prefers-reduced-motion)',
  hover: '(any-hover: hover)',
} as {
  [key in string]: string
}

const BREAKPOINTS = {
  zero: 0,
  sm: 600,
  menuBreak: 900,
  desktopConstrained: 1200
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
