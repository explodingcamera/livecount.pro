import {observable, action, autorun} from 'mobx';
import {persist} from 'mobx-persist';

import {apiBase} from './../../constants';
import pageWidth from 'util/pageWidth';
import {version} from './../../../package.json';

export default class GridItem {
	defaultOptions = {
		time: 2000,
		enableLink: true,
		enablePicture: true,
		enableSlider: true,
		draggable: true
	};

	@observable fontSize;
	@observable icon;

	@persist('object') @observable _fontSize = {
		lg: 50,
		sm: 40
	};

	@persist @observable version;
	@persist @observable id;
	@persist @observable type;
	@persist @observable username;
	@persist @observable userId;
	@persist @observable url;
	@persist @observable number = 0;
	@persist @observable profileImage;
	@persist('object') @observable options;

	// ACTIONS
	@action handleChangeFontSize = val => {
		if (this.pageWidth > 1000) {
			this._fontSize.lg = val;
		} else {
			this._fontSize.sm = val;
		}
	}

	@action handleChangefontSize(val) {
		if (pageWidth > 1000) {
			this._fontSize.lg = val;
		} else {
			this._fontSize.sm = val;
		}
	}

	// NORMAL FUNCTIONS
	constructor() {
		this.static = true;
		this.pageWidth = pageWidth;
		this.setFontSize();
		autorun(this.setFontSize);

		// Migration after version change
		let run = false;
			// Only run after persistent values have been loaded
		autorun(() => {
			this.type; // eslint-disable-line no-unused-expressions
			if (run || this.version === version) {
				return;
			}

			// Migrate
			run = true;
			this.updateUser(this).then(data => {
				Object.assign(this, data);
			});

			// Update version to current version
			this.version = version;
		});
	}

	setFontSize = () => {
		this.fontSize = this.pageWidth > 1000 ?
			this._fontSize.lg			:
			this._fontSize.sm;
	}

	async init(opts) {
		this.version = version;
		opts.options = Object.assign({}, this.defaultOptions, opts.options);
		opts.username.replace(/https:\/\/|http:\/\|youtube.com|m.youtube.com|http:\/\|twitter.com|http:\/\|twitch.tv|\/c\/|\/user\/|\/channel\//g, '');
		opts.username = opts.username || 'saschavona';
		opts = await this.updateUser(opts);
		Object.assign(this, opts);
		return;
	}
	async updateUser(opts) {
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
