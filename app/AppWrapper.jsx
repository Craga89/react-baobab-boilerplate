import React from 'react';
import App from './App.jsx';

export default React.createClass({
	childContextTypes: {
		store: React.PropTypes.object,
		actions: React.PropTypes.object
	},

	getChildContext() {
		return {
			store: this.props.store,
			actions: this.props.actions
		};
	},

	render() {
		return <App/>;
	}
});
