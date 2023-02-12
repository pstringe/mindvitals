import { compact, get } from 'lodash'
import { IBasicUser, UserTitles } from '../types/user'

export const formatFullName = (user: IBasicUser, reverse = false): string => {
  const names = [user?.firstName, user?.lastName]
  const separator = reverse ? ', ' : ' '

  if (reverse) {
    names.reverse()
  }

  return compact(names).join(separator) || '-'
}

export const getUserTitle = (userType: string): string =>
  get(UserTitles, userType)

export const getCapitalizedInitialLetters = (values: string[]) =>
  values.map(value => {
    if (value.length) return value[0].toUpperCase()
    return ''
  })

export const toTitleCase = (word: string) =>  {
  return word.replace(/\b\w+/g, function (s: string) {
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
  })
}

export const formatSource = (source: string) => {
  if (source === 'sms') {
    return 'SMS'
  } else if (source === 'email') {
    return 'Email'
  } else if (source === 'qr') {
    return 'QR code'
  } else if (source === 'copy') {
    return 'Copy Link'
  }
  return 'Unknown'
}
