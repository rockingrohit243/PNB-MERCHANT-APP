import { jwtDecode } from 'jwt-decode';

export const getMobileFromToken = () => {
  const token = sessionStorage.getItem('access_token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.user_name; 
  } catch (error) {
    console.error("Token decode failed", error);
    return null;
  }
};