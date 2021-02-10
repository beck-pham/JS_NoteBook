import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  // call this with state argument. Now state displays correctly the type of data store inside the store.
  // Get a list of cells as the ouput from use typed selector
  const cells = useTypedSelector(({ cells: { order, data }}) => {
    // sorted all cells into an ordered list for component CellList
    return order.map((id) => {
      return data[id];
    });
  });

  const renderedCells = cells.map(cell => <CellListItem key={cell.id} cell={cell}/>)
  return (
    <div>{renderedCells}</div>
  )
};

export default CellList;