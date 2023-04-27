export const API_URL = ((env: string | undefined) => {
    console.log(`env: ${env}`);
    if (env === 'local' || env === 'development')
        return 'http://localhost:8080';
    if (env === 'staging')
        return 'https://mindvitals-384402.uc.r.appspot.com';
    if (env === 'production')
        return 'https://mindvitals-384402.uc.r.appspot.com';
    return '';
})(process.env.REACT_APP_ENV);
