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
const ava_1 = require("ava");
const sinon = require("sinon");
const moment = require("moment");
const fake_aws_1 = require("./fake-aws");
const operations = require("../index");
ava_1.default.beforeEach(() => {
    fake_aws_1.stubListFunctions.resetHistory();
});
ava_1.default('should fail when setting incomplete alias', t => {
    const data = {
        accessKeyId: '123foo',
        secretAccessKey: '456foo'
    };
    t.throws(() => operations.addAlias('foo', data));
});
ava_1.default('should set alias', t => {
    operations.addAlias('foo', {
        region: 'eu-west-1',
        accessKeyId: '123foo',
        secretAccessKey: '456foo'
    });
    t.deepEqual(operations.listAliases(), ['foo']);
    t.deepEqual(operations.listAliases({ credentials: true }), {
        foo: {
            region: 'eu-west-1',
            accessKeyId: '123foo',
            secretAccessKey: '456foo'
        }
    });
});
ava_1.default('should list the different aliases', t => {
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
    t.deepEqual(operations.listAliases({ credentials: true }), {
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
ava_1.default('should list the lambdas', (t) => __awaiter(this, void 0, void 0, function* () {
    operations.addAlias('bar', {
        region: 'eu-west-1',
        accessKeyId: '123bar',
        secretAccessKey: '456bar'
    });
    const lambdaList = yield operations.listLambdas('bar');
    t.true(fake_aws_1.lambda.listFunctions.called);
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
}));
ava_1.default('should throw when an unknown alias is used', (t) => __awaiter(this, void 0, void 0, function* () {
    yield t.throws(operations.listLambdas('foos'));
}));
ava_1.default('should compare different lambda output', (t) => __awaiter(this, void 0, void 0, function* () {
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
    const comparison = yield operations.compare('foobar', 'foobaz');
    t.deepEqual(comparison, {
        LastModified: [
            'r&d',
            'support'
        ]
    });
    const secondComparison = yield operations.compare('foobar', 'foobaz', { LastModified: true, CodeSize: true });
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
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkJBQXVCO0FBQ3ZCLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMseUNBQXFEO0FBQ3JELHVDQUF1QztBQUV2QyxhQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNwQiw0QkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQywyQ0FBMkMsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNyRCxNQUFNLElBQUksR0FBUTtRQUNqQixXQUFXLEVBQUUsUUFBUTtRQUNyQixlQUFlLEVBQUUsUUFBUTtLQUN6QixDQUFDO0lBRUYsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzVCLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQzFCLE1BQU0sRUFBRSxXQUFXO1FBQ25CLFdBQVcsRUFBRSxRQUFRO1FBQ3JCLGVBQWUsRUFBRSxRQUFRO0tBQ3pCLENBQUMsQ0FBQztJQUVILENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRTtRQUN4RCxHQUFHLEVBQUU7WUFDSixNQUFNLEVBQUUsV0FBVztZQUNuQixXQUFXLEVBQUUsUUFBUTtZQUNyQixlQUFlLEVBQUUsUUFBUTtTQUN6QjtLQUNELENBQUMs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