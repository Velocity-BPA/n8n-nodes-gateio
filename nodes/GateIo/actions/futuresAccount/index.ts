/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const futuresAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
			},
		},
		options: [
			{
				name: 'Get Dual Mode Position',
				value: 'getDualModePosition',
				description: 'Get dual mode position',
				action: 'Get dual mode position',
			},
			{
				name: 'Get Futures Account Book',
				value: 'getFuturesAccountBook',
				description: 'Get account book',
				action: 'Get account book',
			},
			{
				name: 'Get Futures Accounts',
				value: 'getFuturesAccounts',
				description: 'Get futures accounts',
				action: 'Get futures accounts',
			},
			{
				name: 'Get Position',
				value: 'getPosition',
				description: 'Get single position',
				action: 'Get single position',
			},
			{
				name: 'Get Positions',
				value: 'getPositions',
				description: 'Get all positions',
				action: 'Get all positions',
			},
			{
				name: 'Set Dual Mode',
				value: 'setDualMode',
				description: 'Enable/disable dual position mode',
				action: 'Enable disable dual position mode',
			},
			{
				name: 'Update Dual Mode Leverage',
				value: 'updateDualModeLeverage',
				description: 'Update dual mode leverage',
				action: 'Update dual mode leverage',
			},
			{
				name: 'Update Dual Mode Position',
				value: 'updateDualModePosition',
				description: 'Update dual mode position margin',
				action: 'Update dual mode position margin',
			},
			{
				name: 'Update Dual Mode Risk Limit',
				value: 'updateDualModeRiskLimit',
				description: 'Update dual mode risk limit',
				action: 'Update dual mode risk limit',
			},
			{
				name: 'Update Position Leverage',
				value: 'updatePositionLeverage',
				description: 'Update leverage',
				action: 'Update leverage',
			},
			{
				name: 'Update Position Margin',
				value: 'updatePositionMargin',
				description: 'Update position margin',
				action: 'Update position margin',
			},
			{
				name: 'Update Position Risk Limit',
				value: 'updatePositionRiskLimit',
				description: 'Update risk limit',
				action: 'Update risk limit',
			},
		],
		default: 'getFuturesAccounts',
	},
];

export const futuresAccountFields: INodeProperties[] = [
	// Settle currency
	{
		displayName: 'Settle Currency',
		name: 'settle',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
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
				resource: ['futuresAccount'],
				operation: [
					'getPosition',
					'updatePositionMargin',
					'updatePositionLeverage',
					'updatePositionRiskLimit',
					'getDualModePosition',
					'updateDualModePosition',
					'updateDualModeLeverage',
					'updateDualModeRiskLimit',
				],
			},
		},
		default: 'BTC_USDT',
		description: 'Futures contract name (e.g., BTC_USDT)',
	},
	// Leverage field
	{
		displayName: 'Leverage',
		name: 'leverage',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['updatePositionLeverage', 'updateDualModeLeverage'],
			},
		},
		default: 10,
		description: 'Leverage value (0 for cross margin)',
	},
	// Margin change
	{
		displayName: 'Margin Change',
		name: 'change',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['updatePositionMargin', 'updateDualModePosition'],
			},
		},
		default: '',
		description: 'Margin change amount (positive to add, negative to reduce)',
	},
	// Risk limit
	{
		displayName: 'Risk Limit',
		name: 'riskLimit',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['updatePositionRiskLimit', 'updateDualModeRiskLimit'],
			},
		},
		default: '',
		description: 'New risk limit value',
	},
	// Dual mode
	{
		displayName: 'Enable Dual Mode',
		name: 'dualMode',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['setDualMode'],
			},
		},
		default: false,
		description: 'Whether to enable dual position mode',
	},
	// Dual mode side
	{
		displayName: 'Dual Side',
		name: 'dualSide',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['futuresAccount'],
				operation: ['getDualModePosition', 'updateDualModePosition', 'updateDualModeLeverage', 'updateDualModeRiskLimit'],
			},
		},
		options: [
			{ name: 'Long', value: 'dual_long' },
			{ name: 'Short', value: 'dual_short' },
		],
		default: 'dual_long',
		description: 'Dual mode position side',
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
				resource: ['futuresAccount'],
				operation: ['getFuturesAccountBook', 'getPositions'],
			},
		},
		options: [
			{
				displayName: 'From',
				name: 'from',
				type: 'dateTime',
				default: '',
				description: 'Start time',
			},
			{
				displayName: 'Holding',
				name: 'holding',
				type: 'boolean',
				default: true,
				description: 'Whether to only return positions with holdings',
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

export async function executeFuturesAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];
	const settle = this.getNodeParameter('settle', i) as string;

	switch (operation) {
		case 'getFuturesAccounts': {
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/accounts`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getFuturesAccountBook': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.limit) qs.limit = additionalOptions.limit;
			if (additionalOptions.from) qs.from = Math.floor(new Date(additionalOptions.from as string).getTime() / 1000);
			if (additionalOptions.to) qs.to = Math.floor(new Date(additionalOptions.to as string).getTime() / 1000);

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/account_book`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getPositions': {
			const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
			const qs: IDataObject = {};
			if (additionalOptions.holding !== undefined) qs.holding = additionalOptions.holding;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/positions`,
				qs,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getPosition': {
			const contract = this.getNodeParameter('contract', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/positions/${contract}`,
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updatePositionMargin': {
			const contract = this.getNodeParameter('contract', i) as string;
			const change = this.getNodeParameter('change', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/positions/${contract}/margin`,
				body: { change },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updatePositionLeverage': {
			const contract = this.getNodeParameter('contract', i) as string;
			const leverage = this.getNodeParameter('leverage', i) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/positions/${contract}/leverage`,
				body: { leverage },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updatePositionRiskLimit': {
			const contract = this.getNodeParameter('contract', i) as string;
			const riskLimit = this.getNodeParameter('riskLimit', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/positions/${contract}/risk_limit`,
				body: { risk_limit: riskLimit },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'setDualMode': {
			const dualMode = this.getNodeParameter('dualMode', i) as boolean;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/dual_mode`,
				body: { dual_mode: dualMode },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'getDualModePosition': {
			const contract = this.getNodeParameter('contract', i) as string;
			const dualSide = this.getNodeParameter('dualSide', i, 'dual_long') as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/futures/${settle}/dual_comp/positions/${contract}`,
				qs: { dual_side: dualSide },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updateDualModePosition': {
			const contract = this.getNodeParameter('contract', i) as string;
			const dualSide = this.getNodeParameter('dualSide', i, 'dual_long') as string;
			const change = this.getNodeParameter('change', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/dual_comp/positions/${contract}/margin`,
				body: { change, dual_side: dualSide },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updateDualModeLeverage': {
			const contract = this.getNodeParameter('contract', i) as string;
			const dualSide = this.getNodeParameter('dualSide', i, 'dual_long') as string;
			const leverage = this.getNodeParameter('leverage', i) as number;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/dual_comp/positions/${contract}/leverage`,
				body: { leverage, dual_side: dualSide },
				apiType: 'futures',
				settle,
			});
			break;
		}

		case 'updateDualModeRiskLimit': {
			const contract = this.getNodeParameter('contract', i) as string;
			const dualSide = this.getNodeParameter('dualSide', i, 'dual_long') as string;
			const riskLimit = this.getNodeParameter('riskLimit', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/futures/${settle}/dual_comp/positions/${contract}/risk_limit`,
				body: { risk_limit: riskLimit, dual_side: dualSide },
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
