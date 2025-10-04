const getGoogleOAuthUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    respone_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
  };
  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs.toString()}`;
};

export default getGoogleOAuthUrl;
