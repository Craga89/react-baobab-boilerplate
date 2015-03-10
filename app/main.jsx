import React from 'react';
import AppWrapper from './AppWrapper.jsx';
import store from './store';
import actions from './actions/index';

// Initialize Socket.IO
import './io';

// Render the AppWrapper directly on the `document.body`
let App = React.render(
	<AppWrapper store={store} actions={actions}/>,
	document.body
);

// Expose various parts in DEBUG mode
if(__DEBUG__) {
	window.APP = App;
	window.STORE = store;
	window.ACTIONS = actions;
}
