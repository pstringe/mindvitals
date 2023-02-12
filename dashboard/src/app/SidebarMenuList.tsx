import React from 'react'
import List, { ListProps } from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'

interface ISidebarMenuListProps extends ListProps {
  title: string
}

export const SidebarMenuList: React.FC<ISidebarMenuListProps> = ({
  title,
  ...props
}) => (
  <List
    subheader={
      <ListSubheader
        sx={{
          mx: 3,
          p: 0,
          fontSize: 'caption.fontSize',
          textTransform: 'uppercase',
          color: 'primaryNavy.main',
        }}
      >
        {title}
      </ListSubheader>
    }
    {...props}
  />
)
