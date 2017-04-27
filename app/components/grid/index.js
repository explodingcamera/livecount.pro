import React from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import {ContextMenuTrigger} from 'react-contextmenu/es6';
import {Responsive as ResponsiveGridLayout, WidthProvider as widthProvider} from 'react-grid-layout';

import removeConsoleError from 'util/removeConsoleError';

import DynamicGridMenu from 'components/dynamicGridMenu';
import css from 'css/grid.css';
import GenericGridItem from './genericGridItem';

const GridLayout = widthProvider(ResponsiveGridLayout);

@inject('uiStore') @inject('gridStore') @observer class App extends React.Component {
	constructor() {
		super();
		removeConsoleError('Failed prop type: layouts');
	}

	onCollect = props => props;

	handleItemClick = (...args) => {
		const opts = args[1];
		switch (opts.action) {
			case 'REMOVE_ITEM': {
				this.props.gridStore.removeGridItem(opts.item.id);
				break;
			}
			case 'EDIT_ITEM': {
				this.props.uiStore.handleToggleEditDialog(opts.item);
				break;
			}
			case 'ADD_ITEM': {
				this.props.uiStore.handleToggleDialog();
				break;
			}
			case 'UPDATE_ITEM': {
				opts.item.edit(opts.item).then(() => {
					//
				});
				break;
			}
			default:

		}
	}

	handleDisableContextMenu = () => {
		this.props.uiStore.disableContextMenu = true;
	}

	handleEnableContextMenu = () => {
		this.props.uiStore.disableContextMenu = false;
	}

	render() {
		const {gridStore, uiStore} = this.props;
		const cols = {lg: 6, sm: 4};
		const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		return (
			<ContextMenuTrigger
				id="grid"
				holdToDisplay={-1}
				collect={this.onCollect}
				disable={uiStore.disableContextMenu}
				onItemClick={this.handleItemClick}
				>
				<DynamicGridMenu id="grid"/>
				{gridStore.enableGrid && (
				<GridLayout
					measureBeforeMount
					breakpoints={{lg: 1000, sm: 0}}
					rowHeight={120}
					verticalCompact={false}
					cols={cols}
					className={css.layout}
					layouts={gridStore.layouts}
					draggableCancel={'.nonDraggable'}
					draggableHandle={'.draggable'}
					onLayoutChange={gridStore.handleLayoutChange} // eslint-disable-line react/jsx-handler-names
					onDragStart={this.handleDisableContextMenu}
					onDragStop={this.handleEnableContextMenu}
					onResizeStart={this.handleDisableContextMenu}
					onResizeStop={this.handleEnableContextMenu}
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
									gridItem
									style={{height: '100%'}}
									id="grid"
									holdToDisplay={mobile ? 1000 : -1}
									item={item}
									disable={uiStore.disableContextMenu}
									collect={this.onCollect}
									onItemClick={this.handleItemClick}
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
	gridStore: PropTypes.object,
	uiStore: PropTypes.object
};

export default App;
