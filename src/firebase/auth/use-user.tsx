
'use client';

import { useEffect, useState } from 'react';

// Определяем тип для данных пользователя
interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  gender?: string;
  birthDate?: string;
  location?: string;
  createdAt: string;
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData: UserProfile = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // Токен недействителен или истек
          localStorage.removeItem('authToken');
          setUser(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch user data');
        }
      } catch (e) {
        setError('An unexpected error occurred.');
        console.error('Fetch user error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Слушатель для обновления данных при изменении токена (например, при логине/логофе)
    const handleTokenChange = () => {
        fetchUser();
    };
    
    window.addEventListener('tokenChanged', handleTokenChange);

    return () => {
        window.removeEventListener('tokenChanged', handleTokenChange);
    };

  }, []);

  return { user, loading, error };
}
