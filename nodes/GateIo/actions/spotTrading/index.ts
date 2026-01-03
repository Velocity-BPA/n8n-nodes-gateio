/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';
import { CANDLESTICK_INTERVALS, ORDER_TYPES, ORDER_SIDES, TIME_IN_FORCE_OPTIONS } from '../../constants';

export const spotTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
			},
		},
		options: [
			{
				name: 'Amend Order',
				value: 'amendOrder',
				description: 'Amend an existing order',
				action: 'Amend an existing order',
			},
			{
				name: 'Batch Place Orders',
				value: 'batchPlaceOrders',
				description: 'Place multiple orders',
				action: 'Place multiple orders',
			},
			{
				name: 'Cancel All Orders',
				value: 'cancelAllOrders',
				description: 'Cancel all orders by pair',
				action: 'Cancel all orders by pair',
			},
			{
				name: 'Cancel Order',
				value: 'cancelOrder',
				description: 'Cancel a specific order',
				action: 'Cancel a specific order',
			},
			{
				name: 'Cancel Orders',
				value: 'cancelOrders',
				description: 'Cancel multiple orders',
				action: 'Cancel multiple orders',
			},
			{
				name: 'Get All Tickers',
				value: 'getAllTickers',
				description: 'Get all tickers',
				action: 'Get all tickers',
			},
			{
				name: 'Get Candlesticks',
				value: 'getCandlesticks',
				description: 'Get candlestick data',
				action: 'Get candlestick data',
			},
			{
				name: 'Get Countdown Cancel All',
				value: 'getCountdownCancelAll',
				description: 'Get countdown cancel setting',
				action: 'Get countdown cancel setting',
			},
			{
				name: 'Get Currency Pair Detail',
				value: 'getCurrencyPairDetail',
				description: 'Get currency pair details',
				action: 'Get currency pair details',
			},
			{
				name: 'Get Currency Pairs',
				value: 'getCurrencyPairs',
				description: 'Get all currency pairs',
				action: 'Get all currency pairs',
			},
			{
				name: 'Get My Trades',
				value: 'getMyTrades',
				description: 'Get my trade history',
				action: 'Get my trade history',
			},
			{
				name: 'Get Order',
				value: 'getOrder',
				description: 'Get order detail',
				action: 'Get order detail',
			},
			{
				name: 'Get Order Book',
				value: 'getOrderBook',
				description: 'Get order book',
				action: 'Get order book',
			},
			{
				name: 'Get Orders',
				value: 'getOrders',
				description: 'Get open orders',
				action: 'Get open orders',
			},
			{
				name: 'Get Ticker',
				value: 'getTicker',
				description: 'Get ticker for pair',
				action: 'Get ticker for pair',
			},
			{
				name: 'Get Trades',
				value: 'getTrades',
				description: 'Get market trades',
				action: 'Get market trades',
			},
			{
				name: 'Place Order',
				value: 'placeOrder',
				description: 'Place a new order',
				action: 'Place a new order',
			},
			{
				name: 'Set Countdown Cancel All',
				value: 'setCountdownCancelAll',
				description: 'Set countdown cancel all',
				action: 'Set countdown cancel all',
			},
		],
		default: 'getCurrencyPairs',
	},
];

export const spotTradingFields: INodeProperties[] = [
	// Currency Pair field
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: [
					'getCurrencyPairDetail',
					'getTicker',
					'getOrderBook',
					'getTrades',
					'getCandlesticks',
					'placeOrder',
					'getOrders',
					'cancelAllOrders',
					'getMyTrades',
					'setCountdownCancelAll',
				],
			},
		},
		default: 'BTC_USDT',
		description: 'Currency pair (e.g., BTC_USDT)',
	},
	// Order ID field
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getOrder', 'cancelOrder', 'amendOrder'],
			},
		},
		default: '',
		description: 'The order ID',
	},
	// Order IDs for batch operations
	{
		displayName: 'Order IDs',
		name: 'orderIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['cancelOrders'],
			},
		},
		default: '',
		description: 'Comma-separated order IDs to cancel',
	},
	// Place Order fields
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		options: ORDER_SIDES,
		default: 'buy',
		description: 'Order side',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		options: ORDER_TYPES,
		default: 'limit',
		description: 'Order type',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		default: '',
		description: 'Order amount',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
				type: ['limit', 'poc'],
			},
		},
		default: '',
		description: 'Order price (required for limit orders)',
	},
	{
		displayName: 'Time In Force',
		name: 'timeInForce',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['placeOrder'],
			},
		},
		options: TIME_IN_FORCE_OPTIONS,
		default: 'gtc',
		description: 'Time in force',
	},
	// Amend Order fields
	{
		displayName: 'New Price',
		name: 'newPrice',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['amendOrder'],
			},
		},
		default: '',
		description: 'New price for the order',
	},
	{
		displayName: 'New Amount',
		name: 'newAmount',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['amendOrder'],
			},
		},
		default: '',
		description: 'New amount for the order',
	},
	// Candlestick fields
	{
		displayName: 'Interval',
		name: 'interval',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['getCandlesticks'],
			},
		},
		options: CANDLESTICK_INTERVALS,
		default: '1h',
		description: 'Candlestick interval',
	},
	// Countdown Cancel All
	{
		displayName: 'Timeout (Seconds)',
		name: 'timeout',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['spotTrading'],
				operation: ['setCountdownCancelAll'],
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
				resource: ['spotTrading'],
				operation: ['batchPlaceOrders'],
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
				resource: ['spotTrading'],
				operation: ['getOrderBook', 'getTrades', 'getCandlesticks', 'getOrders', 'getMyTrades'],
			},
		},
		options: [
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
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number',
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

export async function executeSpotTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCurrencyPairs': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/currency_pairs',
				apiType: 'spot',
			});
			break;
		}

		case 'getCurrencyPairDetail': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/spot/currency_pairs/${currencyPair}`,
				apiType: 'spot',
			});
			break;
		}

		case 'getTicker': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/tickers',
				qs: { currency_pair: currencyPair },
				apiType: 'spot',
			});
			break;
		}

		case 'getAllTickers': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/tickers',
				apiType: 'spot',
			});
			break;
		}

		case 'getOrderBook': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { currency_pair: currencyPair };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/order_book',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getTrades': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { currency_pair: currencyPair };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/trades',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getCandlesticks': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const interval = this.getNodeParameter('interval', i, '1h') as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {
				currency_pair: currencyPair,
				interval,
			};
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/candlesticks',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'placeOrder': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const type = this.getNodeParameter('type', i, 'limit') as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const timeInForce = this.getNodeParameter('timeInForce', i, 'gtc') as string;

			const body: IDataObject = {
				currency_pair: currencyPair,
				side,
				type,
				amount,
				time_in_force: timeInForce,
			};

			if (type === 'limit' || type === 'poc') {
				const price = this.getNodeParameter('price', i) as string;
				body.price = price;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/spot/orders',
				body,
				apiType: 'spot',
			});
			break;
		}

		case 'getOrders': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {
				currency_pair: currencyPair,
				status: 'open',
			};
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/orders',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			const currencyPair = this.getNodeParameter('currencyPair', i, '') as string;
			const qs: IDataObject = {};
			if (currencyPair) qs.currency_pair = currencyPair;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/spot/orders/${orderId}`,
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'cancelOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			const currencyPair = this.getNodeParameter('currencyPair', i, '') as string;
			const qs: IDataObject = {};
			if (currencyPair) qs.currency_pair = currencyPair;

			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/spot/orders/${orderId}`,
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'cancelOrders': {
			const orderIds = this.getNodeParameter('orderIds', i) as string;
			const ids = orderIds.split(',').map((id: string) => id.trim());
			const body = ids.map((id: string) => ({ id }));

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/spot/cancel_batch_orders',
				body,
				apiType: 'spot',
			});
			break;
		}

		case 'cancelAllOrders': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: '/spot/orders',
				qs: { currency_pair: currencyPair },
				apiType: 'spot',
			});
			break;
		}

		case 'batchPlaceOrders': {
			const ordersJson = this.getNodeParameter('ordersJson', i) as string;
			const orders = JSON.parse(ordersJson);

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/spot/batch_orders',
				body: orders,
				apiType: 'spot',
			});
			break;
		}

		case 'amendOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			const currencyPair = this.getNodeParameter('currencyPair', i, '') as string;
			const newPrice = this.getNodeParameter('newPrice', i, '') as string;
			const newAmount = this.getNodeParameter('newAmount', i, '') as string;

			const body: IDataObject = {};
			if (newPrice) body.price = newPrice;
			if (newAmount) body.amount = newAmount;
			if (currencyPair) body.currency_pair = currencyPair;

			responseData = await gateIoApiRequest.call(this, {
				method: 'PATCH',
				endpoint: `/spot/orders/${orderId}`,
				body,
				apiType: 'spot',
			});
			break;
		}

		case 'getMyTrades': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { currency_pair: currencyPair };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/my_trades',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getCountdownCancelAll': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/countdown_cancel_all',
				apiType: 'spot',
			});
			break;
		}

		case 'setCountdownCancelAll': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const timeout = this.getNodeParameter('timeout', i) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/spot/countdown_cancel_all',
				body: {
					currency_pair: currencyPair,
					timeout,
				},
				apiType: 'spot',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
