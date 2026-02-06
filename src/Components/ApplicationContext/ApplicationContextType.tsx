import type { AxiosResponse } from 'axios';
import type { Leiding, Verkenner } from '../../Types';
import type { User } from '../../Types/User';


export type ApplicationContextType = {
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  apiFetch: <T>(url: string, method?: 'GET' | 'POST' | 'DELETE' | 'PUT', body?: unknown, headers?: object) => Promise<AxiosResponse<T, unknown>>;
  leiding: Leiding[];
  verkenners: Verkenner[];
  user: User|undefined;
};
