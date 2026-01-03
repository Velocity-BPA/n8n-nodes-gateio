/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ICredentialDataDecryptedObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as crypto from 'crypto';

export type GateIoApiEndpoint =
	| 'spot'
	| 'futures'
	| 'options'
	| 'wallet'
	| 'account'
	| 'earn'
	| 'flashSwap'
	| 'subAccount'
	| 'unified';

export interface IGateIoApiRequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject | IDataObject[];
	qs?: IDataObject;
	apiType?: GateIoApiEndpoint;
	settle?: string;
	skipAuth?: boolean;
}

/**
 * Generate SHA512 hash of the request body
 */
function hashBody(body: string): string {
	return crypto.createHash('sha512').update(body || '').digest('hex');
}

/**
 * Generate HMAC SHA512 signature for Gate.io API
 */
function generateSignature(
	method: string,
	urlPath: string,
	queryString: string,
	body: string,
	timestamp: string,
	apiSecret: string,
): string {
	const bodyHash = hashBody(body);
	const signatureString = [
		method.toUpperCase(),
		urlPath,
		queryString,
		bodyHash,
		timestamp,
	].join('\n');

	return crypto
		.createHmac('sha512', apiSecret)
		.update(signatureString)
		.digest('hex');
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: IDataObject): string {
	const queryParams: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
		}
	}
	return queryParams.sort().join('&');
}

/**
 * Get the base URL based on API type and environment
 */
function getBaseUrl(
	credentials: ICredentialDataDecryptedObject,
	apiType: GateIoApiEndpoint,
	settle?: string,
): string {
	const isTestnet = credentials.environment === 'testnet';

	if (isTestnet) {
		return 'https://fx-api-testnet.gateio.ws/api/v4';
	}

	switch (apiType) {
		case 'futures': {
			const settleCurrency = settle || credentials.defaultSettle || 'usdt';
			if (settleCurrency === 'btc') {
				return credentials.baseUrlFuturesBtc as string || 'https://api.gateio.ws/api/v4';
			}
			return credentials.baseUrlFuturesUsdt as string || 'https://api.gateio.ws/api/v4';
		}
		case 'options':
			return 'https://api.gateio.ws/api/v4';
		default:
			return credentials.baseUrlSpot as string || 'https://api.gateio.ws/api/v4';
	}
}

/**
 * Make an authenticated request to the Gate.io API
 */
export async function gateIoApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
	options: IGateIoApiRequestOptions,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('gateIoApi');

	const { method, endpoint, body, qs, apiType = 'spot', settle, skipAuth = false } = options;

	const baseUrl = getBaseUrl(credentials, apiType, settle);
	const urlPath = `/api/v4${endpoint}`;
	const queryString = qs ? buildQueryString(qs) : '';
	const bodyString = body ? JSON.stringify(body) : '';
	const timestamp = Math.floor(Date.now() / 1000).toString();

	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`,
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};

	// Add authentication headers if not skipped
	if (!skipAuth) {
		const signature = generateSignature(
			method,
			urlPath,
			queryString,
			bodyString,
			timestamp,
			credentials.apiSecret as string,
		);

		requestOptions.headers = {
			...requestOptions.headers,
			'KEY': credentials.apiKey as string,
			'SIGN': signature,
			'Timestamp': timestamp,
		};
	}

	if (body && Object.keys(body).length > 0) {
		requestOptions.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(requestOptions);
		return response as IDataObject | IDataObject[];
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeApiError(this.getNode(), { message: errorMessage }, {
			message: 'Gate.io API request failed',
		});
	}
}

/**
 * Make an authenticated request for poll functions (alias for gateIoApiRequest)
 */
export async function gateIoApiRequestPoll(
	this: IPollFunctions,
	options: IGateIoApiRequestOptions,
): Promise<IDataObject | IDataObject[]> {
	return gateIoApiRequest.call(this, options);
}

/**
 * Make an authenticated request and handle pagination
 */
export async function gateIoApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
	options: IGateIoApiRequestOptions,
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const pageLimit = 100;
	let hasMore = true;

	options.qs = options.qs || {};
	options.qs.limit = pageLimit;

	while (hasMore) {
		options.qs.page = page;
		const response = await gateIoApiRequest.call(this, options);
		const items = Array.isArray(response) ? response : [response];
		returnData.push(...items);

		if (items.length < pageLimit) {
			hasMore = false;
		} else if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		} else {
			page++;
		}
	}

	return limit ? returnData.slice(0, limit) : returnData;
}

/**
 * Handle Gate.io API errors
 */
export function handleGateIoError(error: IDataObject): string {
	const errorMessages: Record<string, string> = {
		'INVALID_KEY': 'Invalid API key',
		'INVALID_SIGNATURE': 'Invalid signature - check your API secret',
		'INVALID_TIMESTAMP': 'Invalid timestamp - check your system clock',
		'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded - please slow down requests',
		'INSUFFICIENT_BALANCE': 'Insufficient balance for this operation',
		'ORDER_NOT_FOUND': 'Order not found',
		'INVALID_CURRENCY_PAIR': 'Invalid currency pair',
		'INVALID_AMOUNT': 'Invalid amount specified',
		'INVALID_PRICE': 'Invalid price specified',
		'ACCOUNT_LOCKED': 'Account is locked',
		'POSITION_NOT_FOUND': 'Position not found',
		'CONTRACT_NOT_FOUND': 'Contract not found',
	};

	const errorCode = error.label as string || error.code as string;
	return errorMessages[errorCode] || error.message as string || 'Unknown error occurred';
}
