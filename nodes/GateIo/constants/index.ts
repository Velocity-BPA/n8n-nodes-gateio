/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const GATE_IO_RESOURCES: INodeProperties = {
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
			description: 'Earn and investment products',
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
			description: 'Futures order operations',
		},
		{
			name: 'Futures Trading',
			value: 'futuresTrading',
			description: 'Futures market data',
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
			description: 'Spot trading operations',
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
			description: 'Utility operations',
		},
		{
			name: 'Wallet',
			value: 'wallet',
			description: 'Wallet operations',
		},
	],
	default: 'spotTrading',
};

export const SETTLE_CURRENCY_OPTIONS: INodeProperties = {
	displayName: 'Settle Currency',
	name: 'settle',
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
	description: 'Settlement currency for futures',
};

export const CANDLESTICK_INTERVALS = [
	{ name: '10 Seconds', value: '10s' },
	{ name: '1 Minute', value: '1m' },
	{ name: '5 Minutes', value: '5m' },
	{ name: '15 Minutes', value: '15m' },
	{ name: '30 Minutes', value: '30m' },
	{ name: '1 Hour', value: '1h' },
	{ name: '4 Hours', value: '4h' },
	{ name: '8 Hours', value: '8h' },
	{ name: '1 Day', value: '1d' },
	{ name: '7 Days', value: '7d' },
	{ name: '30 Days', value: '30d' },
];

export const ORDER_TYPES = [
	{ name: 'Limit', value: 'limit' },
	{ name: 'Market', value: 'market' },
	{ name: 'IOC (Immediate or Cancel)', value: 'ioc' },
	{ name: 'POC (Post Only)', value: 'poc' },
];

export const ORDER_SIDES = [
	{ name: 'Buy', value: 'buy' },
	{ name: 'Sell', value: 'sell' },
];

export const ORDER_STATUS_OPTIONS = [
	{ name: 'Open', value: 'open' },
	{ name: 'Closed', value: 'closed' },
	{ name: 'Cancelled', value: 'cancelled' },
];

export const TIME_IN_FORCE_OPTIONS = [
	{ name: 'GTC (Good Till Cancel)', value: 'gtc' },
	{ name: 'IOC (Immediate or Cancel)', value: 'ioc' },
	{ name: 'POC (Post Only)', value: 'poc' },
	{ name: 'FOK (Fill or Kill)', value: 'fok' },
];

export const AUTO_SIZE_OPTIONS = [
	{ name: 'None', value: '' },
	{ name: 'Close Long', value: 'close_long' },
	{ name: 'Close Short', value: 'close_short' },
];

export const ACCOUNT_TYPES = [
	{ name: 'Spot', value: 'spot' },
	{ name: 'Margin', value: 'margin' },
	{ name: 'Futures', value: 'futures' },
	{ name: 'Delivery', value: 'delivery' },
	{ name: 'Cross Margin', value: 'cross_margin' },
	{ name: 'Options', value: 'options' },
];

export const TRANSFER_ACCOUNT_TYPES = [
	{ name: 'Spot', value: 'spot' },
	{ name: 'Margin', value: 'margin' },
	{ name: 'Futures', value: 'futures' },
	{ name: 'Delivery', value: 'delivery' },
	{ name: 'Cross Margin', value: 'cross_margin' },
	{ name: 'Options', value: 'options' },
];

export const GATE_IO_API_ERRORS: Record<string, string> = {
	INVALID_KEY: 'Invalid API key',
	INVALID_SIGNATURE: 'Invalid signature',
	INVALID_TIMESTAMP: 'Invalid timestamp',
	RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
	INSUFFICIENT_BALANCE: 'Insufficient balance',
	ORDER_NOT_FOUND: 'Order not found',
	INVALID_CURRENCY_PAIR: 'Invalid currency pair',
	INVALID_AMOUNT: 'Invalid amount',
	INVALID_PRICE: 'Invalid price',
	ACCOUNT_LOCKED: 'Account is locked',
	POSITION_NOT_FOUND: 'Position not found',
	CONTRACT_NOT_FOUND: 'Contract not found',
	TOO_MANY_REQUESTS: 'Too many requests',
	SYSTEM_ERROR: 'System error',
};

export const TRIGGER_EVENTS = [
	{ name: 'New Spot Order', value: 'newSpotOrder' },
	{ name: 'Spot Order Filled', value: 'spotOrderFilled' },
	{ name: 'New Futures Order', value: 'newFuturesOrder' },
	{ name: 'Futures Order Filled', value: 'futuresOrderFilled' },
	{ name: 'Position Changed', value: 'positionChanged' },
	{ name: 'Deposit Received', value: 'depositReceived' },
	{ name: 'Withdrawal Completed', value: 'withdrawalCompleted' },
	{ name: 'Price Alert', value: 'priceAlert' },
	{ name: 'Funding Payment', value: 'fundingPayment' },
	{ name: 'Liquidation Warning', value: 'liquidationWarning' },
];
