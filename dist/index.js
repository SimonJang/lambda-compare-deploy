"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const assert = require("type-assert");
const credentialsMap = new Map();
let currentAlias;
let lambdaOperator;
const add = (map, key, value) => {
    return Object.assign({}, map, { [key]: value });
};
const compareList = (base, comparing, opts) => {
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
const initialize = (alias) => {
    const config = credentialsMap.get(alias);
    AWS.config.update(config);
    lambdaOperator = new AWS.Lambda();
};
const setCredential = (credentials) => {
    const { region, accessKeyId, secretAccessKey, alias } = credentials;
    credentialsMap.set(alias, { region, accessKeyId, secretAccessKey });
};
const validateCredentials = (credentials) => {
    const { region, accessKeyId, secretAccessKey, alias } = credentials;
    try {
        assert(region).is('String');
        assert(accessKeyId).is('String');
        assert(secretAccessKey).is('String');
        assert(alias).is('String');
        setCredential(credentials);
    }
    catch (error) {
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
const retrieveLambdaList = (list, next) => __awaiter(this, void 0, void 0, function* () {
    const result = yield lambdaOperator.listFunctions({ Marker: next }).promise();
    const data = list ? [...list] : [];
    if (result.Functions) {
        data.push(...result.Functions);
    }
    if (result.NextMarker) {
        return retrieveLambdaList(data, result.NextMarker);
    }
    return data;
});
exports.listLambdas = (alias) => __awaiter(this, void 0, void 0, function* () {
    if (!credentialsMap.has(alias)) {
        return Promise.reject('Unknown alias');
    }
    if (currentAlias !== alias) {
        initialize(alias);
        currentAlias = alias;
        return retrieveLambdaList();
    }
    return retrieveLambdaList();
});
exports.compare = (aliasv1, aliasv2, opts = { LastModified: true }) => __awaiter(this, void 0, void 0, function* () {
    initialize(aliasv1);
    const aliasv1Data = yield exports.listLambdas(aliasv1);
    initialize(aliasv2);
    const aliasv2Data = yield exports.listLambdas(aliasv2);
    return compareList(aliasv1Data, aliasv2Data, opts);
});
exports.addAlias = (alias, credentials) => {
    return validateCredentials(Object.assign({ alias }, credentials));
};
exports.listAliases = (opts = { credentials: false }) => {
    if (opts.credentials) {
        return Array.from(credentialsMap.keys())
            .reduce((store, value) => add(store, value, credentialsMap.get(value)), {});
    }
    return Array.from(credentialsMap.keys());
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUd0QyxNQUFNLGNBQWMsR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUMzRCxJQUFJLFlBQW9CLENBQUM7QUFDekIsSUFBSSxjQUFtQixDQUFDO0FBRXhCLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUMvQix5QkFBVyxHQUFHLElBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUU7QUFDL0IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFXLEVBQUUsU0FBZ0IsRUFBRSxJQUFvQixFQUFFLEVBQUU7SUFDM0UsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWxCLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN6QyxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckYsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDOUI7WUFFRCxPQUFPLEtBQUssQ0FBQztRQUNkLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNQO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFD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