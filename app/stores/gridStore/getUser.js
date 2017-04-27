import {apiBase, socialUrlRegex} from './../../constants';

export default async function updateUser(args) {
	const options = {
		...args
	};

	options.username = options.username || 'saschavona';

	options.username.replace(socialUrlRegex, '');

	console.log(options);

	try {
		if (options.type.indexOf('yt') === 0) {
			if (options.userId || (options.username.indexOf('UC') === 0 && options.username.length === 24)) {
				// Get YouTube channel by channelId
				options.userId = options.userId || options.username;
				const request = await fetch(`${apiBase}/youtube/channel/channelid/${options.userId}`, {method: 'get'});
				const {title, thumbnails} = await request.json();
				options.username = title;
				options.profileImage = thumbnails.default.url;
			} else {
				// Get Youtube channel by username
				const response = await fetch(`${apiBase}/youtube/channel/user/${options.username}`, {method: 'get'});
				const {channelId, title, thumbnails} = await response.json();
				options.username = title;
				options.userId = channelId;
				options.profileImage = thumbnails.default.url;
			}
			options.url = `https://youtube.com/channel/${options.userId}`;
		} else if (options.type.indexOf('twitch') === 0) {
			const request = await fetch(`${apiBase}/twitch/user/${options.username}`, {method: 'get'});
			const {id, name, logo, displayName} = await request.json();
			options.username = displayName;
			options.userId = id;
			options.profileImage = logo;
			options.url = `https://twitch.tv/${name}`;
		} else if (options.type.indexOf('twitter') === 0) {
			options.profileImage = `https://images.weserv.nl/?url=twitter.com/${options.username}/profile_image?size=original`;
			options.url = `https://twitter.com/@${options.username}`;
		} else if (options.type.indexOf('instagram') === 0) {
			options.userId = options.username;
			const request = await fetch(`${apiBase}/instagram/user/${options.username}`, {method: 'get'});
			const {username, image} = await request.json();
			options.username = username;
			options.profileImage = image;
			options.url = `https://instagram.com/${options.username}`;
		}

		return options;
	} catch (error) {
		return {error};
	}
}
