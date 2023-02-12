import { FC, useEffect, useState } from 'react'
import { Avatar, Box } from '@mui/material'
import { useGetOrganizationById } from '../../api/organizationApi'
import { IUser } from 'types'
import {
  formatFullName,
  getUserTitle,
  getCapitalizedInitialLetters,
} from 'utils'

interface UserAvatarProps {
  user: IUser
}

export const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
  const fullName = formatFullName(user)
  const userTitle = getUserTitle(user?.userType)
  const getOrganizationById = useGetOrganizationById();
  const userNameInitials = getCapitalizedInitialLetters([
    user.firstName,
    user.lastName,
  ])
  const [organization, setOrganization] = useState<any>();

  useEffect(() => {
    (async () => {
      const organization = await getOrganizationById(user.organization);
      setOrganization(organization);
    })();
  }, [user]);

  return (
    <Box
      borderRadius={2}
      display="flex"
      alignItems="center"
      p={2}
      bgcolor="backgroundGray.main"
    >
      {user.profilePic ? (
        <Avatar
          src={user?.profilePic}
          alt={fullName}
          sx={{ width: 40, height: 40 }}
        />
      ) : (
        <Box
          bgcolor="yellow.main"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ width: 40, height: 40, borderRadius: 20 }}
        >
          {userNameInitials}
        </Box>
      )}

      <Box
        display="flex"
        flexDirection="column"
        color="primaryNavy.main"
        flexGrow={1}
        ml={2}
      >
        <Box fontWeight="fontWeightMedium">{fullName}</Box>
        <Box fontSize="body1.fontSize">{organization?.name}</Box>
      </Box>
    </Box>
  )
}
