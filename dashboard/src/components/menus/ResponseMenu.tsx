import { FC, useEffect } from 'react'
import {
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { createStyles, makeStyles, useTheme } from '@mui/styles'

import { IMenuItem } from 'types'
import { ReactComponent as DownloadIcon } from 'assets/download.svg'
import { ReactComponent as EmailRequestIcon } from 'assets/email-request.svg'
import { ReactComponent as TextRequestIcon } from 'assets/text-request.svg'
import { ReactComponent as MemoWriteIcon } from 'assets/memo-write.svg'

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    popOverClass: {
      marginTop: spacing(2),
    },
  }),
)

export interface ResponseMenuProps {
  anchorEl: HTMLElement | null
  anchorPosition: { top: number, left: number } | undefined
  ariaLabelledBy?: string
  id?: string
  isMenuOpen: boolean
  /*onClickDownloadPDF: VoidFunction*/
  onClickSaveToClipboard: VoidFunction
  onClickShareResultsViaText: VoidFunction
  onClickShareResultsViaEmail: VoidFunction
  onClose: VoidFunction
}

export const ResponseMenu: FC<ResponseMenuProps> = ({
  anchorEl,
  ariaLabelledBy = 'response-button',
  anchorPosition,
  id = 'response-menu',
  isMenuOpen,
  /*onClickDownloadPDF,*/
  onClickSaveToClipboard,
  onClickShareResultsViaText,
  onClickShareResultsViaEmail,
  onClose,
}) => {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const menuItems: IMenuItem[] = [
    {
      label: 'Save to clipboard',
      Icon: MemoWriteIcon,
      onClick: onClickSaveToClipboard,
    },
    {
      label: 'Share results via text',
      Icon: TextRequestIcon,
      onClick: onClickShareResultsViaText,
    },
    {
      label: 'Share results via email',
      Icon: EmailRequestIcon,
      onClick: onClickShareResultsViaEmail,
    },
    /*
    {
      label: 'Download PDF report',
      Icon: DownloadIcon,
      onClick: onClickDownloadPDF,
    },
    */
  ]
  
  return (
    <Menu
      id={id}
      anchorReference='anchorPosition'
      anchorPosition={anchorPosition}
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
