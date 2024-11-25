import { createContext } from 'react';

export const HypeFormContext = createContext<{ form?: any, record?: any }>(
    {});
