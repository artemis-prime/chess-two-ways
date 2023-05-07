import { Text } from 'react-native'

import { styled } from '~/styles/stitches.config'

export default styled(Text, {

  fontFamily: '$dash',
  color: '$dashText',

  variants: {
    size: {
      normal: {
        lineHeight: '$common',
        fontSize: '$common',
      },
      larger: {
        lineHeight: '$common',
        fontSize: '$larger',
      },
      smaller: {
        lineHeight: '$smaller',
        fontSize: '$smaller',
      }
    },
    alert: {
      true: {
        color: '$dashAlert'
      },
      false: {}
    }  
  },
  defaultVariants: {
    size: 'normal',
    alert: 'false'
  }
})