import * as Menubar from '@radix-ui/react-menubar'
import type { PropsWithChildren } from 'react'

import { styled, common } from '~/styles/stitches.config'

const MenubarRoot = styled(Menubar.Root, {
  display: 'flex',
  direction: 'row',
  height: '$header',
})

const MenubarMenu = styled(Menubar.Menu, {})

const MenubarTrigger = styled(Menubar.Trigger, {
  all: 'unset',
  ...common.menuBarTrigger,

  outline: 'none',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '&[data-state="open"]': {
    backgroundColor: '$menuHover',
    '&:hover': {
      backgroundColor: '$menuSelectedHover',
    }
  },
  '&:hover': {
    backgroundColor: '$menuHover',
  }
})

const MenubarContent = styled(Menubar.Content, {
  minWidth: 220,
  backgroundColor: '$menu',
  borderRadius: '$popupMenu',
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
})

const MenubarPopup: React.FC<PropsWithChildren> = ({ 
  children 
}) => (
  <Menubar.Portal>
    <MenubarContent align="start" sideOffset={5} alignOffset={-1}>
      {children}
    </MenubarContent>
  </Menubar.Portal>
)


const RightSlot = styled('div', {

  fontSize: common.menuBarPopupItem.fontSize,
  fontFamily: common.menuBarPopupItem.fontFamily,
  fontWeight: common.menuBarPopupItem.fontWeight,
  marginLeft: 'auto',
  paddingLeft: 20,
  color: '$menuRightSymbol',
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: '$menuDisabled' },
})

const MenubarSeparator = styled(Menubar.Separator, {
  height: '0.5px',
  backgroundColor: '$menuDisabled',
  mx: '6px',
  my: '2px',
})

export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  RightSlot,
  MenubarSeparator,
}