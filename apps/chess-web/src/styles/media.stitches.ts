const BREAKPOINTS = {
  Phone: 0,
  Tablet: 525,
  MD: 768,
  MenuBreak: 950,
  VirtualStaging: 1280,
  XL: 1575,
} as {
  [key in string]: number
}

const media = {
  phonePortrait: `(max-width: ${BREAKPOINTS.Tablet - 1}px) and (orientation: portrait)`,
  phoneLandscape: `(max-height: ${BREAKPOINTS.Tablet - 1}px) and (orientation: landscape)`,
  tabletPortrait: `(min-width: ${BREAKPOINTS.Tablet}px) and (orientation: portrait) and (pointer: coarse) and (hover: none)`,
  tabletLandscape: `(min-height: ${BREAKPOINTS.Tablet}px) and (orientation: landscape) and (pointer: coarse) and (hover: none)`,
  allMobilePortrait: '(orientation: portrait) and (pointer: coarse) and (hover: none)',
  allMobile: '(pointer: coarse) and (hover: none)',

  desktopSmall: `(max-width: ${BREAKPOINTS.MenuBreak - 1}px) and (orientation: landscape) and (pointer: fine)`, 
  desktopPortrait: `(orientation: portrait) and (pointer: fine)`, 
  menuBreak: `(min-width: ${BREAKPOINTS.MenuBreak}px) and (pointer: fine)`, 
  virtualStaging: `(min-width: ${BREAKPOINTS.VirtualStaging}px) and (pointer: fine)`, 
  xl: `(min-width: ${BREAKPOINTS.XL}px) and (pointer: fine)` 
} 

type MediaQueries = keyof typeof media

export {
  media as default,
  type MediaQueries,
  BREAKPOINTS,
}
