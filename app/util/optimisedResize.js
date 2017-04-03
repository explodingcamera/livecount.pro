const callbacks = [];
let	running = false;

function resize() {
	if (running) {
		return;
	}
	running = true;
	if (window.requestAnimationFrame) {
		window.requestAnimationFrame(runCallbacks);
	} else {
		setTimeout(runCallbacks, 66);
	}
}

function runCallbacks() {
	callbacks.forEach(callback => {
		callback();
	});

	running = false;
}

function addCallback(callback) {
	if (callback) {
		callbacks.push(callback);
	}
}

export function addResizeEvent(callback) {
	if (!callbacks.length) {
		window.addEventListener('resize', resize);
	}
	addCallback(callback);
}
