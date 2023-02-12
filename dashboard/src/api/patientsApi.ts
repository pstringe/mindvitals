import { GridFilterModel } from '@mui/x-data-grid'
import { IPatientForm } from 'types'
import { useApiFetch } from './useApiFetch'


const serializeFilterModel = (filterModel: GridFilterModel) => {
  if (filterModel?.items?.length === 0) {
    return null
  }
  const items = filterModel.items.map((item, idx) => {
    const value = item.value.toString()
    const field = item.columnField.toString()
    const operator = item.operatorValue?.toString()
    const query = `${field}=${encodeURIComponent(operator || '')}~${encodeURIComponent(value || '')}` + (idx < filterModel.items.length - 1 ? '&' : '')
    return query
  })
  return `&filters=true&` + items.join('')
}

export const useGetPatients = () => {
  const apiFetch = useApiFetch()

  return async (skip: number, limit: number, filterModel?: GridFilterModel) => {
    const filterQuery = filterModel ? serializeFilterModel(filterModel) : null;
    const { data } = await apiFetch(`/patients/?skip=${skip * limit}&limit=${limit}` + 
    (filterQuery ? filterQuery 
    : ''), {
      method: 'GET',
    })
    return data
  }
}

export const useGetPatientById = () => {
  const apiFetch = useApiFetch()

  return async (id?: string) => {
    const { data } = await apiFetch(`/patients/${id}`, {
      method: 'GET',
    })
    return data
  }
}

export const useUpdatePatient = () => {
  const apiFetch = useApiFetch()

  return async (id: string, updatePatientDto: IPatientForm) => {
    const { data } = await apiFetch(`/patients/${id}`, {
      method: 'PATCH',
      data: updatePatientDto,
    })
    return data
  }
}

export const usePostReferral = () => {
  const apiFetch = useApiFetch()

  return async (createReferralDto: {
    patientId: string
    providerId: string
    method: string
    batchId?: string
    description: string
  }) => {
    const { data } = await apiFetch(`referrals`, {
      method: 'POST',
      data: {
        method: createReferralDto.method,
        patientId: createReferralDto.patientId,
        providerId: createReferralDto.providerId,
        description: createReferralDto.description,
      },
    })
    return data
  }
}

export const useGetReferralsByPatientId = () => {
  const apiFetch = useApiFetch()

  return async (patientId: string) => {
    const { data } = await apiFetch(`/referrals/patient/${patientId}`, {
      method: 'GET',
    })
    return data
  }
}

export const useCreatePatient = () => {
  const apiFetch = useApiFetch()

  return async (createPatientDto: {
    firstName: string
    lastName: string
    phoneNo: string
    email: string
    dob: Date
    providerId: string | undefined
  }) => {
    console.log('createpatient',createPatientDto);
    const { data } = await apiFetch(`/patients`, {
      method: 'POST',
      data: createPatientDto,
    })
    return data
  }
}

export const useSearchPatientsByName = () => {
  const apiFetch = useApiFetch()
  return async (name: string, skip: number, limit: number, filterModel?: GridFilterModel) => {
    const filterQuery = filterModel ? serializeFilterModel(filterModel) : null;
    const { data } = await apiFetch(`/patients/search/${name}?skip=${skip * limit}&limit=${limit}` + 
    (filterQuery ? filterQuery 
    : ''), {
      method: 'GET',
    })
    return data
  }
}