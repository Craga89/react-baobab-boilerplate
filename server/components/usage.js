import store from '../../store';
import usage from 'usage';

// How often to update the usage stats
const INTERVAL = 500;

// Turn keepHistory to approximate current CPU usage rather than the average
// (see https://github.com/arunoda/node-usage#average-cpu-usage-vs-current-cpu-usage)
const opts = { keepHistory: false };

// General method for grabbing the usage in an async fashion
// using promises
async function getUsage() {
	return new Promise(function(resolve, reject) {
		usage.lookup(process.pid, opts, function(err, result) {
			if(err) { reject(err); }
			resolve(result);
		});
	});
}

// General iterator method that loops ever n seconds
// getting the usage stats and updating the store
let timer;
async function iterate() {
	// Get new usages and update the store
	let { memory, cpu } = await getUsage();
	store.select('usage').merge({ cpu, memory });

	// Iterate again after n seconds
	clearTimeout(timer);
	timer = setTimeout(iterate, INTERVAL);
}

// Installer method
export function install() {
	// Set initial store state
	store.set('usage', { cpu: 0, memory: 0 });

	// Set off initial iteration
	return iterate();
};