import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import PeopleIcon from '@mui/icons-material/People'
import ArticleIcon from '@mui/icons-material/Article'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

import { Theme } from 'theme'
import useAuth from 'hooks/useAuth'
import { UserAvatar } from 'components/common/UserAvatar'
import { ReactComponent as PrairieIcon } from 'assets/mindvitals-icon.svg'

import { SidebarMenuList } from './SidebarMenuList'
import { NavItem } from './NavItem'

const drawerWidth = 240

export const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logOut } = useAuth()
  const theme = useTheme() as Theme

  const handleLogOut = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box p={3}>
        <PrairieIcon aria-label="Prairie" height={theme.spacing(3)} />
      </Box>

      <Box px={1}>
        <UserAvatar user={user!} />
      </Box>

      <Stack spacing={3} sx={{ mt: 2 }}>
        <SidebarMenuList title="Menu">
          <NavItem to="patients" icon={<PeopleIcon />}>
            Patients
          </NavItem>

          <NavItem to={`results/${user?.providerId}`} icon={<ArticleIcon />}>
            Results
          </NavItem>
        </SidebarMenuList>

        <SidebarMenuList title="Account">
          <NavItem
            icon={<PowerSettingsNewIcon />}
            selected
            noBorder
            type='none'
            onClick={handleLogOut}
          >
            Sign Off
          </NavItem>
        </SidebarMenuList>
      </Stack>
    </Drawer>
  )
}
