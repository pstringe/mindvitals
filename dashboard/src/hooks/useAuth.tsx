import { useContext, useEffect, useState, useMemo, createContext } from 'react'
import compact from 'lodash/compact'

import { useLogout, useSignIn } from '../api/authApi'
import { IUser } from '../types'
import { clear } from 'console'

type AuthContextType = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: IUser
  fullName?: string
  logIn: (email: string, password: string) => Promise<any>
  logOut: () => Promise<any>
  checkExpired: () => Promise<any>
}

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: true,
  logIn: () => Promise.resolve(null),
  logOut: () => Promise.resolve(null),
  checkExpired: () => Promise.resolve(null),
})

export function AuthProvider(props: any) {
  const signIn = useSignIn()
  const logout = useLogout()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<IUser | undefined>()
  const [expired, setExpired] = useState(false);

  const isAuthenticated = useMemo(() => !expired && Boolean(user), [user, expired])

  const fullName = useMemo(
    () => compact([user?.firstName, user?.lastName]).join(' '),
    [user],
  )

  const logIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const user = await signIn({ email, password })
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user)
      setExpired(false)
      return user
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }

  const logOut = async () => {
    let response
    try {
      setIsLoading(true)
      response = await logout()
      localStorage.removeItem('user');
      setUser(undefined)
    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }

  const checkExpired = () => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (user) {
      const now = new Date();
      const expires = new Date(user.expires);
      if (now > expires) {
        setExpired(true);
        localStorage.removeItem('user');
        setUser(undefined);
      } else {
        setExpired(false);
      }
    }
  }

  useEffect(() => {
    const localUser = localStorage.getItem('user')
    if (localUser) {
      setUser(JSON.parse(localUser ?? '{}'))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        fullName,
        logIn,
        logOut,
        checkExpired,
      }}
      {...props}
    />
  )
}

const useAuth = () => useContext(AuthContext)

export default useAuth
