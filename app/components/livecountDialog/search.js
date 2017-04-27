import {apiBase} from './../../constants';

const youtube = async args => {
	const options = {
		...args
	};

	console.log(options);

	options.username = options.username || 'saschavona';
	const url = `${apiBase}/youtube/search/user/${options.username}`;
	const response = await fetch(url, {method: 'get'});
	const data = await response.json();

	const dropdown = data.map(channel => {
		return {
			value: channel.channelId,
			label: channel.title,
			img: channel.thumbnails.default.url
		};
	});

	return {dropdown};
};
export default {
	youtube
};
