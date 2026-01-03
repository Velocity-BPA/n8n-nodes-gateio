/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get API Health',
				value: 'getAPIHealth',
				description: 'Check API service status',
				action: 'Check API service status',
			},
			{
				name: 'Get Server Time',
				value: 'getServerTime',
				description: 'Get server time',
				action: 'Get server time',
			},
		],
		default: 'getServerTime',
	},
];

export const utilityFields: INodeProperties[] = [];

export async function executeUtilityOperation(
	this: IExecuteFunctions,
	operation: string,
	_i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getServerTime': {
			const response = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/spot/time',
				apiType: 'spot',
				skipAuth: true,
			});
			const serverTimeData = Array.isArray(response) ? response[0] : response;
			responseData = {
				server_time: serverTimeData.server_time,
				timestamp: new Date((serverTimeData.server_time as number) * 1000).toISOString(),
			} as IDataObject;
			break;
		}

		case 'getAPIHealth': {
			// Check multiple endpoints for health
			const checks: IDataObject = {};

			try {
				await gateIoApiRequest.call(this, {
					method: 'GET',
					endpoint: '/spot/time',
					apiType: 'spot',
					skipAuth: true,
				});
				checks.spot = 'healthy';
			} catch {
				checks.spot = 'unhealthy';
			}

			try {
				await gateIoApiRequest.call(this, {
					method: 'GET',
					endpoint: '/futures/usdt/contracts',
					apiType: 'futures',
					skipAuth: true,
				});
				checks.futures_usdt = 'healthy';
			} catch {
				checks.futures_usdt = 'unhealthy';
			}

			try {
				await gateIoApiRequest.call(this, {
					method: 'GET',
					endpoint: '/options/underlyings',
					apiType: 'options',
					skipAuth: true,
				});
				checks.options = 'healthy';
			} catch {
				checks.options = 'unhealthy';
			}

			const allHealthy = Object.values(checks).every((v) => v === 'healthy');
			responseData = {
				status: allHealthy ? 'healthy' : 'degraded',
				services: checks,
				timestamp: new Date().toISOString(),
			};
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
