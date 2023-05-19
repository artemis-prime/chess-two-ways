import React from 'react'

import { styled, type CSS } from '~/styles/stitches.config'
import { type MediaQueries } from '~/styles/media.stitches'

const Span = styled('span', {
  justifyContent: 'center',
  alignItems: 'center',
}) 

const ResponsiveText: React.FC<{
  main: string
  alt: string
  altTriggers: MediaQueries[],
  mainTriggers: MediaQueries[],
  css? : CSS
}> = ({
  main,
  alt,
  altTriggers,
  mainTriggers,
  css
}) => {

  const mainCss: any = {
    display: 'inline-flex'
  }
  const altCss: any = {
    display: 'none'
  }
  
  altTriggers.forEach((query) => {
    mainCss[`@${query}`] = {
      display: 'none'
    },  
    altCss[`@${query}`] = {
      display: 'inline-flex',
      fontSize: '1.5rem',
    }  
  })

  mainTriggers.forEach((query) => {
    mainCss[`@${query}`] = {
      display: 'inline-flex',
    },  
    altCss[`@${query}`] = {
      display: 'none'
    }  
  })

  return (<>
    <Span css={{...css, ...mainCss}}>{main}</Span>
    <Span css={{...css, ...altCss}}>{alt}</Span>
  </>)
}

export default ResponsiveText
