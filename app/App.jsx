import React from 'react/addons';
import ContextMixin from './mixins/ContextMixin.js';

export default React.createClass({
	mixins: [ContextMixin],

	cursors: {
		list: ['list']
	},

	render() {
		return (
			<h1>Hello world</h1>
		);
	}
});
