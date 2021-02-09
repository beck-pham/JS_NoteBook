import { ActionType } from '../action-types/';
import { Action } from '../actions';
import { Cell } from '../cell';
import produce from 'immer';


interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell
  }
}

const initialState: CellState = {
  loading: false,
  error: null, 
  order: [],
  data: {}
};

const reducer = produce((state: CellState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id); // find the id
      const targetIndex = direction === 'up' ? index - 1 : index + 1 ;
      
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      // swapping logic
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;

    case ActionType.DELETE_CELL:
      delete state.data[action.payload]
      state.order = state.order.filter((id) => id !== action.payload) // find the id that we want to delete and remove it
      return state;

    case ActionType.INSERT_CELL_BEFORE:
      const cell: Cell = {
        id: randomId(),
        type: action.payload.type,
        content: '',
      };
      // assign the new cell record to the data object
      state.data[cell.id] = cell;
      // implemented inserting new cell
      const foundIndex = state.order.findIndex(id => id === action.payload.id);
      if (foundIndex) { // Edge case: push new cell to the end of order array
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      };
      return state;
    default:
      return state;
  }
});

// create a random string ID
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
}
export default reducer;