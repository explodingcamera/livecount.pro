import {observable, action, computed} from 'mobx';
import {create, persist} from 'mobx-persist';

const apiBase = process.env.NODE_ENV === 'production' ? 'https://explodingcamera.xyz/api/v1' : 'http://localhost:3000/api/v1';

class GridItem {
	@persist @observable fontSize = 40;
	@persist @observable id;
	@persist @observable type = 'yt-sub';
	@persist @observable username = '';
	@persist @observable userId = '';
	@persist @observable url = '';
	@persist @observable number = 0;
	@persist @observable icon = 'socicon-youtube';
	@persist @observable profileImage;

	@persist('object') @observable options = {
		time: 2000,
		enableLink: true,
		enablePicture: true,
		enableSlider: true
	}

	@action handleChangeFontSize = val => {
		this.fontSize = val;
	}

	@action updateNumber = () => {
	}

	constructor(args) {
		Object.assign(this, args);
	}
}

class Grid {
	constructor(...args) {
		Object.assign(this, args);
	}

	@persist @observable name = '';
	@persist @observable index = -1;
	@persist('list', GridItem) @observable items = [];
	@persist('object') @observable layouts;
}

class GridStore {
	constructor() {
		const errorBackup = console.error;
		console.error = (...args) => {
			if (typeof args[0] === 'string' && args[0].includes('Failed prop type: layouts')) {
				return;
			}
			return errorBackup(...args);
		};

		document.addEventListener('DOMContentLoaded', () => {
			this.appWidth = document.querySelector('#app > div').clientWidth;
			setInterval(() => {
				this.checkWidthChange();
			}, 100);
		});
	}

	@observable disableContextMenu = false;
	appWidth;
	checkWidthChange() {
		const newWidth = document.querySelector('#app > div').clientWidth;
		if (this.appWidth !== newWidth) {
			this.appWidth = newWidth;
			window.dispatchEvent(new Event('resize'));
		}
	}

	// OBSERVABLES
	@persist @observable __selectedGridId = 0;
	@persist('list', Grid) @observable grids = [];

	@observable enableGrid = true;

	// GETTERS / SETTERS
	@computed get selectedGridId() {
		return this.__selectedGridId;
	}
	@computed get selectedGrid() {
		return this.grids[this.selectedGridId];
	}
	@computed get itemCount() {
		return this.selectedGrid.items.length;
	}

	@computed get layouts() {
		if (!this.selectedGrid.layouts) {
			return {};
		}
		return this.selectedGrid.layouts;
	}

	@computed get items() {
		if (!this.selectedGrid.items) {
			return [];
		}
		return this.selectedGrid.items;
	}

	set selectedGridId(val) {
		if (this.grids.length <= val) {
			throw new Error('Can\'t set to nonexistend grid');
		}
		this.enableGrid = false;
		this.__selectedGridId = val;
		setTimeout(() => {
			this.enableGrid = true;
		}, 0);
	}

	set layouts(val) {
		this.selectedGrid.layouts = val;
	}

	set items(val) {
		this.selectedGrid.items = val;
	}

	// ACTIONS
	@action onLayoutChange = (layout, layouts) => {
		this.layouts = layouts;
	}

	@action addGrid(args) {
		const id = Object.keys(this.grids).length;
		this.grids.push(
			new Grid({
				...args,
				name: '',
				index: -1
			}));
		return id;
	}

	@action addGridItem = async opts => {
		opts.id = this.selectedGrid.index += 1;

		opts.username.replace(/https:\/\/|http:\/\|youtube.com|m.youtube.com|http:\/\|twitter.com|http:\/\|twitch.tv|\/c\/|\/user\/|\/channel\//g, '');
		if (!opts.username) {
			opts.username = 'saschavona';
		}

		const {items} = this;

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
		}

		const newItem = new GridItem({
			...opts
		});

		items.push(newItem);
		return newItem;
	}

	@action removeGridItem = id => {
		// Search for the position of the item
		const lookup = this.items.map(item => item.id);
		const itemIndex = lookup.indexOf(id);

		if (itemIndex === -1) {
			return new Error('No item with the supplied id exists.');
		}

		// Remove item at that position from the item array
		this.items.splice(itemIndex, 1);
		for (const [, layout] of Object.entries(this.layouts)) {
			layout.splice(itemIndex, 1);
		}
	}
}

const hydrate = create({
	storage: localStorage
});

const gridStore = window.grid = new GridStore();
export default gridStore;
export {GridStore};

hydrate('grid', gridStore).then(store => {
	if (store.grids.length === 0) {
		// If no grid exists, add default grid
		store.addGrid();
	}
}).catch(e => {
	console.error(e);
});
