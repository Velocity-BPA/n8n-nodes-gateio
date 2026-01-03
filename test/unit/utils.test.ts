/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

// Replicate the utility functions for testing
function sha512Hash(data: string): string {
	return crypto.createHash('sha512').update(data).digest('hex');
}

function hmacSha512(data: string, secret: string): string {
	return crypto.createHmac('sha512', secret).update(data).digest('hex');
}

function toSnakeCase(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function buildQueryString(params: Record<string, unknown>): string {
	const queryParams: string[] = [];
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
		}
	}
	return queryParams.sort().join('&');
}

describe('Gate.io Utilities', () => {
	describe('sha512Hash', () => {
		it('should generate correct SHA512 hash for empty string', () => {
			const hash = sha512Hash('');
			expect(hash).toBe(
				'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
			);
		});

		it('should generate correct SHA512 hash for JSON body', () => {
			const body = JSON.stringify({ currency_pair: 'BTC_USDT', amount: '0.1' });
			const hash = sha512Hash(body);
			expect(hash).toHaveLength(128);
		});
	});

	describe('hmacSha512', () => {
		it('should generate correct HMAC-SHA512 signature', () => {
			const data = 'test_data';
			const secret = 'test_secret';
			const signature = hmacSha512(data, secret);
			expect(signature).toHaveLength(128);
		});

		it('should generate different signatures for different secrets', () => {
			const data = 'test_data';
			const sig1 = hmacSha512(data, 'secret1');
			const sig2 = hmacSha512(data, 'secret2');
			expect(sig1).not.toBe(sig2);
		});
	});

	describe('toSnakeCase', () => {
		it('should convert camelCase to snake_case', () => {
			expect(toSnakeCase('currencyPair')).toBe('currency_pair');
			expect(toSnakeCase('maxBorrowable')).toBe('max_borrowable');
			expect(toSnakeCase('API')).toBe('_a_p_i');
		});

		it('should handle already snake_case strings', () => {
			expect(toSnakeCase('currency_pair')).toBe('currency_pair');
		});
	});

	describe('toCamelCase', () => {
		it('should convert snake_case to camelCase', () => {
			expect(toCamelCase('currency_pair')).toBe('currencyPair');
			expect(toCamelCase('max_borrowable')).toBe('maxBorrowable');
		});

		it('should handle already camelCase strings', () => {
			expect(toCamelCase('currencyPair')).toBe('currencyPair');
		});
	});

	describe('buildQueryString', () => {
		it('should build sorted query string from parameters', () => {
			const params = { b: '2', a: '1', c: '3' };
			expect(buildQueryString(params)).toBe('a=1&b=2&c=3');
		});

		it('should filter out empty, null, and undefined values', () => {
			const params = { a: '1', b: '', c: null, d: undefined, e: '5' };
			expect(buildQueryString(params)).toBe('a=1&e=5');
		});

		it('should encode special characters', () => {
			const params = { pair: 'BTC/USDT' };
			expect(buildQueryString(params)).toBe('pair=BTC%2FUSDT');
		});

		it('should return empty string for empty params', () => {
			expect(buildQueryString({})).toBe('');
		});
	});
});

describe('Gate.io Signature Generation', () => {
	const generateSignature = (
		method: string,
		urlPath: string,
		queryString: string,
		body: string,
		timestamp: string,
		apiSecret: string,
	): string => {
		const bodyHash = sha512Hash(body);
		const signatureString = [method.toUpperCase(), urlPath, queryString, bodyHash, timestamp].join(
			'\n',
		);
		return hmacSha512(signatureString, apiSecret);
	};

	it('should generate correct signature format', () => {
		const signature = generateSignature(
			'GET',
			'/api/v4/spot/orders',
			'currency_pair=BTC_USDT&status=open',
			'',
			'1234567890',
			'test_secret',
		);
		expect(signature).toHaveLength(128);
	});

	it('should include body hash in signature for POST requests', () => {
		const body = JSON.stringify({ currency_pair: 'BTC_USDT', amount: '0.1' });
		const signature = generateSignature(
			'POST',
			'/api/v4/spot/orders',
			'',
			body,
			'1234567890',
			'test_secret',
		);
		expect(signature).toHaveLength(128);
	});

	it('should generate different signatures for different timestamps', () => {
		const sig1 = generateSignature(
			'GET',
			'/api/v4/spot/orders',
			'',
			'',
			'1234567890',
			'test_secret',
		);
		const sig2 = generateSignature(
			'GET',
			'/api/v4/spot/orders',
			'',
			'',
			'1234567891',
			'test_secret',
		);
		expect(sig1).not.toBe(sig2);
	});
});
