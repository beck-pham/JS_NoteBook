import { combineReducers } from 'redux';
import  cellReducer from '../reducers/cellReducer';

const reducers = combineReducers({
  cells: cellReducer
});

export default reducers;
// defined types of react redux to describe the overall structure of the state object
// inside the redux store
export type RootState = ReturnType<typeof reducers>;