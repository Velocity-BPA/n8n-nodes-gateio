/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const flashSwapOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['flashSwap'],
			},
		},
		options: [
			{
				name: 'Create Flash Swap',
				value: 'createFlashSwap',
				description: 'Create a flash swap order',
				action: 'Create a flash swap order',
			},
			{
				name: 'Get Flash Swap Currencies',
				value: 'getFlashSwapCurrencies',
				description: 'Get supported flash swap currencies',
				action: 'Get supported flash swap currencies',
			},
			{
				name: 'Get Flash Swap Currency Pairs',
				value: 'getFlashSwapCurrencyPairs',
				description: 'Get available flash swap pairs',
				action: 'Get available flash swap pairs',
			},
			{
				name: 'Get Flash Swap Order Detail',
				value: 'getFlashSwapOrderDetail',
				description: 'Get flash swap order details',
				action: 'Get flash swap order details',
			},
			{
				name: 'Get Flash Swap Orders',
				value: 'getFlashSwapOrders',
				description: 'Get flash swap orders',
				action: 'Get flash swap orders',
			},
			{
				name: 'Preview Flash Swap',
				value: 'previewFlashSwap',
				description: 'Preview flash swap quote',
				action: 'Preview flash swap quote',
			},
		],
		default: 'getFlashSwapCurrencies',
	},
];

export const flashSwapFields: INodeProperties[] = [
	// Sell currency
	{
		displayName: 'Sell Currency',
		name: 'sellCurrency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['previewFlashSwap', 'createFlashSwap'],
			},
		},
		default: '',
		description: 'Currency to sell (e.g., BTC)',
	},
	// Buy currency
	{
		displayName: 'Buy Currency',
		name: 'buyCurrency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['previewFlashSwap', 'createFlashSwap'],
			},
		},
		default: '',
		description: 'Currency to buy (e.g., USDT)',
	},
	// Sell amount
	{
		displayName: 'Sell Amount',
		name: 'sellAmount',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['previewFlashSwap', 'createFlashSwap'],
			},
		},
		default: '',
		description: 'Amount to sell (leave empty if specifying buy amount)',
	},
	// Buy amount
	{
		displayName: 'Buy Amount',
		name: 'buyAmount',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['previewFlashSwap', 'createFlashSwap'],
			},
		},
		default: '',
		description: 'Amount to buy (leave empty if specifying sell amount)',
	},
	// Preview token for create
	{
		displayName: 'Preview Token',
		name: 'previewToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['createFlashSwap'],
			},
		},
		default: '',
		description: 'Preview token from previewFlashSwap operation',
	},
	// Order ID
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['getFlashSwapOrderDetail'],
			},
		},
		default: '',
		description: 'Flash swap order ID',
	},
	// Currency filter
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['getFlashSwapCurrencyPairs'],
			},
		},
		default: '',
		description: 'Filter by currency',
	},
	// Status filter
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['getFlashSwapOrders'],
			},
		},
		options: [
			{ name: 'All', value: '' },
			{ name: 'Success', value: '1' },
			{ name: 'Failed', value: '2' },
		],
		default: '',
		description: 'Order status filter',
	},
	// Limit
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['getFlashSwapOrders'],
			},
		},
		default: 100,
		description: 'Maximum number of records to return',
	},
	// Offset
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['flashSwap'],
				operation: ['getFlashSwapOrders'],
			},
		},
		default: 0,
		description: 'Offset for pagination',
	},
];

export async function executeFlashSwapOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getFlashSwapCurrencies': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/flash_swap/currencies',
				apiType: 'flashSwap',
			});
			break;
		}

		case 'getFlashSwapCurrencyPairs': {
			const currency = this.getNodeParameter('currency', i, '') as string;
			const qs: IDataObject = {};
			if (currency) {
				qs.currency = currency;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/flash_swap/currency_pairs',
				qs,
				apiType: 'flashSwap',
			});
			break;
		}

		case 'previewFlashSwap': {
			const sellCurrency = this.getNodeParameter('sellCurrency', i) as string;
			const buyCurrency = this.getNodeParameter('buyCurrency', i) as string;
			const sellAmount = this.getNodeParameter('sellAmount', i, '') as string;
			const buyAmount = this.getNodeParameter('buyAmount', i, '') as string;

			const body: IDataObject = {
				sell_currency: sellCurrency,
				buy_currency: buyCurrency,
			};

			if (sellAmount) {
				body.sell_amount = sellAmount;
			}
			if (buyAmount) {
				body.buy_amount = buyAmount;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/flash_swap/orders/preview',
				body,
				apiType: 'flashSwap',
			});
			break;
		}

		case 'createFlashSwap': {
			const sellCurrency = this.getNodeParameter('sellCurrency', i) as string;
			const buyCurrency = this.getNodeParameter('buyCurrency', i) as string;
			const sellAmount = this.getNodeParameter('sellAmount', i, '') as string;
			const buyAmount = this.getNodeParameter('buyAmount', i, '') as string;
			const previewToken = this.getNodeParameter('previewToken', i) as string;

			const body: IDataObject = {
				sell_currency: sellCurrency,
				buy_currency: buyCurrency,
				preview_id: previewToken,
			};

			if (sellAmount) {
				body.sell_amount = sellAmount;
			}
			if (buyAmount) {
				body.buy_amount = buyAmount;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/flash_swap/orders',
				body,
				apiType: 'flashSwap',
			});
			break;
		}

		case 'getFlashSwapOrders': {
			const status = this.getNodeParameter('status', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = { limit, offset };
			if (status) {
				qs.status = status;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/flash_swap/orders',
				qs,
				apiType: 'flashSwap',
			});
			break;
		}

		case 'getFlashSwapOrderDetail': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/flash_swap/orders/${orderId}`,
				apiType: 'flashSwap',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
