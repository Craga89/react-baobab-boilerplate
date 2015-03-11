import React from 'react/addons';
import ContextMixin from './mixins/ContextMixin.js';

export default React.createClass({
	mixins: [ContextMixin],

	cursors: {
		usage: ['usage']
	},

	render() {
		return (
			<div>
				<h1>Server Statistics</h1>
				<dl>
					<dt>CPU Usage</dt>
					<dd>{this.state.usage.cpu.toFixed(2)}%</dd>

					<dt>Memory Usage</dt>
					<dd>{(this.state.usage.memory / 1E6).toFixed(0)}MB</dd>
				</dl>
			</div>
		);
	}
});
