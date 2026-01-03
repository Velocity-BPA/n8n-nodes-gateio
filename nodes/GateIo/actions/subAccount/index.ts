/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { gateIoApiRequest } from '../../transport/gateIoApi';

export const subAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subAccount'],
			},
		},
		options: [
			{
				name: 'Create Sub-Account',
				value: 'createSubAccount',
				description: 'Create a new sub-account',
				action: 'Create a new sub account',
			},
			{
				name: 'Create Sub-Account Key',
				value: 'createSubAccountKey',
				description: 'Create API key for sub-account',
				action: 'Create API key for sub account',
			},
			{
				name: 'Delete Sub-Account Key',
				value: 'deleteSubAccountKey',
				description: 'Delete sub-account API key',
				action: 'Delete sub account API key',
			},
			{
				name: 'Get Sub-Account Keys',
				value: 'getSubAccountKeys',
				description: 'Get sub-account API keys',
				action: 'Get sub account API keys',
			},
			{
				name: 'Get Sub-Accounts',
				value: 'getSubAccounts',
				description: 'Get all sub-accounts',
				action: 'Get all sub accounts',
			},
			{
				name: 'Lock Sub-Account',
				value: 'lockSubAccount',
				description: 'Lock a sub-account',
				action: 'Lock a sub account',
			},
			{
				name: 'Unlock Sub-Account',
				value: 'unlockSubAccount',
				description: 'Unlock a sub-account',
				action: 'Unlock a sub account',
			},
			{
				name: 'Update Sub-Account Key',
				value: 'updateSubAccountKey',
				description: 'Update sub-account API key',
				action: 'Update sub account API key',
			},
		],
		default: 'getSubAccounts',
	},
];

export const subAccountFields: INodeProperties[] = [
	// Sub-account user ID
	{
		displayName: 'Sub-Account User ID',
		name: 'subAccountUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: [
					'getSubAccountKeys',
					'createSubAccountKey',
					'updateSubAccountKey',
					'deleteSubAccountKey',
					'lockSubAccount',
					'unlockSubAccount',
				],
			},
		},
		default: '',
		description: 'Sub-account user ID',
	},
	// Login name for create
	{
		displayName: 'Login Name',
		name: 'loginName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccount'],
			},
		},
		default: '',
		description: 'Login name for the sub-account',
	},
	// Email for create
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccount'],
			},
		},
		default: '',
		placeholder: 'user@example.com',
		description: 'Email address for the sub-account (optional)',
	},
	// Password for create
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccount'],
			},
		},
		default: '',
		description: 'Password for the sub-account (optional, auto-generated if not provided)',
	},
	// API Key name
	{
		displayName: 'Key Name',
		name: 'keyName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountKey', 'updateSubAccountKey'],
			},
		},
		default: '',
		description: 'Name for the API key',
	},
	// API Key
	{
		displayName: 'API Key',
		name: 'apiKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['updateSubAccountKey', 'deleteSubAccountKey'],
			},
		},
		default: '',
		description: 'The API key to update or delete',
	},
	// Permissions
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountKey', 'updateSubAccountKey'],
			},
		},
		options: [
			{ name: 'Spot', value: 'spot' },
			{ name: 'Margin', value: 'margin' },
			{ name: 'Futures', value: 'futures' },
			{ name: 'Delivery', value: 'delivery' },
			{ name: 'Options', value: 'options' },
			{ name: 'Wallet', value: 'wallet' },
		],
		default: ['spot'],
		description: 'API key permissions',
	},
	// IP Whitelist
	{
		displayName: 'IP Whitelist',
		name: 'ipWhitelist',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['createSubAccountKey', 'updateSubAccountKey'],
			},
		},
		default: '',
		description: 'Comma-separated list of allowed IP addresses',
	},
	// Type filter for getSubAccounts
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['subAccount'],
				operation: ['getSubAccounts'],
			},
		},
		options: [
			{ name: 'All', value: '' },
			{ name: 'Sub-Account', value: '0' },
			{ name: 'Cross Margin Account', value: '1' },
		],
		default: '',
		description: 'Filter sub-accounts by type',
	},
];

export async function executeSubAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[];

	switch (operation) {
		case 'getSubAccounts': {
			const type = this.getNodeParameter('type', i, '') as string;
			const qs: IDataObject = {};
			if (type) {
				qs.type = type;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: '/sub_accounts',
				qs,
				apiType: 'subAccount',
			});
			break;
		}

		case 'createSubAccount': {
			const loginName = this.getNodeParameter('loginName', i) as string;
			const email = this.getNodeParameter('email', i, '') as string;
			const password = this.getNodeParameter('password', i, '') as string;

			const body: IDataObject = {
				login_name: loginName,
			};

			if (email) {
				body.email = email;
			}
			if (password) {
				body.password = password;
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: '/sub_accounts',
				body,
				apiType: 'subAccount',
			});
			break;
		}

		case 'getSubAccountKeys': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'GET',
				endpoint: `/sub_accounts/${subAccountUserId}/keys`,
				apiType: 'subAccount',
			});
			break;
		}

		case 'createSubAccountKey': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			const keyName = this.getNodeParameter('keyName', i, '') as string;
			const permissions = this.getNodeParameter('permissions', i, ['spot']) as string[];
			const ipWhitelist = this.getNodeParameter('ipWhitelist', i, '') as string;

			const body: IDataObject = {
				perms: permissions.map((p) => ({ name: p })),
			};

			if (keyName) {
				body.name = keyName;
			}
			if (ipWhitelist) {
				body.ip_whitelist = ipWhitelist.split(',').map((ip: string) => ip.trim());
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/sub_accounts/${subAccountUserId}/keys`,
				body,
				apiType: 'subAccount',
			});
			break;
		}

		case 'updateSubAccountKey': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const keyName = this.getNodeParameter('keyName', i, '') as string;
			const permissions = this.getNodeParameter('permissions', i, ['spot']) as string[];
			const ipWhitelist = this.getNodeParameter('ipWhitelist', i, '') as string;

			const body: IDataObject = {
				perms: permissions.map((p) => ({ name: p })),
			};

			if (keyName) {
				body.name = keyName;
			}
			if (ipWhitelist) {
				body.ip_whitelist = ipWhitelist.split(',').map((ip: string) => ip.trim());
			}

			responseData = await gateIoApiRequest.call(this, {
				method: 'PUT',
				endpoint: `/sub_accounts/${subAccountUserId}/keys/${apiKey}`,
				body,
				apiType: 'subAccount',
			});
			break;
		}

		case 'deleteSubAccountKey': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;

			responseData = await gateIoApiRequest.call(this, {
				method: 'DELETE',
				endpoint: `/sub_accounts/${subAccountUserId}/keys/${apiKey}`,
				apiType: 'subAccount',
			});
			break;
		}

		case 'lockSubAccount': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/sub_accounts/${subAccountUserId}/lock`,
				apiType: 'subAccount',
			});
			break;
		}

		case 'unlockSubAccount': {
			const subAccountUserId = this.getNodeParameter('subAccountUserId', i) as string;
			responseData = await gateIoApiRequest.call(this, {
				method: 'POST',
				endpoint: `/sub_accounts/${subAccountUserId}/unlock`,
				apiType: 'subAccount',
			});
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return responseData;
}
