/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';
import { TIME_IN_FORCE_OPTIONS, AUTO_SIZE_OPTIONS } from '../../constants';

export const futuresOrdersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
			},
		},
		options: [
			{
				name: 'Amend Futures Order',
				value: 'amendFuturesOrder',
				description: 'Amend order',
				action: 'Amend order',
			},
			{
				name: 'Batch Futures Orders',
				value: 'batchFuturesOrders',
				description: 'Place batch orders',
				action: 'Place batch orders',
			},
			{
				name: 'Cancel All Futures Orders',
				value: 'cancelAllFuturesOrders',
				description: 'Cancel all orders',
				action: 'Cancel all orders',
			},
			{
				name: 'Cancel Futures Order',
				value: 'cancelFuturesOrder',
				description: 'Cancel order',
				action: 'Cancel order',
			},
			{
				name: 'Countdown Cancel All Futures',
				value: 'countdownCancelAllFutures',
				description: 'Set countdown cancel',
				action: 'Set countdown cancel',
			},
			{
				name: 'Get Futures Liquidation History',
				value: 'getFuturesLiquidationHistory',
				description: 'Get my liquidations',
				action: 'Get my liquidations',
			},
			{
				name: 'Get Futures Order Detail',
				value: 'getFuturesOrderDetail',
				description: 'Get order detail',
				action: 'Get order detail',
			},
			{
				name: 'Get Futures Orders',
				value: 'getFuturesOrders',
				description: 'Get futures orders',
				action: 'Get futures orders',
			},
			{
				name: 'Get My Futures Trades',
				value: 'getMyFuturesTrades',
				description: 'Get my trades',
				action: 'Get my trades',
			},
			{
				name: 'Get Position Close History',
				value: 'getPositionCloseHistory',
				description: 'Get position close history',
				action: 'Get position close history',
			},
			{
				name: 'Place Futures Order',
				value: 'placeFuturesOrder',
				description: 'Place futures order',
				action: 'Place futures order',
			},
		],
		default: 'getFuturesOrders',
	},
];

export const futuresOrdersFields: INodeProperties[] = [
	// Settle currency
	{
		displayName: 'Settle Currency',
		name: 'settle',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
			},
		},
		options: [
			{ name: 'USDT', value: 'usdt' },
			{ name: 'BTC', value: 'btc' },
		],
		default: 'usdt',
		description: 'Settlement currency',
	},
	// Contract field
	{
		displayName: 'Contract',
		name: 'contract',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: [
					'placeFuturesOrder',
					'getFuturesOrders',
					'cancelAllFuturesOrders',
					'getMyFuturesTrades',
					'countdownCancelAllFutures',
				],
			},
		},
		default: 'BTC_USDT',
		description: 'Futures contract name (e.g., BTC_USDT)',
	},
	// Order ID field
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['getFuturesOrderDetail', 'cancelFuturesOrder', 'amendFuturesOrder'],
			},
		},
		default: '',
		description: 'The order ID',
	},
	// Place Order fields
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		default: 0,
		description: 'Order size (positive for long, negative for short)',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		default: '0',
		description: 'Order price (0 for market order)',
	},
	{
		displayName: 'Time In Force',
		name: 'tif',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		options: TIME_IN_FORCE_OPTIONS,
		default: 'gtc',
		description: 'Time in force',
	},
	{
		displayName: 'Reduce Only',
		name: 'reduceOnly',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		default: false,
		description: 'Whether to reduce position only',
	},
	{
		displayName: 'Close Position',
		name: 'close',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		default: false,
		description: 'Whether to close position',
	},
	{
		displayName: 'Auto Size',
		name: 'autoSize',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['placeFuturesOrder'],
			},
		},
		options: AUTO_SIZE_OPTIONS,
		default: '',
		description: 'Auto size for closing position',
	},
	// Amend Order fields
	{
		displayName: 'New Size',
		name: 'newSize',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['amendFuturesOrder'],
			},
		},
		default: 0,
		description: 'New size for the order',
	},
	{
		displayName: 'New Price',
		name: 'newPrice',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['amendFuturesOrder'],
			},
		},
		default: '',
		description: 'New price for the order',
	},
	// Countdown timeout
	{
		displayName: 'Timeout (Seconds)',
		name: 'timeout',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['countdownCancelAllFutures'],
			},
		},
		default: 60,
		description: 'Countdown timeout in seconds (0 to cancel)',
	},
	// Batch Orders
	{
		displayName: 'Orders (JSON)',
		name: 'ordersJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: ['batchFuturesOrders'],
			},
		},
		default: '[]',
		description: 'Array of orders in JSON format',
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['futuresOrders'],
				operation: [
					'getFuturesOrders',
					'getMyFuturesTrades',
					'getPositionCloseHistory',
					'getFuturesLiquidationHistory',
				],
			},
		},
		options: [
			{
				displayName: 'Contract',
				name: 'contract',
				type: 'string',
				default: '',
				description: 'Filter by contract',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'dateTime',
				default: '',
				description: 'Start time',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Maximum number of records',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Offset for pagination',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'open',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Finished', value: 'finished' },
				],
				description: 'Order status filter',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'dateTime',
				default: '',
				description: 'End time',
			},
		],
	},
];

export async function executeFuturesOrdersOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const settle = this.getNodeParameter('settle', i) as string;

	switch (operation) {
		case 'placeFuturesOrder': {
			const contract = this.getNodeParameter('contract', i) as string;
			const size = this.getNodeParameter('size', i) as number;
			const price = this.getNodeParameter('price', i, '0') as string;
			const tif = this.getNodeParameter('tif', i, 'gtc') as string;
			const reduceOnly = this.getNodeParameter('reduceOnly', i, false) as boolean;
			const close = this.getNodeParameter('close', i, false) as boolean;
			const autoSize = this.getNodeParameter('autoSize', i, '') as string;

			const body: IDataObject = {
				contract,
				size,
				price,
				tif,
				reduce_only: reduceOnly,
				close,
			};
			if (autoSize) body.auto_size = autoSize;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/orders`,
				body,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesOrders': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {
				contract,
				status: additionalOptions.status || 'open',
			};
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/orders`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesOrderDetail': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/orders/${orderId}`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'cancelFuturesOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/futures/${settle}/orders/${orderId}`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'cancelAllFuturesOrders': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/futures/${settle}/orders`,
				qs: { contract },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'batchFuturesOrders': {
			const ordersJson = this.getNodeParameter('ordersJson', i) as string;
			const orders = JSON.parse(ordersJson);

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/batch_orders`,
				body: orders,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'amendFuturesOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			const newSize = this.getNodeParameter('newSize', i, 0) as number;
			const newPrice = this.getNodeParameter('newPrice', i, '') as string;

			const body: IDataObject = {};
			if (newSize) body.size = newSize;
			if (newPrice) body.price = newPrice;

			responseData = await gateIoApiRequest.call(this, {
				method: 'PUT',
				endpoint: `/futures/${settle}/orders/${orderId}`,
				body,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getMyFuturesTrades': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/my_trades`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getPositionCloseHistory': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.contract) qs.contract = additionalOptions.contract;
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/position_close`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesLiquidationHistory': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.contract) qs.contract = additionalOptions.contract;
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/liquidates`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'countdownCancelAllFutures': {
			const contract = this.getNodeParameter('contract', i) as string;
			const timeout = this.getNodeParameter('timeout', i) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/countdown_cancel_all`,
				body: { contract, timeout },
				apiType: 'futures',
				settle,
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
