/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { gateIoApiRequestPoll } from './transport/gateIoApi';

// Licensing notice - logged once per node load
const LICENSING_NOTICE = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

export class GateIoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gate.io Trigger',
		name: 'gateIoTrigger',
		icon: 'file:gateio.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when events occur on Gate.io exchange',
		defaults: {
			name: 'Gate.io Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'gateIoApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Deposit Received',
						value: 'depositReceived',
						description: 'Trigger when a deposit is received',
					},
					{
						name: 'Funding Payment',
						value: 'fundingPayment',
						description: 'Trigger when funding payment is received',
					},
					{
						name: 'Futures Order Filled',
						value: 'futuresOrderFilled',
						description: 'Trigger when a futures order is filled',
					},
					{
						name: 'Liquidation Warning',
						value: 'liquidationWarning',
						description: 'Trigger when position is near liquidation',
					},
					{
						name: 'New Futures Order',
						value: 'newFuturesOrder',
						description: 'Trigger when a new futures order is placed',
					},
					{
						name: 'New Spot Order',
						value: 'newSpotOrder',
						description: 'Trigger when a new spot order is placed',
					},
					{
						name: 'Position Changed',
						value: 'positionChanged',
						description: 'Trigger when position is updated',
					},
					{
						name: 'Price Alert',
						value: 'priceAlert',
						description: 'Trigger when price crosses threshold',
					},
					{
						name: 'Spot Order Filled',
						value: 'spotOrderFilled',
						description: 'Trigger when a spot order is filled',
					},
					{
						name: 'Withdrawal Completed',
						value: 'withdrawalCompleted',
						description: 'Trigger when withdrawal is completed',
					},
				],
				default: 'newSpotOrder',
			},
			// Currency pair for spot triggers
			{
				displayName: 'Currency Pair',
				name: 'currencyPair',
				type: 'string',
				displayOptions: {
					show: {
						event: ['newSpotOrder', 'spotOrderFilled', 'priceAlert'],
					},
				},
				default: 'BTC_USDT',
				description: 'Currency pair to monitor (e.g., BTC_USDT)',
			},
			// Contract for futures triggers
			{
				displayName: 'Contract',
				name: 'contract',
				type: 'string',
				displayOptions: {
					show: {
						event: [
							'newFuturesOrder',
							'futuresOrderFilled',
							'positionChanged',
							'fundingPayment',
							'liquidationWarning',
						],
					},
				},
				default: 'BTC_USDT',
				description: 'Futures contract to monitor (e.g., BTC_USDT)',
			},
			// Settle currency for futures
			{
				displayName: 'Settle Currency',
				name: 'settle',
				type: 'options',
				displayOptions: {
					show: {
						event: [
							'newFuturesOrder',
							'futuresOrderFilled',
							'positionChanged',
							'fundingPayment',
							'liquidationWarning',
						],
					},
				},
				options: [
					{ name: 'USDT', value: 'usdt' },
					{ name: 'BTC', value: 'btc' },
				],
				default: 'usdt',
				description: 'Settlement currency',
			},
			// Currency for deposit/withdrawal
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				displayOptions: {
					show: {
						event: ['depositReceived', 'withdrawalCompleted'],
					},
				},
				default: '',
				description: 'Currency to monitor (leave empty for all)',
			},
			// Price alert threshold
			{
				displayName: 'Price Threshold',
				name: 'priceThreshold',
				type: 'number',
				displayOptions: {
					show: {
						event: ['priceAlert'],
					},
				},
				default: 0,
				description: 'Price threshold to trigger alert',
			},
			{
				displayName: 'Threshold Direction',
				name: 'thresholdDirection',
				type: 'options',
				displayOptions: {
					show: {
						event: ['priceAlert'],
					},
				},
				options: [
					{ name: 'Above', value: 'above' },
					{ name: 'Below', value: 'below' },
					{ name: 'Cross', value: 'cross' },
				],
				default: 'above',
				description: 'Direction for price alert',
			},
			// Liquidation warning threshold
			{
				displayName: 'Risk Threshold (%)',
				name: 'riskThreshold',
				type: 'number',
				displayOptions: {
					show: {
						event: ['liquidationWarning'],
					},
				},
				default: 80,
				description: 'Margin ratio threshold percentage for liquidation warning',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const event = this.getNodeParameter('event') as string;
		const webhookData = this.getWorkflowStaticData('node');
		const now = Math.floor(Date.now() / 1000);
		const lastPollTime = (webhookData.lastPollTime as number) || now - 300;

		let responseData: IDataObject[] = [];

		try {
			switch (event) {
				case 'newSpotOrder':
				case 'spotOrderFilled': {
					const currencyPair = this.getNodeParameter('currencyPair') as string;
					const status = event === 'spotOrderFilled' ? 'finished' : 'open';

					const orders = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: '/spot/orders',
						qs: {
							currency_pair: currencyPair,
							status,
						},
						apiType: 'spot',
					})) as IDataObject[];

					responseData = orders.filter((order) => {
						const createTime = order.create_time as number;
						const updateTime = order.update_time as number;
						const relevantTime = event === 'spotOrderFilled' ? updateTime : createTime;
						return relevantTime > lastPollTime;
					});
					break;
				}

				case 'newFuturesOrder':
				case 'futuresOrderFilled': {
					const contract = this.getNodeParameter('contract') as string;
					const settle = this.getNodeParameter('settle') as string;
					const status = event === 'futuresOrderFilled' ? 'finished' : 'open';

					const orders = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: `/futures/${settle}/orders`,
						qs: {
							contract,
							status,
						},
						apiType: 'futures',
						settle,
					})) as IDataObject[];

					responseData = orders.filter((order) => {
						const createTime = order.create_time as number;
						const finishTime = order.finish_time as number;
						const relevantTime = event === 'futuresOrderFilled' ? finishTime : createTime;
						return relevantTime > lastPollTime;
					});
					break;
				}

				case 'positionChanged': {
					const contract = this.getNodeParameter('contract') as string;
					const settle = this.getNodeParameter('settle') as string;

					const position = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: `/futures/${settle}/positions/${contract}`,
						apiType: 'futures',
						settle,
					})) as IDataObject;

					// Check if position has changed since last poll
					const lastSize = webhookData.lastPositionSize as number | undefined;
					const currentSize = position.size as number;

					if (lastSize !== undefined && lastSize !== currentSize) {
						responseData = [
							{
								...position,
								previousSize: lastSize,
								sizeChange: currentSize - lastSize,
							},
						];
					}

					webhookData.lastPositionSize = currentSize;
					break;
				}

				case 'depositReceived': {
					const currency = this.getNodeParameter('currency', '') as string;
					const qs: IDataObject = {
						from: lastPollTime,
						to: now,
					};
					if (currency) {
						qs.currency = currency;
					}

					const deposits = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: '/wallet/deposits',
						qs,
						apiType: 'wallet',
					})) as IDataObject[];

					responseData = deposits.filter((deposit) => deposit.status === 'DONE');
					break;
				}

				case 'withdrawalCompleted': {
					const currency = this.getNodeParameter('currency', '') as string;
					const qs: IDataObject = {
						from: lastPollTime,
						to: now,
					};
					if (currency) {
						qs.currency = currency;
					}

					const withdrawals = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: '/wallet/withdrawals',
						qs,
						apiType: 'wallet',
					})) as IDataObject[];

					responseData = withdrawals.filter((w) => w.status === 'DONE');
					break;
				}

				case 'priceAlert': {
					const currencyPair = this.getNodeParameter('currencyPair') as string;
					const priceThreshold = this.getNodeParameter('priceThreshold') as number;
					const thresholdDirection = this.getNodeParameter('thresholdDirection') as string;

					const ticker = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: '/spot/tickers',
						qs: { currency_pair: currencyPair },
						apiType: 'spot',
						skipAuth: true,
					})) as IDataObject[];

					if (ticker.length > 0) {
						const currentPrice = parseFloat(ticker[0].last as string);
						const lastPrice = webhookData.lastPrice as number | undefined;

						let triggered = false;
						if (thresholdDirection === 'above' && currentPrice > priceThreshold) {
							triggered = lastPrice === undefined || lastPrice <= priceThreshold;
						} else if (thresholdDirection === 'below' && currentPrice < priceThreshold) {
							triggered = lastPrice === undefined || lastPrice >= priceThreshold;
						} else if (thresholdDirection === 'cross') {
							if (lastPrice !== undefined) {
								triggered =
									(lastPrice < priceThreshold && currentPrice >= priceThreshold) ||
									(lastPrice > priceThreshold && currentPrice <= priceThreshold);
							}
						}

						if (triggered) {
							responseData = [
								{
									currencyPair,
									currentPrice,
									threshold: priceThreshold,
									direction: thresholdDirection,
									previousPrice: lastPrice,
									timestamp: new Date().toISOString(),
								},
							];
						}

						webhookData.lastPrice = currentPrice;
					}
					break;
				}

				case 'fundingPayment': {
					const contract = this.getNodeParameter('contract') as string;
					const settle = this.getNodeParameter('settle') as string;

					const accountBook = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: `/futures/${settle}/account_book`,
						qs: {
							type: 'fund',
							contract,
							from: lastPollTime,
							to: now,
						},
						apiType: 'futures',
						settle,
					})) as IDataObject[];

					responseData = accountBook;
					break;
				}

				case 'liquidationWarning': {
					const contract = this.getNodeParameter('contract') as string;
					const settle = this.getNodeParameter('settle') as string;
					const riskThreshold = this.getNodeParameter('riskThreshold') as number;

					const position = (await gateIoApiRequestPoll.call(this, {
						method: 'GET',
						endpoint: `/futures/${settle}/positions/${contract}`,
						apiType: 'futures',
						settle,
					})) as IDataObject;

					if (position && position.size !== 0) {
						const marginRatio = parseFloat(position.margin as string) || 0;
						const maintenanceMargin = parseFloat(position.maintenance_rate as string) || 0;

						// Calculate risk percentage
						const riskPercentage = maintenanceMargin > 0 ? (marginRatio / maintenanceMargin) * 100 : 0;

						if (riskPercentage >= riskThreshold) {
							responseData = [
								{
									...position,
									riskPercentage,
									riskThreshold,
									warning: 'Position approaching liquidation',
									timestamp: new Date().toISOString(),
								},
							];
						}
					}
					break;
				}

				default:
					throw new Error(`Unknown event: ${event}`);
			}
		} catch (error) {
			// Log error but don't fail the trigger
			console.error(`Gate.io Trigger error: ${(error as Error).message}`);
			return null;
		}

		// Update last poll time
		webhookData.lastPollTime = now;

		if (responseData.length === 0) {
			return null;
		}

		return [responseData.map((item) => ({ json: item }))];
	}
}
