/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const unifiedAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
			},
		},
		options: [
			{
				name: 'Borrow Unified',
				value: 'borrowUnified',
				description: 'Borrow funds in unified account',
				action: 'Borrow funds in unified account',
			},
			{
				name: 'Get Unified Accounts',
				value: 'getUnifiedAccounts',
				description: 'Get unified account info',
				action: 'Get unified account info',
			},
			{
				name: 'Get Unified Borrowable',
				value: 'getUnifiedBorrowable',
				description: 'Get borrowable amount',
				action: 'Get borrowable amount',
			},
			{
				name: 'Get Unified Interest Records',
				value: 'getUnifiedInterestRecords',
				description: 'Get interest records',
				action: 'Get interest records',
			},
			{
				name: 'Get Unified Leverage',
				value: 'getUnifiedLeverage',
				description: 'Get leverage settings',
				action: 'Get leverage settings',
			},
			{
				name: 'Get Unified Loan Records',
				value: 'getUnifiedLoanRecords',
				description: 'Get unified loan records',
				action: 'Get unified loan records',
			},
			{
				name: 'Get Unified Loans',
				value: 'getUnifiedLoans',
				description: 'Get current unified loans',
				action: 'Get current unified loans',
			},
			{
				name: 'Get Unified Risk Limit',
				value: 'getUnifiedRiskLimit',
				description: 'Get risk unit info',
				action: 'Get risk unit info',
			},
			{
				name: 'Get Unified Transferable',
				value: 'getUnifiedTransferable',
				description: 'Get transferable amount',
				action: 'Get transferable amount',
			},
			{
				name: 'Repay Unified',
				value: 'repayUnified',
				description: 'Repay unified loan',
				action: 'Repay unified loan',
			},
			{
				name: 'Set Unified Leverage',
				value: 'setUnifiedLeverage',
				description: 'Set currency leverage',
				action: 'Set currency leverage',
			},
		],
		default: 'getUnifiedAccounts',
	},
];

export const unifiedAccountFields: INodeProperties[] = [
	// Currency field for multiple operations
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: [
					'getUnifiedBorrowable',
					'getUnifiedTransferable',
					'borrowUnified',
					'repayUnified',
					'setUnifiedLeverage',
					'getUnifiedLeverage',
				],
			},
		},
		default: 'USDT',
		description: 'Currency name (e.g., BTC, USDT)',
	},
	// Amount for borrow/repay
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: ['borrowUnified', 'repayUnified'],
			},
		},
		default: '',
		description: 'Amount to borrow or repay',
	},
	// Repay all flag
	{
		displayName: 'Repay All',
		name: 'repayAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: ['repayUnified'],
			},
		},
		default: false,
		description: 'Whether to repay all outstanding debt',
	},
	// Leverage for setUnifiedLeverage
	{
		displayName: 'Leverage',
		name: 'leverage',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: ['setUnifiedLeverage'],
			},
		},
		default: 1,
		description: 'Leverage value (1-100)',
	},
	// Type filter for loans/records
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: ['getUnifiedLoanRecords'],
			},
		},
		options: [
			{ name: 'All', value: '' },
			{ name: 'Borrow', value: 'borrow' },
			{ name: 'Repay', value: 'repay' },
		],
		default: '',
		description: 'Record type filter',
	},
	// Currency filter (optional)
	{
		displayName: 'Currency Filter',
		name: 'currencyFilter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: [
					'getUnifiedAccounts',
					'getUnifiedLoans',
					'getUnifiedLoanRecords',
					'getUnifiedInterestRecords',
				],
			},
		},
		default: '',
		description: 'Filter by currency (optional)',
	},
	// Limit
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['unifiedAccount'],
				operation: ['getUnifiedLoanRecords', 'getUnifiedInterestRecords'],
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
				resource: ['unifiedAccount'],
				operation: ['getUnifiedLoanRecords', 'getUnifiedInterestRecords'],
			},
		},
		default: 0,
		description: 'Offset for pagination',
	},
];

export async function executeUnifiedAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getUnifiedAccounts': {
			const currencyFilter = this.getNodeParameter('currencyFilter', i, '') as string;
			const qs: IDataObject = {};
			if (currencyFilter) {
				qs.currency = currencyFilter;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/accounts',
				qs,
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedBorrowable': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/borrowable',
				qs: { currency },
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedTransferable': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/transferable',
				qs: { currency },
				apiType: 'unified',
			});
			break;
		}

		case 'borrowUnified': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/unified/loans',
				body: {
					currency,
					amount,
				},
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedLoans': {
			const currencyFilter = this.getNodeParameter('currencyFilter', i, '') as string;
			const qs: IDataObject = {};
			if (currencyFilter) {
				qs.currency = currencyFilter;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/loans',
				qs,
				apiType: 'unified',
			});
			break;
		}

		case 'repayUnified': {
			const currency = this.getNodeParameter('currency', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const repayAll = this.getNodeParameter('repayAll', i, false) as boolean;

			const body: IDataObject = {
				currency,
			};

			if (repayAll) {
				body.repay_all = true;
			} else {
				body.amount = amount;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/unified/loans',
				body,
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedLoanRecords': {
			const type = this.getNodeParameter('type', i, '') as string;
			const currencyFilter = this.getNodeParameter('currencyFilter', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = { limit, offset };
			if (type) {
				qs.type = type;
			}
			if (currencyFilter) {
				qs.currency = currencyFilter;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/loan_records',
				qs,
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedInterestRecords': {
			const currencyFilter = this.getNodeParameter('currencyFilter', i, '') as string;
			const limit = this.getNodeParameter('limit', i, 100) as number;
			const offset = this.getNodeParameter('offset', i, 0) as number;

			const qs: IDataObject = { limit, offset };
			if (currencyFilter) {
				qs.currency = currencyFilter;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/interest_records',
				qs,
				apiType: 'unified',
			});
			break;
		}

		case 'setUnifiedLeverage': {
			const currency = this.getNodeParameter('currency', i) as string;
			const leverage = this.getNodeParameter('leverage', i) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/unified/leverage/user_currency_config',
				body: {
					currency,
					leverage: leverage.toString(),
				},
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedLeverage': {
			const currency = this.getNodeParameter('currency', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/leverage/user_currency_config',
				qs: { currency },
				apiType: 'unified',
			});
			break;
		}

		case 'getUnifiedRiskLimit': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/unified/risk_units',
				apiType: 'unified',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
