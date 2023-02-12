import { FC, MouseEventHandler, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetScreenersByPatientId, useRequestScreener } from 'api/screenerApi'
import {
  IPatient,
  IScreenResult,
  IPatientReferral,
} from 'types'
import { PatientDetailHeader } from 'components/patient-detail/PatientDetailHeader'
import { PatientReferrals } from 'components/patient-detail/PatientReferrals'
import { ProfileCard } from 'components/profile/ProfileCard'
import { ReferPatientDialog } from 'components/patient-detail/ReferPatientDialog'
import { ScreenResults } from 'components/screener/ScreenResults'
import { ScreenRequestResultDialog } from 'components/screener/ScreenRequestResultDialog'
import {
  useGetPatientById,
  useGetReferralsByPatientId,
  usePostReferral,
} from 'api/patientsApi'
import {  } from './mocked'
import { SelectQuestionnaireDialog } from 'components/patient-detail/SelectQuestionnaireDialog'
import useAuth from 'hooks/useAuth'
import { QrCodeDialog } from './QrCodeDialog'
import config from 'utils/config'
import { useSendResults } from 'api/screenerApi'
import { handleClickSaveToClipboard } from 'utils'

export const PatientDetail: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const { user } = useAuth()
  const params = useParams()
  const getPatientById = useGetPatientById()
  const getScreenersById = useGetScreenersByPatientId()
  const postReferral = usePostReferral()
  const getReferralsByPatientId = useGetReferralsByPatientId()
  const requestScreenerViaEmail = useRequestScreener(
    'email',
    user?.providerId || '',
  )
  const requestScreenerViaSMS = useRequestScreener(
    'sms',
    user?.providerId || '',
  )
  const requestScreenerViaCopy = useRequestScreener(
    'copy',
    user?.providerId || '',
  )

  const requestScreenerViaQR = useRequestScreener('qr', user?.providerId || '')
  const sendResults = useSendResults();
  const [patient, setPatient] = useState<IPatient>()
  const [patientResults, setPatientResults] = useState<IScreenResult[]>([])
  const [screenResult, setScreenResult] = useState<IScreenResult | null>(null)
  const [isReferPatientDialogOpen, setIsReferPatientDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [patientReferrals, setPatientReferrals] = useState<IPatientReferral[]>([])
  const [method, setMethod] = useState<string>('')
  const [isSelectQuestionnaireDialogOpen, setIsSelectQuestionnaireDialogOpen] = useState(false)
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false)
  const [requestedScreenerId, setRequestedScreenerId] = useState<string>('')
  
  const handleClickEdit: MouseEventHandler = event => {
    event.stopPropagation()
    if (patient) {
     navigate(`/patients/${patient.id}/update-profile`)
    }
  }

  const handleClickCopyLink = async () => {
    await setMethod('copy');
    setIsSelectQuestionnaireDialogOpen(true)
  }

  const handleSubmitScreenRequest = async (request: string) => {
    let data
    if (method === 'email') {
      data = await requestScreenerViaEmail(request, params.patientId || '')
    } else if (method === 'sms') {
      data = await requestScreenerViaSMS(request, params.patientId || '')
    } else if (method === 'qr') {
      data = await requestScreenerViaQR(request, params.patientId || '')
    } else if (method === 'copy') {
      data = await requestScreenerViaCopy(request, params.patientId || '');
      const link = `${config.patientBaseUrl}/${data.screener.id}`
      await navigator.clipboard.writeText(link)
    }
    let id = data?.screener?._id
    setRequestedScreenerId(id)
    setIsSelectQuestionnaireDialogOpen(false)
    if (method === 'qr') {
      setIsQrCodeDialogOpen(true)
      return ;
    } else if (method === 'copy') {
      enqueueSnackbar('Link to screener has been copied to clipboard.', { variant: 'success' })
      return ;
    } 
    enqueueSnackbar(`Screener has been sent to ${patient?.firstName} via ${method}.`, { variant: 'success' })
  }

  const handleClickEmailRequest = async () => {
    await setMethod('email')
    setIsSelectQuestionnaireDialogOpen(true)
  }

  const handleClickTextRequest = async () => {
    await setMethod('sms')
    setIsSelectQuestionnaireDialogOpen(true)
  }

  const handleClickViewQRCode = async () => {
    await setMethod('qr')
    setIsSelectQuestionnaireDialogOpen(true)
  }

  const handleClickShareResultsViaText = (result: IScreenResult) => {
    setScreenResult(result)
    sendResults(result, 'sms');
    enqueueSnackbar(`Results have been sent to ${patient?.firstName} via SMS.`, { variant: 'success' });
  }

  const handleClickShareResultsViaEmail = (result: IScreenResult) => {
    setScreenResult(result)
    sendResults(result, 'email');
    enqueueSnackbar(`Results have been sent to ${patient?.firstName} via Email.`, { variant: 'success' }); 
  }

  const handleClickRefer = () => {
    setIsReferPatientDialogOpen(true)
  }

  const handleCloseReferPatientDialog = () => {
    setIsReferPatientDialogOpen(false)
  }

  const handleRefer = async (referNote: string) => {
    const sendReferralDto = {
      patientId: patient?.id || '',
      providerId: patient?.providerId || '',
      description: referNote,
      method: 'email',
    }

    try {
      let res = await postReferral(sendReferralDto);
    } catch (error){
      enqueueSnackbar('Referral request failed.', {
        variant: 'error',
      })
    }
    setIsReferPatientDialogOpen(false)
    enqueueSnackbar('Referral request has been succesfully submitted.', {
      variant: 'success',
    })
  }

  const handleReviewScreenResult = (result: IScreenResult) => {
    setScreenResult(result)
    setIsResultDialogOpen(true)
  }

  const handleCloseResultDialog = () => {
    setIsResultDialogOpen(false)
  }

  const shapeReferrals = (referrals: any[]): IPatientReferral[] => {
    const referralsList = referrals.map((referral: any) => {
      return {
        id: referral._id,
        patientId: referral.patientId,
        createdAt: referral.referralDate,
        providerId: referral.providerId,
        description: referral.description,
      }
    })
    return referralsList
  }

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await getPatientById(params?.patientId)
      setPatient(patient)
      const screeners = await getScreenersById(patient.id)
      setPatientResults(screeners)
      const referrals = await getReferralsByPatientId(patient.id)
      setPatientReferrals(shapeReferrals(referrals))
    }
    fetchPatient()
  }, [isReferPatientDialogOpen, isSelectQuestionnaireDialogOpen, isQrCodeDialogOpen,])

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 4,
      }}>
          {patient && <PatientDetailHeader
            patient={patient}
            onClickCopyLink={handleClickCopyLink}
            onClickEmailRequest={handleClickEmailRequest}
            onClickTextRequest={handleClickTextRequest}
            onClickViewQRCode={handleClickViewQRCode}
            onClickRefer={handleClickRefer}
          />}
          {patient && <ProfileCard patient={patient} onEdit={handleClickEdit} />}
          <Box sx={{
          }}>
          <ScreenResults
            displayByProvider={false}
            results={patientResults}
            onClickReview={handleReviewScreenResult}
            onClickSaveToClipboard={handleClickSaveToClipboard}
            onClickShareResultsViaText={handleClickShareResultsViaText}
            onClickShareResultsViaEmail={handleClickShareResultsViaEmail}
            defaultPageSize={10}
          />
          </Box>
          <Box sx={{
            height: 'calc(100vh / 3)',
          }}>
            {patient && <PatientReferrals patient={patient} referrals={patientReferrals} />}
          </Box>
        
      </Box>
      <ReferPatientDialog
      isOpen={isReferPatientDialogOpen}
      onClose={handleCloseReferPatientDialog}
      onRefer={handleRefer}
    />

    <SelectQuestionnaireDialog
      isOpen={isSelectQuestionnaireDialogOpen}
      onClose={() => setIsSelectQuestionnaireDialogOpen(false)}
      onSubmit={handleSubmitScreenRequest}
    />

    {screenResult && (
      <ScreenRequestResultDialog
        isOpen={isResultDialogOpen}
        screenResult={screenResult}
        onClose={handleCloseResultDialog}
      />
    )}

    <QrCodeDialog
      isOpen={isQrCodeDialogOpen}
      onClose={() => setIsQrCodeDialogOpen(false)}
      screenerId={requestedScreenerId}
    />
    </>
  )
}
