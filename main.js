const extensionId = 'extension-2d3dsettings-test'.split('-')[1]; // This format is needed to set the extension ID during install
const extensionConsoleTag = '[extension-2d3dsettings]';
(function() {
	
	const STORAGE_KEY = 'extension.' + extensionId + '.settings.'; // Prefix for localStorage
	const TIMEOUT = 10 * 1000; // How much to wait for 2D/3D view to be ready, in ms
	
	let ID = null; // The tab ID of the PCB editor that started its 2D/3D view
	let ID_VIEW = null; // The tab ID of the last opened (and currently watched) 2D/3D view
	let SETTINGS = {}; // Currently loaded settings for the currently watched 2D/3D view
	let TIMEOUT_ID = null; // Timer identifier while waiting for the 2D/3D view to be ready
	let TIMEOUT_START = null; // Timestamp when started waiting for the 2D/3D view
	
	// Listen commands triggers (menu and buttons)
	$('[cmd=convertToPhotoView], [cmd=3DView]').on('click', () => {
		
		// Reset state
		ID = null;
		ID_VIEW = null;
		SETTINGS = {};
		clearTimeout(TIMEOUT_ID);
		
		// If the active tab is a PCB document, wait for the 2D/3D view to be ready
		const activeTab = $('#tabbar .tabbar-tab.active');
		const activeTabID = activeTab.attr('tabid');
		if (activeTabID && activeTab.attr('doctype') == "3") {
			setTimeout(() => {
				const doctype = $('#tabbar .tabbar-tab.active').attr('doctype');
				if (["12", "15"].includes(doctype)) {
					TIMEOUT_START = new Date().getTime();
					waitForViewControls(activeTabID);
				}
			}, 500);
		}
		
	});
	
	// Wait for the view controls to be ready
	const waitForViewControls = (id) => {
		const controls = $('#attr-main [name^="attr-"]');
		const controlsNames = controls.toArray().map(e => e.name);
		const is2D = controlsNames.includes("attr-photo-board-color") && controlsNames.includes("attr-photo-silk-screen");
		const is3D = controlsNames.includes("attr-board-thickness") && controlsNames.includes("attr-surface-finish-color");
		if (is2D || is3D) {
			console.log(extensionConsoleTag, "PCB ID", id);
			setTimeout(() => setViewControls(id), 100);
		} else {
			if (new Date().getTime() - TIMEOUT_START <= TIMEOUT) {
				TIMEOUT_ID = setTimeout(() => waitForViewControls(id), 500); // Retry
			}
		}
	};
	
	// Set controls values from local stored settings
	const setViewControls = async (id) => {
		
		// Set state, to identify the currently watched 2D/3D view
		ID = id;
		ID_VIEW = $('#tabbar .tabbar-tab.active').attr('tabid');
		SETTINGS = getSettings(id);
		
		// Set values from local stored settings (if any)
		for (const k of Object.keys(SETTINGS)) {
			await setViewControlValue(k, SETTINGS[k]);
		}
		
	};
	
	// Set a single control value, returning a Promise that fulfills asynchronously
	const setViewControlValue = (name, value) => {
		return new Promise(resolve => {
			const control = $('#attr-main [name]').toArray().find(e => e.name == name);
			if (control && $(control).val() != value) {
				console.log(extensionConsoleTag, "SET", name, "=", value);
				$(control).val(value).trigger('change');
			}
			setTimeout(resolve, 10);
		});
	};
	
	// Listen controls values changes on the currently watched 2D/3D view, and store new settings
	$('#attr-main').on('input', '[name^="attr-"]', function() {
		if (ID && ID_VIEW == $('#tabbar .tabbar-tab.active').attr('tabid')) {
			const value = $(this).val();
			SETTINGS[this.name] = value;
			console.log(extensionConsoleTag, "STORE", this.name, "=", value);
			storeSettings(ID, SETTINGS);
		}
	});
	
	// Get local stored controls values for given ID
	const getSettings = (id) => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY + id)) || {};
		} catch (x) {
			return {};
		}
	};
	
	// Set local stored controls values for given ID
	const storeSettings = (id, settings) => {
		localStorage.setItem(STORAGE_KEY + id, JSON.stringify(settings));
	};
	
	console.log(extensionConsoleTag, "LOADED");
	
})();