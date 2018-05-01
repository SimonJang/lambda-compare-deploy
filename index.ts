import * as AWS from 'aws-sdk';
import * as assert from 'type-assert';
import {Credentials, MetaCredentials, CompareOptions, ListAliasesOptions} from './lib/entities';

const credentialsMap: Map<string, Credentials> = new Map();
let currentAlias: string;
let lambdaOperator: any;

const add = (map, key, value) => {
	return {...map, [key]: value};
};

const compareList = (base: any[], comparing: any[], opts: CompareOptions) => {
	const result = {};

	for (const key of Object.keys(opts)) {
		result[key] = base.reduce((store, item) => {
			const comparedItem = comparing.find(data => data.FunctionName === item.FunctionName);

			if (comparedItem && comparedItem[key] !== item[key]) {
				store.push(item.FunctionName);
			}

			return store;
		}, []);
	}

	return result;
};

const initialize = (alias: string) => {
	const config = credentialsMap.get(alias) as Credentials;
	AWS.config.update(config);

	lambdaOperator = new AWS.Lambda();
};

const setCredential = (credentials: MetaCredentials) => {
	const {region, accessKeyId, secretAccessKey, alias} = credentials;
	credentialsMap.set(alias, {region, accessKeyId, secretAccessKey});
};

const validateCredentials = (credentials: MetaCredentials) => {
	const {region, accessKeyId, secretAccessKey, alias} = credentials;

	try {
		assert(region).is('String');
		assert(accessKeyId).is('String');
		assert(secretAccessKey).is('String');
		assert(alias).is('String');

		setCredential(credentials);
	} catch (error) {
		console.log('Invalid Credentials', error);
		throw new TypeError('Invalid credentials');
	}

	return {
		alias: {
			region,
			accessKeyId,
			secretAccessKey
		}
	};
};

const retrieveLambdaList = async (list?: any[], next?: string) => {
	const result = await lambdaOperator.listFunctions({Marker: next}).promise();
	const data = list ? [...list] : [];

	if (result.Functions) {
		data.push(...result.Functions);
	}

	if (result.NextMarker) {
		return retrieveLambdaList(data, result.NextMarker);
	}

	return data;
};

export const listLambdas = async (alias: string) => {
	if (!credentialsMap.has(alias)) {
		return Promise.reject('Unknown alias');
	}

	if (currentAlias !== alias) {
		initialize(alias);
		currentAlias = alias;

		return retrieveLambdaList();
	}

	return retrieveLambdaList();
};

export const compare = async (aliasv1: string, aliasv2: string, opts: CompareOptions = {LastModified: true}) => {
	initialize(aliasv1);
	const aliasv1Data = await listLambdas(aliasv1);

	initialize(aliasv2);
	const aliasv2Data = await listLambdas(aliasv2);

	return compareList(aliasv1Data, aliasv2Data, opts);
};

export const addAlias = (alias: string, credentials: Credentials) => {
	return validateCredentials({alias, ...credentials});
};

export const listAliases = (opts: ListAliasesOptions = {credentials: false}) => {
	if (opts.credentials) {
		return Array.from(credentialsMap.keys())
			.reduce((store, value) => add(store, value, credentialsMap.get(value)), {});
	}

	return Array.from(credentialsMap.keys());
};
