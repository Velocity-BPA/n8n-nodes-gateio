/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';
import { CANDLESTICK_INTERVALS } from '../../constants';

export const futuresTradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
			},
		},
		options: [
			{
				name: 'Get Contract Detail',
				value: 'getContractDetail',
				description: 'Get contract details',
				action: 'Get contract details',
			},
			{
				name: 'Get Contract Stats',
				value: 'getContractStats',
				description: 'Get contract statistics',
				action: 'Get contract statistics',
			},
			{
				name: 'Get Contracts',
				value: 'getContracts',
				description: 'Get all contracts',
				action: 'Get all contracts',
			},
			{
				name: 'Get Funding Rate',
				value: 'getFundingRate',
				description: 'Get current funding rate',
				action: 'Get current funding rate',
			},
			{
				name: 'Get Funding Rate History',
				value: 'getFundingRateHistory',
				description: 'Get funding rate history',
				action: 'Get funding rate history',
			},
			{
				name: 'Get Futures Candlesticks',
				value: 'getFuturesCandlesticks',
				description: 'Get candlesticks',
				action: 'Get candlesticks',
			},
			{
				name: 'Get Futures Order Book',
				value: 'getFuturesOrderBook',
				description: 'Get order book',
				action: 'Get order book',
			},
			{
				name: 'Get Futures Premium Index',
				value: 'getFuturesPremiumIndex',
				description: 'Get premium index',
				action: 'Get premium index',
			},
			{
				name: 'Get Futures Tickers',
				value: 'getFuturesTickers',
				description: 'Get tickers',
				action: 'Get tickers',
			},
			{
				name: 'Get Futures Trades',
				value: 'getFuturesTrades',
				description: 'Get trades',
				action: 'Get trades',
			},
			{
				name: 'Get Index Constituents',
				value: 'getIndexConstituents',
				description: 'Get index constituents',
				action: 'Get index constituents',
			},
			{
				name: 'Get Insurance Balance',
				value: 'getInsuranceBalance',
				description: 'Get insurance fund balance',
				action: 'Get insurance fund balance',
			},
			{
				name: 'Get Liquidation History',
				value: 'getLiquidationHistory',
				description: 'Get liquidation history',
				action: 'Get liquidation history',
			},
		],
		default: 'getContracts',
	},
];

export const futuresTradingFields: INodeProperties[] = [
	// Settle currency
	{
		displayName: 'Settle Currency',
		name: 'settle',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
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
				resource: ['futuresTrading'],
				operation: [
					'getContractDetail',
					'getFuturesOrderBook',
					'getFuturesTrades',
					'getFuturesCandlesticks',
					'getFuturesPremiumIndex',
					'getFundingRate',
					'getFundingRateHistory',
					'getContractStats',
					'getIndexConstituents',
					'getLiquidationHistory',
				],
			},
		},
		default: 'BTC_USDT',
		description: 'Futures contract name (e.g., BTC_USDT)',
	},
	// Candlestick interval
	{
		displayName: 'Interval',
		name: 'interval',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['futuresTrading'],
				operation: ['getFuturesCandlesticks'],
			},
		},
		options: CANDLESTICK_INTERVALS,
		default: '1h',
		description: 'Candlestick interval',
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
				resource: ['futuresTrading'],
				operation: [
					'getFuturesOrderBook',
					'getFuturesTrades',
					'getFuturesCandlesticks',
					'getFuturesTickers',
					'getFundingRateHistory',
					'getLiquidationHistory',
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
				displayName: 'To',
				name: 'to',
				type: 'dateTime',
				default: '',
				description: 'End time',
			},
		],
	},
];

export async function executeFuturesTradingOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const settle = this.getNodeParameter('settle', i) as string;

	switch (operation) {
		case 'getContracts': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/contracts`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getContractDetail': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/contracts/${contract}`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesOrderBook': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/order_book`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesTrades': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/trades`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesCandlesticks': {
			const contract = this.getNodeParameter('contract', i) as string;
			const interval = this.getNodeParameter('interval', i, '1h') as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract, interval };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/candlesticks`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesPremiumIndex': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/premium_index`,
				qs: { contract },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesTickers': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.contract) qs.contract = additionalOptions.contract;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/tickers`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFundingRate': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/funding_rate`,
				qs: { contract },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFundingRateHistory': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/funding_rate`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getInsuranceBalance': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/insurance`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getContractStats': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/contract_stats`,
				qs: { contract },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getIndexConstituents': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/index_constituents/${contract}`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getLiquidationHistory': {
			const contract = this.getNodeParameter('contract', i) as string;
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = { contract };
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/liq_orders`,
				qs,
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
