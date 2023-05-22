import { css } from './stitches.config'

const typography = {
  menu: {
    item: css({
      fontFamily: '$menu',
      lineHeight: '$menu',
      fontWeight: '$semibold',
      fontSize: '$menu',
      color: '$dashText',
      textTransform: 'lowercase'
    }),
    title: css({
      fontFamily: '$menu',
      lineHeight: '$menu',
      fontWeight: '$semibold',
      fontSize: '$menu',
      color: '$dashText'
    })
  },
  dash: {
    normal: css({
      fontFamily: '$dash',
      lineHeight: '$common',
      fontSize: '$common',
      color: '$dashText'
    }),
    smaller: css({
      fontFamily: '$dash',
      lineHeight: '$smaller',
      fontSize: '$smaller',
      color: '$dashText'
    }),
    alertSmaller: css({
      fontFamily: '$dash',
      lineHeight: '$smaller',
      fontSize: '$smaller',
      color: '$dashAlert'
    })
  }
}

const common = {
  typ: typography
}

export default common