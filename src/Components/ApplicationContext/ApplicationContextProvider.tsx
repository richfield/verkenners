// src/context/ApplicationContext.tsx
import React, { useState, type ReactNode, useEffect, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { ApplicationContext } from './ApplicationContext';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Leiding, Verkenner } from '../../Types';
import axios, { type AxiosResponse } from 'axios';
import { isTokenValid } from '../../services/authService';
import dayjs from 'dayjs';
import 'dayjs/locale/nl';
import type { User } from '../../Types/User';
export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  dayjs.locale("nl");
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const [leiding, setLeiding] = useState<Leiding[]>([]);
  const [verkenners, setVerkenners] = useState<Verkenner[]>([]);
  const [ user, setUser ] = useState<User>();
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      const config = {
        method: 'POST',
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(codeResponse)
      };

      const tokenResponse = await axios(config);

      const tokenData = tokenResponse.data;
      setAccessToken(tokenData.access_token);
      localStorage.setItem('accessToken', tokenData.access_token);
      localStorage.setItem('refreshToken', tokenData.refresh_token); // Sla de refresh token op
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.error(err);
      console.warn('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    window.location.reload();
  };

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  }, [accessToken]);

  const apiFetch = useCallback(async <T,>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: unknown, headers?: object): Promise<AxiosResponse<T, unknown>> => {
    if (!accessToken) {
      return {
        status: 301
      } as AxiosResponse<T>;
    }

    if (!await isTokenValid(accessToken)) {
      return {
        status: 301
      } as AxiosResponse<T>;
    }
    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...headers
      },
      data: body
    };

    return await axios(config);

  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch<User>('https://www.googleapis.com/oauth2/v3/userinfo');
      console.log({result});
      if (result.status === 200) {
        setUser(result.data);
      }

    };
    fetchData();
  }, [apiFetch]);


  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch<Leiding[]>("/api/meta/leiding");
      if (result.status === 200) {
        const data = result.data.sort((a, b) => {
          return a.Naam.localeCompare(b.Naam);
        });
        setLeiding(data);
      }
    };
    fetchData();
  }, [apiFetch]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFetch<Verkenner[]>("/api/meta/verkenners");
      if (result.status === 200) {
        const data = result.data.sort((a, b) => {
          return a.Naam.localeCompare(b.Naam);
        });
        setVerkenners(data);
      }
    };
    fetchData();
  }, [apiFetch]);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken && accessToken) {
      const refreshInterval = 50 * 60 * 1000; // 50 minuten
      const refreshTokenInterval = setInterval(async () => {
        try {
          const newAccessTokenResponse = await apiFetch<string>("/api/auth/refresh-token", "POST", { refreshToken: refreshToken });
          setAccessToken(newAccessTokenResponse.data);
          localStorage.setItem('accessToken', newAccessTokenResponse.data);
        } catch (error) {
          console.error('Fout bij vernieuwen van token:', error);
          clearInterval(refreshTokenInterval);
          logout();
        }
      }, refreshInterval);
      return () => clearInterval(refreshTokenInterval);
    }
  }, [accessToken, apiFetch]);

  useEffect(() => {
    const validateAndRefreshToken = async () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedRefreshToken && storedAccessToken) {
        const valid = await isTokenValid(storedAccessToken);
        if (!valid) {
          try {
            const config = {
              method: "POST",
              url: "/api/auth/refresh-token",
              headers: {
                'Content-Type': 'application/json',
              },
              data: { refreshToken: storedRefreshToken }
            };

            const newAccessTokenResponse = await axios(config);
            setAccessToken(newAccessTokenResponse.data.accessToken);
            localStorage.setItem('accessToken', newAccessTokenResponse.data.accessToken);
          } catch (error) {
            console.error('Fout bij vernieuwen van token:', error);
            logout();
          }
        } else {
          setAccessToken(storedAccessToken);
        }
      }
    };

    validateAndRefreshToken();
  }, [apiFetch]);

  return (
    <ApplicationContext.Provider value={{ accessToken, login, logout, isAuthenticated, apiFetch, leiding, verkenners, user }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='nl'>
        {children}
      </LocalizationProvider>
    </ApplicationContext.Provider>
  );
};

