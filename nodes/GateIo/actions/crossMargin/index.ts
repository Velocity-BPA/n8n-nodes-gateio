/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const crossMarginOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['crossMargin'],
			},
		},
		options: [
			{
				name: 'Create Cross Margin Loan',
				value: 'createCrossMarginLoan',
				description: 'Create cross margin loan',
				action: 'Create cross margin loan',
			},
			{
				name: 'Get Cross Margin Account',
				value: 'getCrossMarginAccount',
				description: 'Get cross margin account',
				action: 'Get cross margin account',
			},
			{
				name: 'Get Cross Margin Account Book',
				value: 'getCrossMarginAccountBook',
				description: 'Get account book',
				action: 'Get account book',
			},
			{
				name: 'Get Cross Margin Borrowable',
				value: 'getCrossMarginBorrowable',
				description: 'Get borrowable amount',
				action: 'Get borrowable amount',
			},
			{
				name: 'Get Cross Margin Currencies',
				value: 'getCrossMarginCurrencies',
				description: 'Get supported currencies',
				action: 'Get supported currencies',
			},
			{
				name: 'Get Cross Margin Currency Detail',
				value: 'getCrossMarginCurrencyDetail',
				description: 'Get currency detail',
				action: 'Get currency detail',
			},
			{
				name: 'Get Cross Margin Estimated Rate',
				value: 'getCrossMarginEstimatedRate',
				description: 'Get estimated rate',
				action: 'Get estimated rate',
			},
			{
				name: 'Get Cross Margin Interest Records',
				value: 'getCrossMarginInterestRecords',
				description: 'Get interest records',
				action: 'Get interest records',
			},
			{
				name: 'Get Cross Margin Loans',
				value: 'getCrossMarginLoans',
				description: 'Get cross margin loans',
				action: 'Get cross margin loans',
			},
			{
				name: 'Get Cross Margin Repayments',
				value: 'getCrossMarginRepayments',
				description: 'Get repayments',
				action: 'Get repayments',
			},
			{
				name: 'Get Loan Detail',
				value: 'getLoanDetail',
				description: 'Get loan detail',
				action: 'Get loan detail',
			},
			{
				name: 'Get Max Cross Margin Transferable',
				value: 'getMaxCrossMarginTransferable',
				description: 'Get max transferable',
				action: 'Get max transferable',
			},
			{
				name: 'Repay Cross Margin Loan',
				value: 'repayCrossMarginLoan',
				description: 'Repay loan',
				action: 'Repay loan',
			},
		],
		default: 'getCrossMarginAccount',
	},
];

export const crossMarginFields: INodeProperties[] = [
	// Currency field
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['crossMargin'],
				operation: [
					'getCrossMarginCurrencyDetail',
					'createCrossMarginLoan',
					'repayCrossMarginLoan',
					'getMaxCrossMarginTransferable',
					'getCrossMarginEstimatedRate',
					'getCrossMarginBorrowable',
				],
			},
		},
		default: 'USDT',
		description: 'Currency name (e.g., USDT)',
	},
	// Loan ID field
	{
		displayName: 'Loan ID',
		name: 'loanId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['crossMargin'],
				operation: ['getLoanDetail'],
			},
		},
		default: '',
		description: 'The loan ID',
	},
	// Amount field
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['crossMargin'],
				operation: ['createCrossMarginLoan', 'repayCrossMarginLoan'],
			},
		},
		default: '',
		description: 'Amount to borrow/repay',
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
				resource: ['crossMargin'],
				operation: ['getCrossMarginAccountBook', 'getCrossMarginLoans', 'getCrossMarginRepayments', 'getCrossMarginInterestRecords'],
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
];

export async function executeCrossMarginOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getCrossMarginCurrencies': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/currencies',
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginCurrencyDetail': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/margin/cross/currencies/${currency}`,
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginAccount': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/accounts',
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginAccountBook': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/account_book',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginLoans': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { status: 2 }; // Open loans
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/loans',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'createCrossMarginLoan': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/cross/loans',
				body: { currency, amount },
				apiType: 'spot',
			});
			break;
		}

		case 'getLoanDetail': {
			const loanId = this.getNodeParameter('loanId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/margin/cross/loans/${loanId}`,
				apiType: 'spot',
			});
			break;
		}

		case 'repayCrossMarginLoan': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/margin/cross/repayments',
				body: { currency, amount },
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginRepayments': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/repayments',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginInterestRecords': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.currency) qs.currency = additionalOptions.currency;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.offset) qs.offset = additionalOptions.offset;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/interest_records',
				qs,
				apiType: 'spot',
			});
			break;
		}

		case 'getMaxCrossMarginTransferable': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/transferable',
				qs: { currency },
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginEstimatedRate': {
			const currencies = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/estimate_rate',
				qs: { currencies: currencies.split(',').map((c: string) => c.trim()) },
				apiType: 'spot',
			});
			break;
		}

		case 'getCrossMarginBorrowable': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/margin/cross/borrowable',
				qs: { currency },
				apiType: 'spot',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
