  // @ts-ignore
import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as Popover from '@radix-ui/react-popover'
import { useMediaQuery } from 'react-responsive'

import Box from './Box'
import Flex from './Flex'
import useMounted from '~/util/useMounted'
import { styled } from 'stitches.config'

const TooltipArrow = styled(TooltipPrimitive.Arrow, {})
const PopoverArrow = styled(Popover.Arrow, {})

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  backgroundColor,
  flex,
  ...props
}: any) => {
  const isMounted = useMounted()
  const isSmallDevice = useMediaQuery({ maxWidth: 600 }) && isMounted

  const bgColor = backgroundColor ? backgroundColor : '$gray6'

  const Main: React.FC = () => {

    const css = {
      zIndex: 9999,
      boxShadow: '0px 1px 5px rgba(0,0,0,0.2)',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: bgColor, 
      px: '$2',
      py: '$1',
    } 
    return !!flex ? (
      <Flex css={{gap: '$2', ...css}} direction='row' align='center'>
        {content}
      </Flex>
    ) : (
      <Box css={css} >
        {content}
      </Box>
    )
  }

  if (isSmallDevice) {
    return (
      <Popover.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <Popover.Trigger asChild>{children}</Popover.Trigger>
        <Popover.Content
          sideOffset={2}
          side="bottom"
          align="center"
          style={{ zIndex: 100, outline: 'none' }}
          {...props}
        >
          <PopoverArrow css={{fill: bgColor}}/>
          <Main />
        </Popover.Content>
      </Popover.Root>
    )
  }
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={250}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={2}
        side="bottom"
        align="center"
        style={{ zIndex: 100 }}
        {...props}
      >
        <TooltipArrow css={{fill: bgColor}}/>
        <Main />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  )
}

export default Tooltip
