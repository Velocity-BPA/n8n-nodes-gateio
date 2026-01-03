/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

// Import operations and fields from all resources
import { accountOperations, accountFields, executeAccountOperation } from './actions/account';
import { walletOperations, walletFields, executeWalletOperation } from './actions/wallet';
import {
	spotTradingOperations,
	spotTradingFields,
	executeSpotTradingOperation,
} from './actions/spotTrading';
import {
	marginTradingOperations,
	marginTradingFields,
	executeMarginTradingOperation,
} from './actions/marginTrading';
import {
	crossMarginOperations,
	crossMarginFields,
	executeCrossMarginOperation,
} from './actions/crossMargin';
import {
	futuresTradingOperations,
	futuresTradingFields,
	executeFuturesTradingOperation,
} from './actions/futuresTrading';
import {
	futuresAccountOperations,
	futuresAccountFields,
	executeFuturesAccountOperation,
} from './actions/futuresAccount';
import {
	futuresOrdersOperations,
	futuresOrdersFields,
	executeFuturesOrdersOperation,
} from './actions/futuresOrders';
import {
	optionsTradingOperations,
	optionsTradingFields,
	executeOptionsTradingOperation,
} from './actions/optionsTrading';
import { earnOperations, earnFields, executeEarnOperation } from './actions/earn';
import {
	flashSwapOperations,
	flashSwapFields,
	executeFlashSwapOperation,
} from './actions/flashSwap';
import {
	subAccountOperations,
	subAccountFields,
	executeSubAccountOperation,
} from './actions/subAccount';
import {
	unifiedAccountOperations,
	unifiedAccountFields,
	executeUnifiedAccountOperation,
} from './actions/unifiedAccount';
import { utilityOperations, utilityFields, executeUtilityOperation } from './actions/utility';

// Licensing notice - logged once per node load
const LICENSING_NOTICE = `
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

export class GateIo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gate.io',
		name: 'gateIo',
		icon: 'file:gateio.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with Gate.io cryptocurrency exchange API for trading, wallet management, and more',
		defaults: {
			name: 'Gate.io',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'gateIoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Account management operations',
					},
					{
						name: 'Cross Margin',
						value: 'crossMargin',
						description: 'Cross margin trading operations',
					},
					{
						name: 'Earn',
						value: 'earn',
						description: 'Earn products (dual investment, structured)',
					},
					{
						name: 'Flash Swap',
						value: 'flashSwap',
						description: 'Flash swap operations',
					},
					{
						name: 'Futures Account',
						value: 'futuresAccount',
						description: 'Futures account and position management',
					},
					{
						name: 'Futures Orders',
						value: 'futuresOrders',
						description: 'Futures order management',
					},
					{
						name: 'Futures Trading',
						value: 'futuresTrading',
						description: 'Futures market data and trading',
					},
					{
						name: 'Margin Trading',
						value: 'marginTrading',
						description: 'Margin trading operations',
					},
					{
						name: 'Options Trading',
						value: 'optionsTrading',
						description: 'Options trading operations',
					},
					{
						name: 'Spot Trading',
						value: 'spotTrading',
						description: 'Spot market trading operations',
					},
					{
						name: 'Sub-Account',
						value: 'subAccount',
						description: 'Sub-account management',
					},
					{
						name: 'Unified Account',
						value: 'unifiedAccount',
						description: 'Unified account operations',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Utility operations (server time, health)',
					},
					{
						name: 'Wallet',
						value: 'wallet',
						description: 'Wallet and transfer operations',
					},
				],
				default: 'spotTrading',
			},
			// Account operations and fields
			...accountOperations,
			...accountFields,
			// Wallet operations and fields
			...walletOperations,
			...walletFields,
			// Spot trading operations and fields
			...spotTradingOperations,
			...spotTradingFields,
			// Margin trading operations and fields
			...marginTradingOperations,
			...marginTradingFields,
			// Cross margin operations and fields
			...crossMarginOperations,
			...crossMarginFields,
			// Futures trading operations and fields
			...futuresTradingOperations,
			...futuresTradingFields,
			// Futures account operations and fields
			...futuresAccountOperations,
			...futuresAccountFields,
			// Futures orders operations and fields
			...futuresOrdersOperations,
			...futuresOrdersFields,
			// Options trading operations and fields
			...optionsTradingOperations,
			...optionsTradingFields,
			// Earn operations and fields
			...earnOperations,
			...earnFields,
			// Flash swap operations and fields
			...flashSwapOperations,
			...flashSwapFields,
			// Sub-account operations and fields
			...subAccountOperations,
			...subAccountFields,
			// Unified account operations and fields
			...unifiedAccountOperations,
			...unifiedAccountFields,
			// Utility operations and fields
			...utilityOperations,
			...utilityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				switch (resource) {
					case 'account':
						responseData = await executeAccountOperation.call(this, operation, i);
						break;
					case 'wallet':
						responseData = await executeWalletOperation.call(this, operation, i);
						break;
					case 'spotTrading':
						responseData = await executeSpotTradingOperation.call(this, operation, i);
						break;
					case 'marginTrading':
						responseData = await executeMarginTradingOperation.call(this, operation, i);
						break;
					case 'crossMargin':
						responseData = await executeCrossMarginOperation.call(this, operation, i);
						break;
					case 'futuresTrading':
						responseData = await executeFuturesTradingOperation.call(this, operation, i);
						break;
					case 'futuresAccount':
						responseData = await executeFuturesAccountOperation.call(this, operation, i);
						break;
					case 'futuresOrders':
						responseData = await executeFuturesOrdersOperation.call(this, operation, i);
						break;
					case 'optionsTrading':
						responseData = await executeOptionsTradingOperation.call(this, operation, i);
						break;
					case 'earn':
						responseData = await executeEarnOperation.call(this, operation, i);
						break;
					case 'flashSwap':
						responseData = await executeFlashSwapOperation.call(this, operation, i);
						break;
					case 'subAccount':
						responseData = await executeSubAccountOperation.call(this, operation, i);
						break;
					case 'unifiedAccount':
						responseData = await executeUnifiedAccountOperation.call(this, operation, i);
						break;
					case 'utility':
						responseData = await executeUtilityOperation.call(this, operation, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				// Handle array vs single object response
				if (Array.isArray(responseData)) {
					returnData.push(
						...responseData.map((item) => ({
							json: item,
							pairedItem: { item: i },
						})),
					);
				} else {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
