import * as AWS from 'aws-sdk';
import * as sinon from 'sinon';
import * as moment from 'moment';

const stub: any = AWS;

export class AWSLambda {
	listFunctions(_) {
		// Mocking responses in bootstrap file
		console.log('Listing listFunctions args', _);
	}
}

const lambda = new AWSLambda();

stub.Lambda = function () { // tslint:disable-line
	return lambda;
};

export {lambda};

export const stubListFunctions = sinon.stub(lambda, 'listFunctions');
stubListFunctions.withArgs().returns({promise: async () => Promise.resolve({
	Functions: [
		{
			FunctionName: 'sales',
			LastModified: moment().format('YYYY-MM-DD')
		},
		{
			FunctionName: 'marketing',
			LastModified: moment().format('YYYY-MM-DD')
		},
		{
			FunctionName: 'hr',
			LastModified: moment().format('YYYY-MM-DD')
		}
	],
	NextMarker: '159753'
})});
stubListFunctions.withArgs({Marker: '159753'}).returns({promise: async () => Promise.resolve({
	Functions: [
		{
			FunctionName: 'r&d',
			LastModified: moment().format('YYYY-MM-DD')
		},
		{
			FunctionName: 'support',
			LastModified: moment().format('YYYY-MM-DD')
		}
	]
})});
