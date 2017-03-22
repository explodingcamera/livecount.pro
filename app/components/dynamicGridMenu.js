import React, {PropTypes} from 'react';
import {ContextMenu, MenuItem, connectMenu} from 'react-contextmenu/es6';

const DynamicMenu = props => {
	const {id, trigger} = props;
	const handleItemClick = trigger ? trigger.onItemClick : null;
	const items = [];

	if (trigger) {
		items.push(<MenuItem onClick={handleItemClick} data={{action: 'ADD_ITEM'}}>{`Add new livecount`}</MenuItem>);
		if (trigger.gridItem) {
			items.push(<MenuItem onClick={handleItemClick} data={{action: 'REMOVE_ITEM'}}>{`Remove`}</MenuItem>);
		}
	}
	return (
		<ContextMenu id={id}>
			{items.map(item => <div key={items.indexOf(item)}>
				{item}
			</div>)}
		</ContextMenu>
	);
};

DynamicMenu.propTypes = {
	id: PropTypes.string.isRequired,
	trigger: PropTypes.shape({
		itemId: PropTypes.number,
		gridItem: PropTypes.func.bool
	})
};

export default connectMenu('grid')(DynamicMenu);
