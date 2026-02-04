import { createContext } from 'react';
import type { ApplicationContextType } from './ApplicationContextType';


export const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);
