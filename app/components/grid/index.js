import {Responsive as ResponsiveGridLayout, WidthProvider as widthProvider} from 'react-grid-layout';
import React from 'react';
import {observer, inject} from 'mobx-react';
import {ContextMenuTrigger} from 'react-contextmenu/es6';

import DynamicGridMenu from 'components/dynamicGridMenu';
import css from 'css/grid.css';
import GenericGridItem from './genericGridItem';

const GridLayout = widthProvider(ResponsiveGridLayout);

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	onCollect = props => props;
	handleItemClick = (...args) => {
		const opts = args[1];
		switch (opts.action) {
			case 'REMOVE_ITEM': {
				this.props.gridStore.removeGridItem(opts.itemId);
				break;
			}
			case 'ADD_ITEM': {
				this.props.uiStore.handleToggleDialog();
				break;
			}
			default:

		}
	}
	dragAmount = 0;
	dragTimeout;
	handleDisableContextMenu = () => {
		this.dragAmount += 1;
		console.log(this.dragAmount);
		if (this.dragAmount > 3) {
			clearTimeout(this.dragTimeout);
			this.dragTimeout = setTimeout(() => {
				this.props.uiStore.disableContextMenu = false;
			}, 1000);
			this.props.uiStore.disableContextMenu = true;
		}
	}
	handleEnableContextMenu = () => {
		this.props.uiStore.disableContextMenu = false;
		this.dragAmount = 0;
	}
	render() {
		const {gridStore, uiStore} = this.props;
		const cols = {lg: 6, sm: 4};

		return (
			<ContextMenuTrigger
				className={css.main}
				id="grid"
				holdToDisplay={1000}
				collect={this.onCollect}
				onItemClick={this.handleItemClick}
				disable={uiStore.disableContextMenu}
				>
				<DynamicGridMenu id="grid"/>
				{gridStore.enableGrid && (
					<GridLayout
						onDrag={this.handleDisableContextMenu}
						onResizeStart={this.handleDisableContextMenu}
						onDragStop={this.handleEnableContextMenu}
						onResizeStop={this.handleEnableContextMenu}
						breakpoints={{lg: 1000, sm: 0}}
						measureBeforeMount
						rowHeight={120}
						className={css.layout}
						onLayoutChange={gridStore.onLayoutChange} // eslint-disable-line react/jsx-handler-names
						layouts={gridStore.layouts}
						cols={cols}
						draggableCancel={'nonDraggable'}
						verticalCompact={false}
						>
						{gridStore.items.map(item => {
							let GridItem;
							switch (item.type) {
								case 'someweirdtype':

									break;
								default: {
									GridItem = <GenericGridItem item={item}/>;
								}
							}
							return (
								<div key={item.id}>
									<ContextMenuTrigger
										style={{height: '100%'}}
										id="grid"
										holdToDisplay={1000}
										collect={this.onCollect}
										onItemClick={this.handleItemClick}
										itemId={item.id}
										gridItem
										disable={uiStore.disableContextMenu}
										>
										{GridItem}
									</ContextMenuTrigger>
								</div>
							);
						})}
					</GridLayout>
				)}
			</ContextMenuTrigger>
		);
	}
}

App.propTypes = {
	gridStore: React.PropTypes.object,
	uiStore: React.PropTypes.object
};

export default App;
