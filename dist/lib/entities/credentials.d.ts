export interface Credentials {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}
export interface MetaCredentials extends Credentials {
    alias: string;
}
