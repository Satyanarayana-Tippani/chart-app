import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MasterPage from './MasterPage';
ReactDOM.render(<MasterPage />, document.getElementById('root'));

serviceWorker.unregister();
