/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const optionsTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
			},
		},
		options: [
			{
				name: 'Cancel Options Order',
				value: 'cancelOptionsOrder',
				description: 'Cancel an options order',
				action: 'Cancel an options order',
			},
			{
				name: 'Get Options Account',
				value: 'getOptionsAccount',
				description: 'Get options account info',
				action: 'Get options account info',
			},
			{
				name: 'Get Options Candlesticks',
				value: 'getOptionsCandlesticks',
				description: 'Get options candlestick data',
				action: 'Get options candlestick data',
			},
			{
				name: 'Get Options Contracts',
				value: 'getOptionsContracts',
				description: 'Get options contracts',
				action: 'Get options contracts',
			},
			{
				name: 'Get Options My Trades',
				value: 'getOptionsMyTrades',
				description: 'Get my options trades',
				action: 'Get my options trades',
			},
			{
				name: 'Get Options Order Book',
				value: 'getOptionsOrderBook',
				description: 'Get options order book',
				action: 'Get options order book',
			},
			{
				name: 'Get Options Orders',
				value: 'getOptionsOrders',
				description: 'Get options orders',
				action: 'Get options orders',
			},
			{
				name: 'Get Options Positions',
				value: 'getOptionsPositions',
				description: 'Get options positions',
				action: 'Get options positions',
			},
			{
				name: 'Get Options Settlements',
				value: 'getOptionsSettlements',
				description: 'Get options settlements',
				action: 'Get options settlements',
			},
			{
				name: 'Get Options Tickers',
				value: 'getOptionsTickers',
				description: 'Get options tickers',
				action: 'Get options tickers',
			},
			{
				name: 'Get Options Trades',
				value: 'getOptionsTrades',
				description: 'Get options market trades',
				action: 'Get options market trades',
			},
			{
				name: 'Get Options Underlyings',
				value: 'getOptionsUnderlyings',
				description: 'Get options underlyings',
				action: 'Get options underlyings',
			},
			{
				name: 'Place Options Order',
				value: 'placeOptionsOrder',
				description: 'Place an options order',
				action: 'Place an options order',
			},
		],
		default: 'getOptionsContracts',
	},
];

export const optionsTradingFields: INodeProperties[] = [
	// Underlying field for multiple operations
	{
		displayName: 'Underlying',
		name: 'underlying',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: [
					'getOptionsContracts',
					'getOptionsSettlements',
					'getOptionsTickers',
					'getOptionsPositions',
					'getOptionsOrders',
					'getOptionsMyTrades',
				],
			},
		},
		default: 'BTC_USDT',
		description: 'Underlying asset (e.g., BTC_USDT)',
	},
	// Contract field
	{
		displayName: 'Contract',
		name: 'contract',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: [
					'getOptionsOrderBook',
					'getOptionsTrades',
					'getOptionsCandlesticks',
					'placeOptionsOrder',
					'cancelOptionsOrder',
				],
			},
		},
		default: '',
		description: 'Options contract name',
	},
	// Order ID for cancel
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['cancelOptionsOrder'],
			},
		},
		default: '',
		description: 'Order ID to cancel',
	},
	// Place order fields
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['placeOptionsOrder'],
			},
		},
		default: 1,
		description: 'Order size (number of contracts)',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['placeOptionsOrder'],
			},
		},
		default: '',
		description: 'Order price (leave empty for market order)',
	},
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['placeOptionsOrder'],
			},
		},
		options: [
			{ name: 'Ask (Sell)', value: 'ask' },
			{ name: 'Bid (Buy)', value: 'bid' },
		],
		default: 'bid',
		description: 'Order side',
	},
	{
		displayName: 'Time in Force',
		name: 'tif',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['placeOptionsOrder'],
			},
		},
		options: [
			{ name: 'Good Till Cancelled', value: 'gtc' },
			{ name: 'Immediate Or Cancel', value: 'ioc' },
			{ name: 'Post Only', value: 'poc' },
		],
		default: 'gtc',
		description: 'Time in force',
	},
	// Interval for candlesticks
	{
		displayName: 'Interval',
		name: 'interval',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['getOptionsCandlesticks'],
			},
		},
		options: [
			{ name: '1 Minute', value: '1m' },
			{ name: '5 Minutes', value: '5m' },
			{ name: '15 Minutes', value: '15m' },
			{ name: '30 Minutes', value: '30m' },
			{ name: '1 Hour', value: '1h' },
		],
		default: '5m',
		description: 'Candlestick interval',
	},
	// Limit
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: [
					'getOptionsOrderBook',
					'getOptionsTrades',
					'getOptionsCandlesticks',
					'getOptionsOrders',
					'getOptionsMyTrades',
				],
			},
		},
		default: 100,
		description: 'Maximum number of records to return',
	},
	// Status filter for orders
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['optionsTrading'],
				operation: ['getOptionsOrders'],
			},
		},
		options: [
			{ name: 'Open', value: 'open' },
			{ name: 'Finished', value: 'finished' },
		],
		default: 'open',
		description: 'Order status filter',
	},
];

export async function executeOptionsTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getOptionsUnderlyings': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/underlyings',
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsContracts': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/contracts',
				qs: { underlying },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsSettlements': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/settlements',
				qs: { underlying },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsTickers': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/tickers',
				qs: { underlying },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsOrderBook': {
			const contract = this.getNodeParameter('contract', i) as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/order_book',
				qs: { contract, limit },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsTrades': {
			const contract = this.getNodeParameter('contract', i) as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/trades',
				qs: { contract, limit },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsCandlesticks': {
			const contract = this.getNodeParameter('contract', i) as string;
			const interval = this.getNodeParameter('interval', i, '5m') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/candlesticks',
				qs: { contract, interval, limit },
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsAccount': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/accounts',
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsPositions': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/positions',
				qs: { underlying },
				apiType: 'options',
			});
			break;
		}

		case 'placeOptionsOrder': {
			const contract = this.getNodeParameter('contract', i) as string;
			const size = this.getNodeParameter('size', i) as number;
			const price = this.getNodeParameter('price', i, '') as string;
			const side = this.getNodeParameter('side', i) as string;
			const tif = this.getNodeParameter('tif', i, 'gtc') as string;

			const body: IDataObject = {
				contract,
				size,
				tif,
			};

			if (side === 'ask') {
				body.size = -Math.abs(size);
			}

			if (price) {
				body.price = price;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/options/orders',
				body,
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsOrders': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			const status = this.getNodeParameter('status', i, 'open') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/orders',
				qs: { underlying, status, limit },
				apiType: 'options',
			});
			break;
		}

		case 'cancelOptionsOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/options/orders/${orderId}`,
				apiType: 'options',
			});
			break;
		}

		case 'getOptionsMyTrades': {
			const underlying = this.getNodeParameter('underlying', i) as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/options/my_trades',
				qs: { underlying, limit },
				apiType: 'options',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
