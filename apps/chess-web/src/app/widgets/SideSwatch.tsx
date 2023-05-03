import { styled } from '~/styles/stitches.config'

const SideSwatch = styled('span', {

  display: 'inline-block',
  verticalAlign: 'middle',

  height: '$swatchNormalHeight', 
  width: '$swatchNormalWidth',
  borderRadius: '$sm',
  borderWidth: '$thicker',
  borderColor: '#777',
  borderStyle: '$solid',

  variants: {
    side: {
      white: {
        backgroundColor: '$pieceWhite'
      },
      black: {
        backgroundColor: '$pieceBlack'
      },
    }
  }
})

export default SideSwatch
