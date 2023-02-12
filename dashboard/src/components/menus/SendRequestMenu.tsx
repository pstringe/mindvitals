import { FC } from 'react'
import {
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { createStyles, makeStyles, useTheme } from '@mui/styles'

import { IMenuItem } from 'types'
import { ReactComponent as CopyLinkIcon } from 'assets/copy-link.svg'
import { ReactComponent as EmailRequestIcon } from 'assets/email-request.svg'
import { ReactComponent as TextRequestIcon } from 'assets/text-request.svg'
import { ReactComponent as ViewQRCodeIcon } from 'assets/view-qr-code.svg'

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    popOverClass: {
      marginTop: spacing(2),
    },
  }),
)

export interface SendRequestMenuProps {
  anchorEl: HTMLElement | null
  ariaLabelledBy?: string
  id?: string
  isMenuOpen: boolean
  onClickCopyLink: VoidFunction
  onClickEmailRequest: VoidFunction
  onClickTextRequest: VoidFunction
  onClickViewQRCode: VoidFunction
  onClose: VoidFunction
}

export const SendRequestMenu: FC<SendRequestMenuProps> = ({
  anchorEl,
  ariaLabelledBy = 'send-request-button',
  id = 'send-request-menu',
  isMenuOpen,
  onClickCopyLink,
  onClickEmailRequest,
  onClickTextRequest,
  onClickViewQRCode,
  onClose,
}) => {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const menuItems: IMenuItem[] = [
    {
      label: 'Email request',
      Icon: EmailRequestIcon,
      onClick: onClickEmailRequest,
    },
    {
      label: 'Text request',
      Icon: TextRequestIcon,
      onClick: onClickTextRequest,
    },
    {
      label: 'View QR code',
      Icon: ViewQRCodeIcon,
      onClick: onClickViewQRCode,
    },
    {
      label: 'Copy link',
      Icon: CopyLinkIcon,
      onClick: onClickCopyLink,
    },
  ]

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': ariaLabelledBy,
      }}
      PopoverClasses={{
        root: classes.popOverClass,
      }}
    >
      {menuItems.map(menuItem => (
        <MenuItem
          key={menuItem.label}
          onClick={() => {
            menuItem.onClick()
            onClose()
          }}
          sx={{ padding: theme.spacing(1.5, 2) }}
        >
          <ListItemIcon>{<menuItem.Icon />}</ListItemIcon>
          <ListItemText
            sx={{
              '& .MuiTypography-root': {
                color: 'primaryNavy.main',
                fontSize: 16,
                lineHeight: 1.2,
              },
            }}
          >
            {menuItem.label}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  )
}
