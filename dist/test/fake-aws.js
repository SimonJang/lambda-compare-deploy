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
const sinon = require("sinon");
const moment = require("moment");
const stub = AWS;
class AWSLambda {
    listFunctions(_) {
        // Mocking responses in bootstrap file
        console.log('Listing listFunctions args', _);
    }
}
exports.AWSLambda = AWSLambda;
const lambda = new AWSLambda();
exports.lambda = lambda;
stub.Lambda = function () {
    return lambda;
};
exports.stubListFunctions = sinon.stub(lambda, 'listFunctions');
exports.stubListFunctions.withArgs().returns({ promise: () => __awaiter(this, void 0, void 0, function* () {
        return Promise.resolve({
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
        });
    }) });
exports.stubListFunctions.withArgs({ Marker: '159753' }).returns({ promise: () => __awaiter(this, void 0, void 0, function* () {
        return Promise.resolve({
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
        });
    }) });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1hd3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2Zha2UtYXdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLGlDQUFpQztBQUVqQyxNQUFNLElBQUksR0FBUSxHQUFHLENBQUM7QUFFdEI7SUFDQyxhQUFhLENBQUMsQ0FBQztRQUNkLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRDtBQUxELDhCQUtDO0FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQU12Qix3QkFBTTtBQUpkLElBQUksQ0FBQyxNQUFNLEdBQUc7SUFDYixPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMsQ0FBQztBQUlXLFFBQUEsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDckUseUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtRQUFDLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUMxRSxTQUFTLEVBQUU7Z0JBQ1Y7b0JBQ0MsWUFBWSxFQUFFLE9BQU87b0JBQ3JCLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2lCQUMzQztnQkFDRDtvQkFDQyxZQUFZLEVBQUUsV0FBVztvQkFDekIsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7aUJBQzNDO2dCQUNEO29CQUNDLFlBQVksRUFBRSxJQUFJO29CQUNsQixZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztpQkFDM0M7YUFDRDtZQUNELFVBQVUsRUFBRSxRQUFRO1NBQ3BCLENBQUMsQ0FBQTtNQUFBLEVBQUMsQ0FBQyxDQUFDO0FBQ0wseUJBQWlCLENBQUMsUUFBUSxDQUFDLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtRQUFDLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUM1RixTQUFTLEVBQUU7Z0JBQ1Y7b0JBQ0MsWUFBWSxFQUFFLEtBQUs7b0JBQ25CLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2lCQUMzQztnQkFDRDtvQkFDQyxZQUFZLEVBQUUsU0FBUztvQkFDdkIsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7aUJBQzNDO2FBQ0Q7U0FDRCxDQUFDLENBQUE7TUFBQSxFQUFDLENBQUMsQ0FBQyJ9