/** useSelector hook and created a type selector to help react-redux understand the type of data inside our store */
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
