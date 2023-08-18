import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import {AnyAbility} from "@casl/ability";

// @ts-ignore
export const AbilityContext = createContext<AnyAbility>();
export const Can = createContextualCan(AbilityContext.Consumer);