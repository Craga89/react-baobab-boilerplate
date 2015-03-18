import React from 'react';
import ContextMixin from '../mixins/ContextMixin.js';
import {AreaChart} from 'react-d3-components';
import d3 from 'd3';

import './Usage.less';



let CPUGraph = React.createClass({
	mixins: [React.addons.PureRenderMixin],

	getInitialState() {
		return {
			parentWidth: 0
		}
	},

	getDefaultProps() {
		return {
			width: '100%',
			height: 300,
			margin: { left: -1, top: 10, bottom: 0, right: 1 }
		}
	},

	handleResize(e) {
		let elem = this.getDOMNode();
		let width = elem.offsetWidth;

		this.setState({
			parentWidth: width
		});
	},

	componentDidMount() {
		if(this.props.width === '100%') {
			window.addEventListener('resize', this.handleResize);
		}
		this.handleResize();
	},

	componentWillUnmount() {
		if(this.props.width === '100%') {
			window.removeEventListener('resize', this.handleResize);
		}
	},

	render() {
		let { width, height, margin, xScale, yScale, xAxis, ...props } = this.props;

		// Determine the right graph width to use if it's set to be responsive
		if(width === '100%') {
			width = this.state.parentWidth || 400;
		}
		
		// Set scale ranges
		xScale && xScale.range([0, width - (margin.left + margin.right)]);
		yScale && yScale.range([height - (margin.top + margin.bottom), 0]);

		return (
			<div className={"usage__cpu__graph "+props.className}>
				<AreaChart
					ref="chart"
					width={width}
					height={height}
					margin={margin} 
					xScale={xScale}
					yScale={yScale}
					xAxis={xAxis}
					{...props} 
				/>
			</div>
		);
	}
})


export default React.createClass({
	mixins: [ContextMixin],

	cursors: {
		usage: ['usage']
	},

	getInitialState() {
		return {
			cpu: {
				label: 'CPU Usage',
				xAxis: { label: 'Time' },
				yAxis: { label: 'Percent' }
			}
		};
	},

	render() {
		let width = this.props.width;
		let height = this.props.height;
		let usage = this.state.usage;
		let margin = this.props.margin;

		let latestAverage = usage.cpu.average[usage.cpu.average.length - 1];
		let averageUsage = latestAverage.value.toFixed(0);
		let averageSpeed = (latestAverage.speed / 1000).toFixed(2);

		return (
			<section className="usage col-xs-12">

				<div className="usage__cpu__stats">
					<dl className="dl-horizontal">
						<dt>Cores</dt>
						<dd>{usage.cpu.cores.length}</dd>

						<dt>Utilization</dt>
						<dd>{averageUsage}%</dd>

						<dt>Uptime</dt>
						<dd>{usage.uptime} seconds</dd>
					</dl>
				</div>

				<header className="usage__header clearfix">

					<CPUGraph 
						data={{
							label: 'CPU Usage',
							values: usage.cpu.average
						}}
						width={100}
						height={65}
						margin={margin}

						x={(d) => new Date(d.date)}
						y={(d) => d.value}

						xScale={
							d3.time.scale()
								.domain(d3.extent(usage.cpu.average, (d) => d.date))
						}
						yScale={
							d3.scale.pow()
								.exponent(1.15)
								.domain([0, 100])
						}

						xAxis={{ tickArguments: [0] }}
						yAxis={{ tickArguments: [0] }}
					/>

					<h3>CPU Usage <small>{usage.cpu.model}</small></h3>
					<h4>{averageUsage}% &nbsp;&nbsp;{averageSpeed}GHz</h4>
				</header>

				<div className="usage__cpu__graphs">

					<small className="text-muted">
						% Utilization over {~~((usage.interval / 1000) * usage.points)} seconds
					</small>

					<small className="text-muted pull-right">
					100%
					</small>

					<div className="usage__cpu__graphs__container">
						{usage.cpu.cores.map((values) => {
							return (
								<CPUGraph 
									data={{
										label: 'CPU Usage',
										values: values
									}}
									width={width}
									height={height}
									margin={margin}

									x={(d) => new Date(d.date)}
									y={(d) => d.value}

									xScale={
										d3.time.scale()
											.domain(d3.extent(values, (d) => d.date))
									}
									yScale={
										d3.scale.pow()
											.exponent(1.15)
											.domain([0, 100])
									}

									xAxis={{ tickArguments: [0] }}
									yAxis={{ tickArguments: [0] }}
								/>
							)
						})}
					</div>
				</div>
			</section>
		);
	}
});
