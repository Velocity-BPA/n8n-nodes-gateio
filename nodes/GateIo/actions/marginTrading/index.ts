/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const marginTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['marginTrading'],
			},
		},
		options: [
			{
				name: 'Borrow',
				value: 'borrow',
				description: 'Borrow funds',
				action: 'Borrow funds',
			},
			{
				name: 'Get Auto-Repay Status',
				value: 'getAutoRepayStatus',
				description: 'Get auto-repay status',
				action: 'Get auto repay status',
			},
			{
				name: 'Get Currency Pairs for Margin',
				value: 'getCurrencyPairsForMargin',
				description: 'Get supported margin pairs',
				action: 'Get supported margin pairs',
			},
			{
				name: 'Get Loan Records',
				value: 'getLoanRecords',
				description: 'Get loan records',
				action: 'Get loan records',
			},
			{
				name: 'Get Loans',
				value: 'getLoans',
				description: 'Get outstanding loans',
				action: 'Get outstanding loans',
			},
			{
				name: 'Get Margin Account Book',
				value: 'getMarginAccountBook',
				description: 'Get margin account book',
				action: 'Get margin account book',
			},
			{
				name: 'Get Margin Accounts',
				value: 'getMarginAccounts',
				description: 'Get margin accounts',
				action: 'Get margin accounts',
			},
			{
				name: 'Get Margin Funding Accounts',
				value: 'getMarginFundingAccounts',
				description: 'Get funding accounts',
				action: 'Get funding accounts',
			},
			{
				name: 'Get Max Borrowable',
				value: 'getMaxBorrowable',
				description: 'Get max borrowable amount',
				action: 'Get max borrowable amount',
			},
			{
				name: 'Get Max Transferable',
				value: 'getMaxTransferable',
				description: 'Get max transferable amount',
				action: 'Get max transferable amount',
			},
			{
				name: 'Get Repayment Records',
				value: 'getRepaymentRecords',
				description: 'Get repayment records',
				action: 'Get repayment records',
			},
			{
				name: 'Merge Loan',
				value: 'mergeLoan',
				description: 'Merge multiple loans',
				action: 'Merge multiple loans',
			},
			{
				name: 'Repay',
				value: 'repay',
				description: 'Repay loan',
				action: 'Repay loan',
			},
			{
				name: 'Update Auto-Repay',
				value: 'updateAutoRepay',
				description: 'Update auto-repay setting',
				action: 'Update auto repay setting',
			},
		],
		default: 'getMarginAccounts',
	},
];

export const marginTradingFields: INodeProperties[] = [
	// Currency Pair field
	{
		displayName: 'Currency Pair',
		name: 'currencyPair',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['borrow', 'getLoans', 'repay', 'getMaxTransferable', 'getMaxBorrowable', 'mergeLoan'],
			},
		},
		default: 'BTC_USDT',
		description: 'Currency pair (e.g., BTC_USDT)',
	},
	// Currency field
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['borrow', 'repay', 'getMaxTransferable', 'getMaxBorrowable', 'mergeLoan'],
			},
		},
		default: 'USDT',
		description: 'Currency name (e.g., USDT)',
	},
	// Borrow fields
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['borrow', 'repay'],
			},
		},
		default: '',
		description: 'Amount to borrow/repay',
	},
	// Repay fields
	{
		displayName: 'Loan ID',
		name: 'loanId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['repay'],
			},
		},
		default: '',
		description: 'Loan ID to repay (optional, repays all if not specified)',
	},
	{
		displayName: 'Repay Mode',
		name: 'repayMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['repay'],
			},
		},
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Partial', value: 'partial' },
		],
		default: 'all',
		description: 'Repayment mode',
	},
	// Auto-repay field
	{
		displayName: 'Auto-Repay Status',
		name: 'autoRepayStatus',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['marginTrading'],
				operation: ['updateAutoRepay'],
			},
		},
		default: true,
		description: 'Whether to enable auto-repay',
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
				resource: ['marginTrading'],
				operation: ['getMarginAccounts', 'getMarginAccountBook', 'getMarginFundingAccounts', 'getLoans', 'getLoanRecords', 'getRepaymentRecords'],
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
				displayName: 'Currency Pair',
				name: 'currencyPair',
				type: 'string',
				default: '',
				description: 'Filter by currency pair',
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

export async function executeMarginTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getMarginAccounts': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currencyPair) qs.currency_pair = additionalOptions.currencyPair;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/accounts',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getMarginAccountBook': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.currencyPair) qs.currency_pair = additionalOptions.currencyPair;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/account_book',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getMarginFundingAccounts': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/funding_accounts',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'updateAutoRepay': {
			const status = this.getNodeParameter('autoRepayStatus', i) as boolean;
			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/auto_repay',
				body: { status: status ? 'on' : 'off' },
				apiType: 'spot',
			});
			break;
		}

		case 'getAutoRepayStatus': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/auto_repay',
				apiType: 'spot',
			});
			break;
		}

		case 'getMaxTransferable': {
			const currency = this.getNodeParameter('currency', i) as string;
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/transferable',
				qs: { currency, currency_pair: currencyPair },
				apiType: 'spot',
			});
			break;
		}

		case 'getMaxBorrowable': {
			const currency = this.getNodeParameter('currency', i) as string;
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/borrowable',
				qs: { currency, currency_pair: currencyPair },
				apiType: 'spot',
			});
			break;
		}

		case 'getCurrencyPairsForMargin': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/currency_pairs',
				apiType: 'spot',
			});
			break;
		}

		case 'borrow': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/loans',
				body: {
					currency_pair: currencyPair,
					currency,
					amount,
				},
				apiType: 'spot',
			});
			break;
		}

		case 'getLoans': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { status: 'open' };
			if (additionalOptions.currencyPair) qs.currency_pair = additionalOptions.currencyPair;
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/loans',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'repay': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const loanId = this.getNodeParameter('loanId', i, '') as string;
			const repayMode = this.getNodeParameter('repayMode', i, 'all') as string;

			const body: IDataObject = {
				currency_pair: currencyPair,
				currency,
				amount,
				mode: repayMode,
			};
			if (loanId) body.loan_id = loanId;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/repayments',
				body,
				apiType: 'spot',
			});
			break;
		}

		case 'getRepaymentRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currencyPair) qs.currency_pair = additionalOptions.currencyPair;
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/repayments',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getLoanRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currencyPair) qs.currency_pair = additionalOptions.currencyPair;
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.page) qs.page = additionalOptions.page;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/loan_records',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'mergeLoan': {
			const currencyPair = this.getNodeParameter('currencyPair', i) as string;
			const currency = this.getNodeParameter('currency', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/merged_loans',
				body: {
					currency_pair: currencyPair,
					currency,
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
