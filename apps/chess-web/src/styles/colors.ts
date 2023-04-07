// vscode doesn't seem to see the import as possible,
// even though vite / tsc does
// @ts-ignore 
import fromSASS from './colors.module.scss' 

export default {
  brown: {
    light: fromSASS.brownLight as string,
    dark: fromSASS.brownDark as string,
  },
  gray: [
    'white',
    fromSASS.gray1 as string,
    fromSASS.gray2 as string,
    fromSASS.gray3 as string,
    fromSASS.gray4 as string,
    fromSASS.gray5 as string,
    fromSASS.gray6 as string,
    fromSASS.gray7 as string,
    fromSASS.gray8 as string,
    fromSASS.gray9 as string,
    fromSASS.gray10 as string,
    fromSASS.gray11 as string,
    fromSASS.gray12 as string,
  ],
  alert: [
    'white',
    fromSASS.alert1 as string,
    fromSASS.alert2 as string,
    fromSASS.alert3 as string,
    fromSASS.alert4 as string,
    fromSASS.alert5 as string,
    fromSASS.alert6 as string,
    fromSASS.alert7 as string,
    fromSASS.alert8 as string,
    fromSASS.alert9 as string,
    fromSASS.alert10 as string,
    fromSASS.alert11 as string,
    fromSASS.alert12 as string,
  ],
  ui: {
    piece: {
      white: fromSASS.colorPieceWhite as string,
      black: fromSASS.colorPieceBlack as string,
    },
    dash: {
      border: fromSASS.dashBorder as string,
      text: fromSASS.dashText as string,
    },
    header: {
      bg: fromSASS.colorHeaderBg as string,
    }
  }
}
