export default function () {
	let appHeight;
	const checkWidthChange = () => {
		const newHeight = document.querySelector('#app > div').clientHeight;
		if (appHeight !== newHeight) {
			appHeight = newHeight;
			window.dispatchEvent(new Event('resize'));
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
		appHeight = document.querySelector('#app > div').clientHeight;
		setInterval(() => {
			checkWidthChange();
		}, 100);
	});
}
