import os from 'os';
import store from '../../store';

const INTERVAL = 500;
const MAX_POINTS = 120;
const CPU_COUNT = os.cpus().length;

// Create function to get CPU information
function getCPUAverage(cpuIndex) {
	let cpu = os.cpus()[cpuIndex];

	return {
		idle: cpu.times.idle,
		total: cpu.times.user + 
			cpu.times.nice + 
			cpu.times.sys + 
			cpu.times.irq + 
			cpu.times.idle
	};
}

// Grab first CPU Measure
let lastMeasures = [];
function getCPUUsage(cpuIndex) {
	// Get CPU measures
	let measure = getCPUAverage(cpuIndex); 
	let lastMeasure = lastMeasures[cpuIndex] || measure;

	// Calculate the difference in idle and total time between the measures
	let idleDifference = measure.idle - lastMeasure.idle;
	let totalDifference = measure.total - lastMeasure.total;

	// Store the new measure
	lastMeasures[cpuIndex] = measure;

	// Calculate the average percentage CPU usage
	return ~~(((totalDifference - idleDifference) / totalDifference) * 100);
}

// General iterator method that loops ever n seconds
// getting the usage stats and updating the store
let timer;
async function iterate() {
	store.commit();

	// Get cursors
	let usageCursor = store.select('usage');
	let cpuCursor = usageCursor.select('cpu');
	let memoryCursor = usageCursor.select('memory', 'usage');

	// Update the store
	let date = Date.now();
	cpuCursor.apply((cpuUsage) => {
		let averageUsage = 0;
		let averageSpeed = 0;

		for(let cpuIndex = 0; cpuIndex < CPU_COUNT; cpuIndex++) {
			let cpu = cpuUsage.cores[cpuIndex] || (cpuUsage.cores[cpuIndex] = []);

			let value = getCPUUsage(cpuIndex);
			let speed = os.cpus()[cpuIndex].speed;

			averageUsage += value;
			averageSpeed += speed;

			cpu.push({ date, value, speed });

			if(cpu.length > MAX_POINTS) { cpu.shift(); }
		}

		let average = cpuUsage.average;
		average.push({
			date, 
			value: averageUsage / CPU_COUNT,
			speed: averageSpeed / CPU_COUNT
		});
		if(average.length > MAX_POINTS) { average.shift(); }

		return cpuUsage;
	});

	memoryCursor.apply((memoryUsage) => {
		memoryUsage.push({ date: Date.now(), memoryUsage: os.freemem() });
		if(memoryUsage.length > MAX_POINTS) { memoryUsage.shift(); }

		return memoryUsage;
	});

	usageCursor.set('uptime', os.uptime());

	// Iterate again after n seconds
	clearTimeout(timer);
	timer = setTimeout(iterate, INTERVAL);
}

// Installer method
export function install() {
	// Set initial store state
	store.set('usage', {
		interval: INTERVAL,
		points: MAX_POINTS,
		uptime: 0,
		cpu: {
			cores: [],
			average: [],
			count: CPU_COUNT,
			model: os.cpus()[0].model
		},
		memory: {
			usage: [],
			total: os.totalmem()
		}
	});

	store.commit();

	// Set off initial iteration
	return iterate();
};














