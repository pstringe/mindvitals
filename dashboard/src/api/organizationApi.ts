import { useApiFetch } from './useApiFetch'

export const useGetOrganizationById = () => {
    const apiFetch = useApiFetch()

    return async (id?: string) => {
        const { data } = await apiFetch(`/clinics/${id}`, {
            method: 'GET',
        })
        return data
    }
}