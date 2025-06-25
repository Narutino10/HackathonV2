export const getTokenPayload = (): any => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = atob(payloadBase64);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Invalid token');
    return null;
  }
};
