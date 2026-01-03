/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Convert Small Balance',
				value: 'convertSmallBalance',
				description: 'Convert small balance to GT',
				action: 'Convert small balance to GT',
			},
			{
				name: 'Get Account Balance',
				value: 'getAccountBalance',
				description: 'Get account total balance',
				action: 'Get account total balance',
			},
			{
				name: 'Get Account Detail',
				value: 'getAccountDetail',
				description: 'Get account details',
				action: 'Get account details',
			},
			{
				name: 'Get Account Rate Limit',
				value: 'getAccountRateLimit',
				description: 'Get rate limit info',
				action: 'Get rate limit info',
			},
			{
				name: 'Get Saved Address',
				value: 'getSavedAddress',
				description: 'Get saved withdrawal addresses',
				action: 'Get saved withdrawal addresses',
			},
			{
				name: 'Get Small Balance',
				value: 'getSmallBalance',
				description: 'Get small balance assets',
				action: 'Get small balance assets',
			},
			{
				name: 'Get Trading Fee',
				value: 'getTradingFee',
				description: 'Get trading fee rates',
				action: 'Get trading fee rates',
			},
			{
				name: 'Get Withdraw Status',
				value: 'getWithdrawStatus',
				description: 'Get withdrawal status and limits',
				action: 'Get withdrawal status and limits',
			},
		],
		default: 'getAccountDetail',
	},
];

export const accountFields: INodeProperties[] = [
	// Get Saved Address fields
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getSavedAddress', 'getWithdrawStatus'],
			},
		},
		default: 'BTC',
		description: 'Currency name (e.g., BTC, ETH)',
	},
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getSavedAddress'],
			},
		},
		default: '',
		description: 'Chain name (optional)',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getSavedAddress'],
			},
		},
		default: 50,
		description: 'Maximum number of records to return',
	},
	// Get Trading Fee fields
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTradingFee'],
			},
		},
		default: '',
		description: 'Currency pair (e.g., BTC_USDT)',
	},
	// Convert Small Balance fields
	{
		displayName: 'Currencies',
		name: 'currencies',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['convertSmallBalance'],
			},
		},
		default: '',
		description: 'Comma-separated list of currencies to convert',
	},
];

export async function executeAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getAccountDetail': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/account/detail',
				apiType: 'account',
			});
			break;
		}

		case 'getAccountBalance': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/total_balance',
				apiType: 'wallet',
			});
			break;
		}

		case 'getSmallBalance': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/small_balance',
				apiType: 'wallet',
			});
			break;
		}

		case 'convertSmallBalance': {
			const currencies = this.getNodeParameter('currencies', i, '') as string;
			const body: IDataObject = {};
			if (currencies) {
				body.currency = currencies.split(',').map((c: string) => c.trim());
			}
			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/wallet/small_balance',
				body,
				apiType: 'wallet',
			});
			break;
		}

		case 'getAccountRateLimit': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/account/rate_limit',
				apiType: 'account',
			});
			break;
		}

		case 'getSavedAddress': {
			const currency = this.getNodeParameter('currency', i) as string;
			const chain = this.getNodeParameter('chain', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 50) as number;

			const qs: IDataObject = {
				currency,
				limit,
			};
			if (chain) {
				qs.chain = chain;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/saved_address',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getTradingFee': {
			const currencyPair = this.getNodeParameter('currencyPair', i, '') as string;
			const qs: IDataObject = {};
			if (currencyPair) {
				qs.currency_pair = currencyPair;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/fee',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getWithdrawStatus': {
			const currency = this.getNodeParameter('currency', i, '') as string;
			const qs: IDataObject = {};
			if (currency) {
				qs.currency = currency;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/withdraw_status',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
