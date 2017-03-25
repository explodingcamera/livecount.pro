import {observable, action, computed} from 'mobx';
import {create, persist} from 'mobx-persist';

import GridItem from './GridItem';
import Grid from './Grid';

class GridStore {
	injectStores(stores) {
		this.uiStore = stores.uiStore;
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
	@action handleLayoutChange = (layout, layouts) => {
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
		const newItem = new GridItem();
		await newItem.init(opts);
		this.items.push(newItem);
		return;
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
