import { FC, MouseEventHandler, useState } from 'react'
import { Box, Button, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'

import { IPatient } from 'types'
import { RouteBreadcrumbs } from 'components/common'
import {
  SendRequestMenu,
  SendRequestMenuProps,
} from 'components/menus/SendRequestMenu'
import { ReactComponent as ReferPatientIcon } from 'assets/refer-patient.svg'

interface PatientDetailHeaderProps
  extends Pick<
    SendRequestMenuProps,
    | 'onClickCopyLink'
    | 'onClickEmailRequest'
    | 'onClickTextRequest'
    | 'onClickViewQRCode'
  > {
  patient: IPatient
  onClickRefer: () => void
}

export const PatientDetailHeader: FC<PatientDetailHeaderProps> = ({
  patient,
  onClickCopyLink,
  onClickEmailRequest,
  onClickTextRequest,
  onClickViewQRCode,
  onClickRefer,
}) => {
  const [sendRequestAnchorEl, setSendRequestAnchorEl] =
    useState<HTMLElement | null>(null)

  const isRequestMenuOpen = Boolean(sendRequestAnchorEl)

  const buttonStyles: SxProps<Theme> = {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
    borderRadius: 2,
    textTransform: 'none',
  }

  const handleClickSendRequest: MouseEventHandler<
    HTMLButtonElement
  > = event => {
    setSendRequestAnchorEl(event.currentTarget)
  }

  const handleCloseSendRequestMenu = () => {
    setSendRequestAnchorEl(null)
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <RouteBreadcrumbs path="PatientDetail" patient={patient} />

      <Box display="flex" gap={3}>
        <Button
          id="send-request-button"
          aria-controls={isRequestMenuOpen ? 'send-request-menu' : undefined}
          aria-haspopup={true}
          aria-expanded={isRequestMenuOpen ? 'true' : undefined}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={buttonStyles}
          onClick={handleClickSendRequest}
        >
          Send Request
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickRefer}
          startIcon={<ReferPatientIcon />}
          sx={buttonStyles}
        >
          Refer Patient
        </Button>
      </Box>

      <SendRequestMenu
        anchorEl={sendRequestAnchorEl}
        isMenuOpen={isRequestMenuOpen}
        onClickCopyLink={onClickCopyLink}
        onClickEmailRequest={onClickEmailRequest}
        onClickTextRequest={onClickTextRequest}
        onClickViewQRCode={onClickViewQRCode}
        onClose={handleCloseSendRequestMenu}
      />
    </Box>
  )
}
