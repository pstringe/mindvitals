export enum UserTypes {
  STAFF = 'staff',
  CARE_PARTNER = 'cc',
  PSYCHIATRIST = 'psych',
}

export const UserTitles = {
  [UserTypes.STAFF]: 'Staff',
  [UserTypes.CARE_PARTNER]: 'Care Partner',
  [UserTypes.PSYCHIATRIST]: 'Psychiatrist',
}

export interface IBasicUser {
  id?: string
  firstName: string
  lastName: string
  email?: string
  providerId?: string
  organization?: string
}

export interface IUser extends IBasicUser {
  username?: string
  userType: UserTypes
  profilePic?: string
}

export interface IPatient extends IBasicUser {
  phoneNo?: string
  dob?: Date
  dateOfMostRecentScreener?: string
  highestSeverityOfMostRecentScreener?: string
}

export interface IPatientForm {
  firstName: string
  lastName: string
  dob: string
  email: string
  phoneNo: string
  providerId?: string
}

export interface AuthorizedUser extends IUser {
  loggedIn: boolean
  organization: string
}
