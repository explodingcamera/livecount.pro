import {observable} from 'mobx';
import {addResizeEvent} from './optimisedResize';

const width = observable(document.body.clientWidth);

addResizeEvent((() => {
	width.set(document.body.clientWidth);
}));

export default width;
