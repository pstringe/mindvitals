import { useApiFetch } from './useApiFetch'
import { AuthorizedUser } from '../types/user'

export const useSignIn = () => {
  const apiFetch = useApiFetch()

  return async ({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthorizedUser> => {
    const { data } = await apiFetch('/auth/login', {
      method: 'POST',
      data: { username: email, password },
    })
    return {
      loggedIn: data.success,
      ...data.user,
    }
  }
}

export const useLogout = () => {
  const apiFetch = useApiFetch()

  return async () => {
    return await apiFetch('/auth/logout', {
      method: 'GET',
    })
  }
}

export const useForgotPassword = () => {
  const apiFetch = useApiFetch()

  return async (email: string) => {
    return await apiFetch(`/forgot-password/${encodeURIComponent(email)}`, {
      method: 'GET',
    })
  }
}

export const useResetPassword = () => {
  const apiFetch = useApiFetch()

  return async (
    email: string,
    token: string,
    password: string
  ) => {
    return await apiFetch(`forgot-password/reset/${encodeURIComponent(email)}/${encodeURIComponent(token)}`, {
      method: 'POST',
      data: { password },
    })
  }
}