import { css } from './stitches.config'

const typography = {
  menu: {
    item: css({
      fontFamily: '$menuFont',
      lineHeight: '$lineHeightMenu',
      fontWeight: '$semibold',
      fontSize: '$fontSizeMenuItem',
      color: '$menuTextColor',
      textTransform: 'lowercase'
    }),
    sectionTitle: css({
      fontFamily: '$menuFont',
      lineHeight: '$lineHeightMenu',
      fontWeight: '$semibold',
      fontSize: '$fontSizeMenuItem',
      color: '$menuTextColor'
    })
  },
  chalkboard: {
    normal: css({
      fontFamily: '$chalkboardFont',
      lineHeight: '$lineHeightNormal',
      fontSize: '$fontSizeNormal',
      color: '$chalkboardTextColor'
    }),
    smaller: css({
      fontFamily: '$chalkboardFont',
      lineHeight: '$lineHeightSmaller',
      fontSize: '$fontSizeSmaller',
      color: '$chalkboardTextColor'
    }),
    alertSmaller: css({
      fontFamily: '$chalkboardFont',
      lineHeight: '$lineHeightSmaller',
      fontSize: '$fontSizeSmaller',
      color: '$alert8'
    })
  }
}

export default typography