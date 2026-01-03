/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const walletOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
			},
		},
		options: [
			{
				name: 'Cancel Withdraw',
				value: 'cancelWithdraw',
				description: 'Cancel a withdrawal',
				action: 'Cancel a withdrawal',
			},
			{
				name: 'Get Currency Chains',
				value: 'getCurrencyChains',
				description: 'Get supported chains for currency',
				action: 'Get supported chains for currency',
			},
			{
				name: 'Get Deposit Address',
				value: 'getDepositAddress',
				description: 'Get deposit address',
				action: 'Get deposit address',
			},
			{
				name: 'Get Deposit Records',
				value: 'getDepositRecords',
				description: 'Get deposit records',
				action: 'Get deposit records',
			},
			{
				name: 'Get Sub-Account Balances',
				value: 'getSubAccountBalances',
				description: 'Get sub-account balances',
				action: 'Get sub account balances',
			},
			{
				name: 'Get Sub-Account Transfers',
				value: 'getSubAccountTransfers',
				description: 'Get sub-account transfers',
				action: 'Get sub account transfers',
			},
			{
				name: 'Get Total Balance',
				value: 'getTotalBalance',
				description: 'Get total estimated balance',
				action: 'Get total estimated balance',
			},
			{
				name: 'Get Transfer Records',
				value: 'getTransferRecords',
				description: 'Get transfer records',
				action: 'Get transfer records',
			},
			{
				name: 'Get Withdrawal Records',
				value: 'getWithdrawalRecords',
				description: 'Get withdrawal records',
				action: 'Get withdrawal records',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer between accounts',
				action: 'Transfer between accounts',
			},
			{
				name: 'Withdraw',
				value: 'withdraw',
				description: 'Withdraw funds',
				action: 'Withdraw funds',
			},
		],
		default: 'getDepositAddress',
	},
];

export const walletFields: INodeProperties[] = [
	// Currency field
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getCurrencyChains', 'getDepositAddress', 'withdraw', 'transfer'],
			},
		},
		default: 'BTC',
		description: 'Currency name (e.g., BTC, ETH)',
	},
	// Chain field
	{
		displayName: 'Chain',
		name: 'chain',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getDepositAddress', 'withdraw'],
			},
		},
		default: '',
		description: 'Chain name (optional for multi-chain currencies)',
	},
	// Withdraw fields
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['withdraw', 'transfer'],
			},
		},
		default: '',
		description: 'Withdrawal/transfer amount',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['withdraw'],
			},
		},
		default: '',
		description: 'Withdrawal address',
	},
	{
		displayName: 'Memo',
		name: 'memo',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['withdraw'],
			},
		},
		default: '',
		description: 'Memo/tag for withdrawal (required for some currencies)',
	},
	// Cancel Withdraw fields
	{
		displayName: 'Withdrawal ID',
		name: 'withdrawalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['cancelWithdraw'],
			},
		},
		default: '',
		description: 'The withdrawal ID to cancel',
	},
	// Transfer fields
	{
		displayName: 'From Account',
		name: 'from',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['transfer'],
			},
		},
		options: [
			{ name: 'Spot', value: 'spot' },
			{ name: 'Margin', value: 'margin' },
			{ name: 'Futures', value: 'futures' },
			{ name: 'Delivery', value: 'delivery' },
			{ name: 'Cross Margin', value: 'cross_margin' },
			{ name: 'Options', value: 'options' },
		],
		default: 'spot',
		description: 'Source account type',
	},
	{
		displayName: 'To Account',
		name: 'to',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['transfer'],
			},
		},
		options: [
			{ name: 'Spot', value: 'spot' },
			{ name: 'Margin', value: 'margin' },
			{ name: 'Futures', value: 'futures' },
			{ name: 'Delivery', value: 'delivery' },
			{ name: 'Cross Margin', value: 'cross_margin' },
			{ name: 'Options', value: 'options' },
		],
		default: 'futures',
		description: 'Destination account type',
	},
	{
		displayName: 'Settle Currency',
		name: 'settle',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['transfer'],
			},
		},
		options: [
			{ name: 'USDT', value: 'usdt' },
			{ name: 'BTC', value: 'btc' },
		],
		default: 'usdt',
		description: 'Settle currency (required for futures/delivery)',
	},
	// Records filters
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getDepositRecords', 'getWithdrawalRecords', 'getTransferRecords'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Filter by currency',
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
				displayName: 'To',
				name: 'to',
				type: 'dateTime',
				default: '',
				description: 'End time',
			},
		],
	},
	// Sub-account fields
	{
		displayName: 'Sub-Account User ID',
		name: 'subUid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getSubAccountBalances', 'getSubAccountTransfers'],
			},
		},
		default: '',
		description: 'Sub-account user ID (optional)',
	},
	// Total balance currency
	{
		displayName: 'Currency',
		name: 'totalBalanceCurrency',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['getTotalBalance'],
			},
		},
		default: 'USDT',
		description: 'Currency for total balance estimation',
	},
];

export async function executeWalletOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCurrencyChains': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/wallet/currency_chains`,
				qs: { currency },
				apiType: 'wallet',
			});
			break;
		}

		case 'getDepositAddress': {
			const currency = this.getNodeParameter('currency', i) as string;
			const chain = this.getNodeParameter('chain', i, '') as string;
			const qs: IDataObject = { currency };
			if (chain) {
				qs.chain = chain;
			}
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/deposit_address',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'withdraw': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const address = this.getNodeParameter('address', i) as string;
			const chain = this.getNodeParameter('chain', i, '') as string;
			const memo = this.getNodeParameter('memo', i, '') as string;

			const body: IDataObject = {
				currency,
				amount,
				address,
			};
			if (chain) body.chain = chain;
			if (memo) body.memo = memo;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/withdrawals',
				body,
				apiType: 'wallet',
			});
			break;
		}

		case 'cancelWithdraw': {
			const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/withdrawals/${withdrawalId}`,
				apiType: 'wallet',
			});
			break;
		}

		case 'getWithdrawalRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/withdrawals',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getDepositRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/deposits',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'transfer': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const from = this.getNodeParameter('from', i) as string;
			const to = this.getNodeParameter('to', i) as string;
			const settle = this.getNodeParameter('settle', i, '') as string;

			const body: IDataObject = {
				currency,
				amount,
				from,
				to,
			};
			if (settle && (from === 'futures' || to === 'futures' || from === 'delivery' || to === 'delivery')) {
				body.settle = settle;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/wallet/transfers',
				body,
				apiType: 'wallet',
			});
			break;
		}

		case 'getTransferRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/transfers',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getSubAccountTransfers': {
			const subUid = this.getNodeParameter('subUid', i, '') as string;
			const qs: IDataObject = {};
			if (subUid) qs.sub_uid = subUid;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/sub_account_transfers',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getSubAccountBalances': {
			const subUid = this.getNodeParameter('subUid', i, '') as string;
			const qs: IDataObject = {};
			if (subUid) qs.sub_uid = subUid;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/sub_account_balances',
				qs,
				apiType: 'wallet',
			});
			break;
		}

		case 'getTotalBalance': {
			const currency = this.getNodeParameter('totalBalanceCurrency', i, 'USDT') as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/wallet/total_balance',
				qs: { currency },
				apiType: 'wallet',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
