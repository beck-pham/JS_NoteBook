import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state';
// import TextEditor from './components/text-editor';
import CellList from './components/cell-list';

import 'bulmaswatch/superhero/bulmaswatch.min.css';

const App = () => {
  return(
    <Provider store={store}>
      <div>
        <CellList />
        {/* <TextEditor /> */}
      </div>
    </Provider>
  )
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
)