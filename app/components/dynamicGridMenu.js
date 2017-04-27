import React from 'react';
import PropTypes from 'prop-types';
import {ContextMenu, MenuItem, connectMenu} from 'react-contextmenu/es6';

const DynamicMenu = props => {
	const {id, trigger} = props;
	const handleItemClick = trigger ? trigger.onItemClick : null;
	const items = [];

	if (trigger) {
		items.push(<MenuItem data={{action: 'ADD_ITEM'}} onClick={handleItemClick}>{`Add new livecount` }</MenuItem>);
		if (trigger.gridItem) {
			items.push(<MenuItem data={{action: 'REMOVE_ITEM'}} onClick={handleItemClick}>{`Remove`}</MenuItem>);
			items.push(<MenuItem data={{action: 'EDIT_ITEM'}} onClick={handleItemClick}>{`Edit`}</MenuItem>);
			items.push(<MenuItem data={{action: 'UPDATE_ITEM'}} onClick={handleItemClick}>{`Update`}</MenuItem>);
		}
		items.push(<MenuItem onClick={handleItemClick}>{`Cancel`}</MenuItem>);
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
		item: PropTypes.object,
		gridItem: PropTypes.func.bool
	})
};

export default connectMenu('grid')(DynamicMenu);
