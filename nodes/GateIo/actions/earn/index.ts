/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const earnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['earn'],
			},
		},
		options: [
			{
				name: 'Get Dual Investment Orders',
				value: 'getDualInvestmentOrders',
				description: 'Get dual investment orders',
				action: 'Get dual investment orders',
			},
			{
				name: 'Get Dual Investment Products',
				value: 'getDualInvestmentProducts',
				description: 'Get dual investment products',
				action: 'Get dual investment products',
			},
			{
				name: 'Get Structured Orders',
				value: 'getStructuredOrders',
				description: 'Get structured product orders',
				action: 'Get structured product orders',
			},
			{
				name: 'Get Structured Products',
				value: 'getStructuredProducts',
				description: 'Get structured products',
				action: 'Get structured products',
			},
			{
				name: 'Place Dual Investment Order',
				value: 'placeDualInvestmentOrder',
				description: 'Place a dual investment order',
				action: 'Place a dual investment order',
			},
			{
				name: 'Place Structured Order',
				value: 'placeStructuredOrder',
				description: 'Place a structured product order',
				action: 'Place a structured product order',
			},
		],
		default: 'getDualInvestmentProducts',
	},
];

export const earnFields: INodeProperties[] = [
	// Plan ID for orders
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['placeDualInvestmentOrder', 'placeStructuredOrder'],
			},
		},
		default: '',
		description: 'Investment plan ID',
	},
	// Amount
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['placeDualInvestmentOrder', 'placeStructuredOrder'],
			},
		},
		default: '',
		description: 'Investment amount',
	},
	// Dual Investment specific fields
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getDualInvestmentProducts'],
			},
		},
		default: '',
		description: 'Filter by currency (e.g., BTC)',
	},
	// Structured product type
	{
		displayName: 'Product Type',
		name: 'productType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getStructuredProducts', 'getStructuredOrders'],
			},
		},
		options: [
			{ name: 'Shark Fin', value: 'SharkFin' },
			{ name: 'Snowball', value: 'Snowball' },
			{ name: 'Range Accrual', value: 'RangeAccrual' },
		],
		default: 'SharkFin',
		description: 'Structured product type',
	},
	// Status filter
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: ['getStructuredOrders', 'getDualInvestmentOrders'],
			},
		},
		options: [
			{ name: 'All', value: '' },
			{ name: 'In Progress', value: 'in_progress' },
			{ name: 'Completed', value: 'completed' },
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
				resource: ['earn'],
				operation: [
					'getDualInvestmentProducts',
					'getDualInvestmentOrders',
					'getStructuredProducts',
					'getStructuredOrders',
				],
			},
		},
		default: 100,
		description: 'Maximum number of records to return',
	},
	// Offset for pagination
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['earn'],
				operation: [
					'getDualInvestmentProducts',
					'getDualInvestmentOrders',
					'getStructuredProducts',
					'getStructuredOrders',
				],
			},
		},
		default: 0,
		description: 'Offset for pagination',
	},
];

export async function executeEarnOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getDualInvestmentProducts': {
			const currency = this.getNodeParameter('currency', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = { limit, offset };
			if (currency) {
				qs.currency = currency;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/earn/dual/plans',
				qs,
				apiType: 'earn',
			});
			break;
		}

		case 'getDualInvestmentOrders': {
			const status = this.getNodeParameter('status', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = { limit, offset };
			if (status) {
				qs.status = status;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/earn/dual/orders',
				qs,
				apiType: 'earn',
			});
			break;
		}

		case 'placeDualInvestmentOrder': {
			const planId = this.getNodeParameter('planId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/earn/dual/orders',
				body: {
					plan_id: planId,
					amount,
				},
				apiType: 'earn',
			});
			break;
		}

		case 'getStructuredProducts': {
			const productType = this.getNodeParameter('productType', i, 'SharkFin') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/earn/structured/products',
				qs: {
					type: productType,
					limit,
					offset,
				},
				apiType: 'earn',
			});
			break;
		}

		case 'getStructuredOrders': {
			const productType = this.getNodeParameter('productType', i, 'SharkFin') as string;
			const status = this.getNodeParameter('status', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = {
				type: productType,
				limit,
				offset,
			};
			if (status) {
				qs.status = status;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/earn/structured/orders',
				qs,
				apiType: 'earn',
			});
			break;
		}

		case 'placeStructuredOrder': {
			const planId = this.getNodeParameter('planId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/earn/structured/orders',
				body: {
					pid: planId,
					amount,
				},
				apiType: 'earn',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
