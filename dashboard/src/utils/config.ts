export const localConfig = {
  apiUrl: 'http://localhost:8080',
  patientBaseUrl: 'http://localhost:3000',
}

export const stagingConfig = {
  apiUrl: 'https://midvitalspatientinterfacestaging-dot-mindvitals-384402.uc.r.appspot.com',
  patientBaseUrl: 'https://midvitalspatientinterfacestaging-dot-mindvitals-nonprod.wl.r.appspot.com'
}

export const prodConfig = {
  apiUrl: 'https://midvitalspatientinterfacestaging-dot-mindvitals-384402.uc.r.appspot.com',
  patientBaseUrl: 'https://screening.mindvitals.io'
}

const config = (() => {
  switch (process.env.REACT_APP_ENV?.toLowerCase()) {
    case 'staging':
      return stagingConfig
    case 'production':
      return prodConfig
    default:
      return localConfig
  }
})()

export default config
