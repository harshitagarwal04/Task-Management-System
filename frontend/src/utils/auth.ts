import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null; // Prevent SSR issues

  const token = localStorage.getItem('token');
  console.log('Raw Token from localStorage:', token);
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token); // Decode the token
    console.log('Decoded JWT:', decoded);

    return decoded?.userId ?? null; // Return userId or null if not present
  } catch (e) {
    console.error('JWT decode error:', e);
    return null;
  }
}