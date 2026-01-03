/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import * as crypto from 'crypto';

/**
 * Generate SHA512 hash
 */
export function sha512Hash(data: string): string {
	return crypto.createHash('sha512').update(data).digest('hex');
}

/**
 * Generate HMAC SHA512
 */
export function hmacSha512(data: string, secret: string): string {
	return crypto.createHmac('sha512', secret).update(data).digest('hex');
}

/**
 * Convert response to n8n execution data format
 */
export function toExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	const items = Array.isArray(data) ? data : [data];
	return items.map((item) => ({
		json: item,
	}));
}

/**
 * Format timestamp to seconds
 */
export function toTimestampSeconds(date?: Date | string | number): number {
	if (!date) {
		return Math.floor(Date.now() / 1000);
	}
	if (typeof date === 'number') {
		return date > 9999999999 ? Math.floor(date / 1000) : date;
	}
	return Math.floor(new Date(date).getTime() / 1000);
}

/**
 * Format timestamp from seconds to milliseconds
 */
export function fromTimestampSeconds(timestamp: number): number {
	return timestamp < 9999999999 ? timestamp * 1000 : timestamp;
}

/**
 * Build query parameters from options
 */
export function buildQueryParams(options: IDataObject): IDataObject {
	const params: IDataObject = {};
	for (const [key, value] of Object.entries(options)) {
		if (value !== undefined && value !== null && value !== '') {
			params[key] = value;
		}
	}
	return params;
}

/**
 * Parse currency pair string
 */
export function parseCurrencyPair(pair: string): { base: string; quote: string } {
	const [base, quote] = pair.split('_');
	return { base, quote };
}

/**
 * Format currency pair
 */
export function formatCurrencyPair(base: string, quote: string): string {
	return `${base.toUpperCase()}_${quote.toUpperCase()}`;
}

/**
 * Calculate position PnL
 */
export function calculatePositionPnl(
	entryPrice: number,
	currentPrice: number,
	size: number,
	contractSize: number = 1,
): number {
	const isLong = size > 0;
	const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice;
	return priceDiff * Math.abs(size) * contractSize;
}

/**
 * Format decimal to string (avoid scientific notation)
 */
export function formatDecimal(value: number, decimals: number = 8): string {
	return value.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
	data: IDataObject,
	requiredFields: string[],
): void {
	const missingFields = requiredFields.filter(
		(field) => data[field] === undefined || data[field] === null || data[field] === '',
	);
	if (missingFields.length > 0) {
		throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
	}
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	baseDelay: number = 1000,
): Promise<T> {
	let lastError: Error | undefined;
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;
			if (attempt < maxRetries - 1) {
				const delay = baseDelay * Math.pow(2, attempt);
				await sleep(delay);
			}
		}
	}
	throw lastError;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends IDataObject>(target: T, source: Partial<T>): T {
	const output = { ...target };
	for (const key of Object.keys(source)) {
		const sourceValue = source[key as keyof T];
		const targetValue = target[key as keyof T];
		if (
			typeof sourceValue === 'object' &&
			sourceValue !== null &&
			!Array.isArray(sourceValue) &&
			typeof targetValue === 'object' &&
			targetValue !== null &&
			!Array.isArray(targetValue)
		) {
			(output as IDataObject)[key] = deepMerge(
				targetValue as IDataObject,
				sourceValue as IDataObject,
			);
		} else if (sourceValue !== undefined) {
			(output as IDataObject)[key] = sourceValue;
		}
	}
	return output;
}

/**
 * Format Gate.io error response
 */
export function formatGateIoError(error: IDataObject): string {
	if (error.label) {
		return `[${error.label}] ${error.message || 'Unknown error'}`;
	}
	if (error.message) {
		return error.message as string;
	}
	return JSON.stringify(error);
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function transformKeysToCamel(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		const newKey = snakeToCamel(key);
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			result[newKey] = transformKeysToCamel(value as IDataObject);
		} else if (Array.isArray(value)) {
			result[newKey] = value.map((item) =>
				typeof item === 'object' && item !== null
					? transformKeysToCamel(item as IDataObject)
					: item,
			);
		} else {
			result[newKey] = value;
		}
	}
	return result;
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function transformKeysToSnake(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		const newKey = camelToSnake(key);
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			result[newKey] = transformKeysToSnake(value as IDataObject);
		} else if (Array.isArray(value)) {
			result[newKey] = value.map((item) =>
				typeof item === 'object' && item !== null
					? transformKeysToSnake(item as IDataObject)
					: item,
			);
		} else {
			result[newKey] = value;
		}
	}
	return result;
}
