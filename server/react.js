import * as config from '../config';

import fs from 'fs';
import url from 'url';
import React from 'react';
import winston from 'winston';
import store from '../store';
import AppWrapper from '../app/AppWrapper.jsx';

// Generate a React.Element factory using the AppWrapper
let appFactory = React.createFactory(AppWrapper);

// Installer method
export function install(app) {
	// Base route, which serves up our index.html file
	app.get('/', function* () {
		let index = fs.readFileSync(config.paths.index).toString();

		// Return HTML Content-type 
		this.type = 'html';

		// Render the app first (if we can)
		let app = '';
		try {
			app = React.renderToString(
				React.createElement({ store: store.toJSON() })
			);
		}
		catch(e) {
			winston.error('[React]', e);
		}

		// Process and return the index.html file, replacing placeholder values...
		this.body = index

		// ${APP} => Rendered application HTML
		.replace('${APP}', app)

		// ${STORE} => JSONified Store
		.replace('${STORE}',
			JSON.stringify(store)
		)

		// Main entry point scripts
		.replace('${COMMON_POINT}', url.resolve(config.baseUrl, 'common.js'))
		.replace('${ENTRY_POINT}', url.resolve(config.baseUrl, 'app.js'));
	});
}