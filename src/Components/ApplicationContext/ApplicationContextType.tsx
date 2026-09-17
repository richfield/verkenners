import type { AxiosResponse } from 'axios';
import type { Leiding, Verkenner } from '../../Types';
import type { User } from '../../Types/User';
import type { Language, TranslationKey } from '../../i18n';


export type ApplicationContextType = {
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  apiFetch: <T>(url: string, method?: 'GET' | 'POST' | 'DELETE' | 'PUT', body?: unknown, headers?: object) => Promise<AxiosResponse<T, unknown>>;
  leiding: Leiding[];
  verkenners: Verkenner[];
  user: User|undefined;
  spreadsheetId: string | null;
  selectSpreadsheet: (id: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: TranslationKey) => string;
};
