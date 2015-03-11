import React from 'react';
import ContextMixin from './mixins/ContextMixin.js';
import Usage from './components/Usage.jsx';

export default React.createClass({
	mixins: [ContextMixin],

	render() {
		return (
			<div>
				<Usage />
			</div>
		);
	}
});
