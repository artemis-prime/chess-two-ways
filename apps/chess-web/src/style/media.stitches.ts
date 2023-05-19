const BREAKPOINTS = {
  phone: 0,
  tablet: 525,
  md: 768,
  menuBreak: 950,
  virtualStaging: 1280, // (x768)
  xl: 1625,
  xxl: 1750
} as {
  [key in string]: number
}

const media = {
  phonePortrait: `(max-width: ${BREAKPOINTS.tablet - 1}px) and (orientation: portrait)`,
  phoneLandscape: `(max-height: ${BREAKPOINTS.tablet - 1}px) and (orientation: landscape)`,
  tabletPortrait: `(min-width: ${BREAKPOINTS.tablet}px) and (orientation: portrait) and (pointer: coarse) and (hover: none)`,
  tabletLandscape: `(min-height: ${BREAKPOINTS.tablet}px) and (orientation: landscape) and (pointer: coarse) and (hover: none)`,
  allMobilePortrait: '(orientation: portrait) and (pointer: coarse) and (hover: none)',
  allMobile: '(pointer: coarse) and (hover: none)',

  desktopTiny: `(min-width: ${BREAKPOINTS.tablet}px) and (orientation: landscape) and (pointer: fine)`, 
  desktopSmall: `(min-width: ${BREAKPOINTS.md}px) and (orientation: landscape) and (pointer: fine)`, 
  desktopPortrait: `(orientation: portrait) and (pointer: fine)`, 
  menuBreak: `(min-width: ${BREAKPOINTS.menuBreak}px) and (pointer: fine)`, 
  virtualStaging: `(min-width: ${BREAKPOINTS.virtualStaging}px) and (pointer: fine)`, 
  xl: `(min-width: ${BREAKPOINTS.xl}px) and (pointer: fine)`, 
  xxl: `(min-width: ${BREAKPOINTS.xxl}px) and (pointer: fine)` 
} 

type MediaQuery = keyof typeof media

export {
  media as default,
  type MediaQuery,
  BREAKPOINTS,
}
