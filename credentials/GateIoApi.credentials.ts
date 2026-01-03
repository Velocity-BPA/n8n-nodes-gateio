/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';
import * as crypto from 'crypto';

export class GateIoApi implements ICredentialType {
	name = 'gateIoApi';
	displayName = 'Gate.io API';
	documentationUrl = 'https://www.gate.io/docs/developers/apiv4/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Gate.io API Key',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Gate.io API Secret',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
			],
			default: 'production',
			description: 'Select the Gate.io environment',
		},
		{
			displayName: 'Base URL - Spot',
			name: 'baseUrlSpot',
			type: 'string',
			default: 'https://api.gateio.ws/api/v4',
			description: 'Base URL for Spot API',
		},
		{
			displayName: 'Base URL - Futures USDT',
			name: 'baseUrlFuturesUsdt',
			type: 'string',
			default: 'https://api.gateio.ws/api/v4',
			description: 'Base URL for USDT Futures API',
		},
		{
			displayName: 'Base URL - Futures BTC',
			name: 'baseUrlFuturesBtc',
			type: 'string',
			default: 'https://api.gateio.ws/api/v4',
			description: 'Base URL for BTC Futures API',
		},
		{
			displayName: 'Default Settle Currency',
			name: 'defaultSettle',
			type: 'options',
			options: [
				{
					name: 'USDT',
					value: 'usdt',
				},
				{
					name: 'BTC',
					value: 'btc',
				},
			],
			default: 'usdt',
			description: 'Default settlement currency for futures trading',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "testnet" ? "https://fx-api-testnet.gateio.ws/api/v4" : $credentials.baseUrlSpot}}',
			url: '/spot/accounts',
			method: 'GET',
		},
	};
}

/**
 * Generate Gate.io API signature
 * Signature format: HTTP_METHOD + "\n" + URL_PATH + "\n" + QUERY_STRING + "\n" + HEX(SHA512(REQUEST_BODY)) + "\n" + TIMESTAMP
 */
export function generateGateIoSignature(
	method: string,
	urlPath: string,
	queryString: string,
	body: string,
	timestamp: string,
	apiSecret: string,
): string {
	// Hash the body using SHA512
	const bodyHash = crypto.createHash('sha512').update(body || '').digest('hex');

	// Create the signature string
	const signatureString = [
		method.toUpperCase(),
		urlPath,
		queryString,
		bodyHash,
		timestamp,
	].join('\n');

	// Generate HMAC SHA512 signature
	const signature = crypto
		.createHmac('sha512', apiSecret)
		.update(signatureString)
		.digest('hex');

	return signature;
}

/**
 * Get authentication headers for Gate.io API
 */
export function getGateIoAuthHeaders(
	credentials: ICredentialDataDecryptedObject,
	method: string,
	urlPath: string,
	queryString: string,
	body: string,
): Record<string, string> {
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const signature = generateGateIoSignature(
		method,
		urlPath,
		queryString,
		body,
		timestamp,
		credentials.apiSecret as string,
	);

	return {
		'KEY': credentials.apiKey as string,
		'SIGN': signature,
		'Timestamp': timestamp,
		'Content-Type': 'application/json',
	};
}
