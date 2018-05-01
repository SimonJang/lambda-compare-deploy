# lambda-compare [![Build Status](https://travis-ci.org/SimonJang/lambda-compare-deploy.svg?branch=master)](https://travis-ci.org/SimonJang/lambda-compare-deploy)

> Compare AWS Lambdas in different environments

## About

Handling different AWS environments is not easy and managing many lambdas in those environments is even harder. `lambda-compare` allows to quickly compare relevant deployment information of the different lambdas.

## IAM

Following IAM roles need to be configured for the credentials.

- **Lambda**
	- **listFunctions**

## Install

```
$ npm install lambda-compare
```

## Usage

```js
const comparator = require('lambda-compare');

comparator.addAlias('development', {
	region: 'eu-west-1',
	accessKeyId: 'AKIAIOSFODNN7EXAMPLE'
	secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
});

// {development: {region: 'eu-west-1', accessKeyId: 'AKIAIOSFODNN7EXAMPLE', secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'}}

comparator.listAliases({credentials: false})

// ['development']

comparator.listLambdas('development')
	.then(data => console.log(data))

// [{FunctionName: 'sales', LastModified: moment().format('YYYY-MM-DD')},{FunctionName: 'marketing', LastModified: moment().format('YYYY-MM-DD')}]

comparator.compare('development', 'production', {LastModified: true})
	.then(comparison => console.log(comparison))

// {LastModified: ['development', 'production']}
```

## API

### addAlias(aliasName, credentials)

#### aliasName

Type: `string`

Name of the alias

#### credentials

Type: `object`

AWS Credentials, stored in-memory. `region`, `secretAccessKey` and `accessKeyId` are **required**

### listAliases([opts])

#### opts

Type: `object`

Contains flag `credentials`. When no options object is provided, then the stored aliases are returned as `string[]`. Otherwise, the return consists of a map containing `alias:credentials` as key:value pairs

### listLambdas(alias)

#### alias

Type: `string`

Reference to a stored alias. Will request the lambdas used in the environment of the alias.

### compare(aliasNr1, aliasNr2, [opts])

#### aliasNr1

Type: `string`

Alias of first environment to be compared.

#### aliasNr2

Type: `string`

Alias of second environment to be compared.

#### opts

Type: `object`

Options to enhance to comparison. Uses by default `LastModified` but can be used in conjunction with `CodeSize`. Uses a `string:boolean` as key:value pair.

## License

MIT © [Simon Jang](https://github.com/SimonJang)
