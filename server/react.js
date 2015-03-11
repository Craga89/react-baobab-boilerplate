import * as config from '../config';

import fs from 'fs';
import url from 'url';
import React from 'react';
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

		// Process and return the index.html file, replacing placeholder values...
		this.body = index

		// ${APP} => Rendered application HTML
		.replace('${APP}',
			React.renderToString(
				appFactory({ store: store.toJSON() })
			)
		)

		// ${STORE} => JSONified Store
		.replace('${STORE}',
			JSON.stringify(store)
		)

		// ${ENTRY_POINT} => Main entry point script
		.replace('${ENTRY_POINT}', 
			url.resolve(config.baseUrl, 'app.js')
		);
	});
}