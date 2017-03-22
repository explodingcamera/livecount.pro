import gridStore from './gridStore';
import uiStore from './uiStore';

const stores = {
	gridStore,
	uiStore
};

for (const [, store] of Object.entries(stores)) {
	if (store.injectStores) {
		store.injectStores(stores);
	}
}

export default {
	gridStore,
	uiStore
};
