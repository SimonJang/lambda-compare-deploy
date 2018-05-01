/// <reference types="sinon" />
import * as sinon from 'sinon';
export declare class AWSLambda {
    listFunctions(_: any): void;
}
declare const lambda: AWSLambda;
export { lambda };
export declare const stubListFunctions: sinon.SinonStub;
