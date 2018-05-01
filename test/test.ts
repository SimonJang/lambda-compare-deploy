import test from 'ava';
import * as sinon from 'sinon';
import * as moment from 'moment';
import {lambda, stubListFunctions} from './fake-aws';
import * as operations from '../index';

test.beforeEach(() => {
	stubListFunctions.resetHistory();
});

test('should fail when setting incomplete alias', t => {
	const data: any = {
		accessKeyId: '123foo',
		secretAccessKey: '456foo'
	};

	t.throws(() => operations.addAlias('foo', data));
});

test('should set alias', t => {
	operations.addAlias('foo', {
		region: 'eu-west-1',
		accessKeyId: '123foo',
		secretAccessKey: '456foo'
	});

	t.deepEqual(operations.listAliases(), ['foo']);
	t.deepEqual(operations.listAliases({credentials: true}), {
		foo: {
			region: 'eu-west-1',
			accessKeyId: '123foo',
			secretAccessKey: '456foo'
		}
	});
});

test('should list the different aliases', t => {
	operations.addAlias('foo', {
		region: 'eu-west-1',
		accessKeyId: '123foo',
		secretAccessKey: '456foo'
	});

	operations.addAlias('baz', {
		region: 'eu-west-1',
		accessKeyId: '123baz',
		secretAccessKey: '456baz'
	});

	t.deepEqual(operations.listAliases(), ['foo', 'baz']);
	t.deepEqual(operations.listAliases({credentials: true}), {
		foo: {
			region: 'eu-west-1',
			accessKeyId: '123foo',
			secretAccessKey: '456foo'
		},
		baz: {
			region: 'eu-west-1',
			accessKeyId: '123baz',
			secretAccessKey: '456baz'
		}
	});
});

test('should list the lambdas', async t => {
	operations.addAlias('bar', {
		region: 'eu-west-1',
		accessKeyId: '123bar',
		secretAccessKey: '456bar'
	});

	const lambdaList = await operations.listLambdas('bar');

	t.true((lambda.listFunctions as any).called);
	t.deepEqual(lambdaList, [
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
		},
		{
			FunctionName: 'r&d',
			LastModified: moment().format('YYYY-MM-DD')
		},
		{
			FunctionName: 'support',
			LastModified: moment().format('YYYY-MM-DD')
		}
	]);
});

test('should throw when an unknown alias is used', async t => {
	await t.throws(operations.listLambdas('foos'));
});

test('should compare different lambda output', async t => {
	const listLambdaStub = sinon.stub(operations, 'listLambdas');
	listLambdaStub.withArgs('foobar').resolves([
		{
			FunctionName: 'sales',
			LastModified: '2018-05-07',
			CodeSize: '12444'
		},
		{
			FunctionName: 'marketing',
			LastModified: '2018-05-07',
			CodeSize: '12444'
		},
		{
			FunctionName: 'hr',
			LastModified: '2018-05-07',
			CodeSize: '12444'
		},
		{
			FunctionName: 'r&d',
			LastModified: '2018-05-07',
			CodeSize: '12444'
		},
		{
			FunctionName: 'support',
			LastModified: '2018-05-07',
			CodeSize: '12444'
		}
	]);

	listLambdaStub.withArgs('foobaz').resolves([
		{
			FunctionName: 'hr',
			LastModified: '2018-05-07',
			CodeSize: '12424'
		},
		{
			FunctionName: 'r&d',
			LastModified: '2018-04-07',
			CodeSize: '12144'
		},
		{
			FunctionName: 'support',
			LastModified: '2018-06-07',
			CodeSize: '12344'
		}
	]);

	operations.addAlias('foobar', {
		region: 'eu-west-1',
		accessKeyId: '123foo',
		secretAccessKey: '456foo'
	});

	operations.addAlias('foobaz', {
		region: 'eu-west-1',
		accessKeyId: '123baz',
		secretAccessKey: '456baz'
	});

	const comparison = await operations.compare('foobar', 'foobaz');

	t.deepEqual(comparison, {
		LastModified: [
			'r&d',
			'support'
		]
	});

	const secondComparison = await operations.compare('foobar', 'foobaz', {LastModified: true, CodeSize: true});

	t.deepEqual(secondComparison, {
		LastModified: [
			'r&d',
			'support'
		],
		CodeSize: [
			'hr',
			'r&d',
			'support'
		]
	});
});
