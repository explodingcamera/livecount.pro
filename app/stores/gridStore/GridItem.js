import {observable, action} from 'mobx';
import {persist} from 'mobx-persist';

import {apiBase} from './../../constants';

export default class GridItem {
	@persist @observable fontSize = 40;
	@persist @observable id;
	@persist @observable type;
	@persist @observable username;
	@persist @observable userId;
	@persist @observable url;
	@persist @observable number = 0;
	@persist @observable icon;
	@persist @observable profileImage;

	@persist('object') @observable options;

	@action handleChangeFontSize = val => {
		this.fontSize = val;
	}

	@action updateNumber = () => {
	}

	defaultOptions = {
		time: 2000,
		enableLink: true,
		enablePicture: true,
		enableSlider: true
	};
	async init(opts) {
		opts.options = Object.assign({}, this.defaultOptions, opts.options);
		opts.username = opts.username || 'saschavona';
		opts = await this.updateUser(opts);
		console.log(2);
		Object.assign(this, opts);
		return;
	}
	async updateUser(opts) {
		opts.username.replace(/https:\/\/|http:\/\|youtube.com|m.youtube.com|http:\/\|twitter.com|http:\/\|twitch.tv|\/c\/|\/user\/|\/channel\//g, '');

		if (opts.type.indexOf('yt') === 0) {
			if (opts.userId || (opts.username.indexOf('UC') === 0 && opts.username.length === 24)) {
				opts.userId = opts.userId || opts.username;
				const request = await fetch(`${apiBase}/youtube/channel/channelid/${opts.userId}`, {method: 'get'});
				const {title, thumbnails} = await request.json();
				opts.username = title;
				opts.profileImage = thumbnails.default.url;
			} else {
				const response = await fetch(`${apiBase}/youtube/channel/user/${opts.username}`, {method: 'get'});
				const {channelId, title, thumbnails} = await response.json();
				opts.username = title;
				opts.userId = channelId;
				opts.profileImage = thumbnails.default.url;
			}
			opts.url = `https://youtube.com/channel/${opts.userId}`;
		} else if (opts.type.indexOf('twitch') === 0) {
			const request = await fetch(`${apiBase}/twitch/user/${opts.username}`, {method: 'get'});
			const {id, name, logo, displayName} = await request.json();
			opts.username = displayName;
			opts.userId = id;
			opts.profileImage = logo;
			opts.url = `https://twitch.tv/${name}`;
		} else if (opts.type.indexOf('twitter') === 0) {
			opts.profileImage = `https://images.weserv.nl/?url=twitter.com/${opts.username}/profile_image?size=original`;
			opts.url = `https://twitter.com/@${opts.username}`;
		} else if (opts.type.indexOf('instagram') === 0) {
			opts.userId = opts.username;
			const request = await fetch(`${apiBase}/instagram/user/${opts.username}`, {method: 'get'});
			const {username, image} = await request.json();
			opts.username = username;
			opts.profileImage = image;
			opts.url = `https://instagram.com/${opts.username}`;
		}
		return opts;
	}
}
