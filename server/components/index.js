import * as Usage from './usage';

// Installer method
export function install(app) {
	return Promise.all([
		Usage.install(app)
	]);
}