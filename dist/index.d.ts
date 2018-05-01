import { Credentials, CompareOptions, ListAliasesOptions } from './lib/entities';
export declare const listLambdas: (alias: string) => Promise<any>;
export declare const compare: (aliasv1: string, aliasv2: string, opts?: CompareOptions) => Promise<{}>;
export declare const addAlias: (alias: string, credentials: Credentials) => {
    alias: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
};
export declare const listAliases: (opts?: ListAliasesOptions) => any;
