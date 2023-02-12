import { useMemo, FC, ReactNode } from 'react'
import ListItemButton, {
  ListItemButtonProps,
} from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useTheme, alpha } from '@mui/material/styles'
import { SxProps } from '@mui/system'
import { useLocation, matchPath, resolvePath, Link } from 'react-router-dom'
import get from 'lodash/get'

import { Theme } from 'theme'

type NavItemType = 'default' | 'error' | 'none'

type INavItemProps = ListItemButtonProps & {
  to?: string
  icon?: ReactNode
  selected?: boolean
  type?: NavItemType
  noBorder?: boolean
}

const NavItemConfig = {
  default: {
    color: 'primaryMint.main',
    bgcolor: 'secondaryGreen2.main',
  },
  error: {
    color: 'accentRed.main',
    bgcolor: 'backgroundRed.main',
  },
  none: {
    color: 'accentRed.main',
    bgcolor: 'backgroundWhite.main',
  }
}

export const NavItem: FC<INavItemProps> = ({
  to,
  icon,
  selected: givenSelected,
  children,
  type = 'default',
  noBorder = false,
  ...props
}) => {
  const theme = useTheme() as Theme
  const location = useLocation()
  const match = useMemo(() => {
    if (!to) {
      return null
    }

    const resolvedPath = resolvePath(to)
    return matchPath(location.pathname, resolvedPath.pathname)
  }, [to, location])

  const selected = useMemo(
    () => givenSelected || !!match,
    [givenSelected, match],
  )
  const navLinkProps = useMemo(
    () =>
      to
        ? {
            to,
            component: Link,
          }
        : null,
    [to],
  )
  const config = useMemo(() => get(NavItemConfig, type), [type])
  const style = useMemo<SxProps>(() => {
    if (!selected) {
      return {}
    }

    const selectedStyle = {
      bgcolor: alpha(get(theme.palette, config.bgcolor), 0.3),
      color: config.color,
      ...(!noBorder && {
        borderRight: '2px solid',
        borderColor: config.color,
      }),
    }

    return selectedStyle as SxProps
  }, [selected, config, noBorder, theme])

  return (
    <ListItemButton {...props} {...navLinkProps} sx={style}>
      {icon && (
        <ListItemIcon sx={selected ? { color: config.color } : null}>
          {icon}
        </ListItemIcon>
      )}

      <ListItemText>
        <Typography variant="subtitle2">{children}</Typography>
      </ListItemText>
    </ListItemButton>
  )
}
