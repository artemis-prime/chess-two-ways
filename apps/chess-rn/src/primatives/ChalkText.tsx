import { Text } from 'react-native'

import { styled } from '~/style'

const ChalkText = styled(Text, {

  fontFamily: '$chalkboardFont',
  color: '$chalkboardTextColor',

  variants: {
    size: {
      normal: {
        lineHeight: '$lineHeightNormal',
        fontSize: '$fontSizeNormal',
      },
      larger: {
        lineHeight: '$lineHeightNormal',
        fontSize: '$fontSizeLarger',
      },
      smaller: {
        lineHeight: '$lineHeightSmaller',
        fontSize: '$fontSizeSmaller',
      }
    },
    alert: {
      true: {
        color: '$alert8'
      },
      false: {}
    }  
  },
  defaultVariants: {
    size: 'normal',
    alert: 'false'
  }
})

export default ChalkText
