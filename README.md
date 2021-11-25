# Spread City API

the `spread-city` npm package is a nodejs wrapper for the spread city API

## Installation

Install to your project with:
`npm install --save spread-city`


## Examples

First import and initialize a new instance of the API, provide your API key and Secret, you can generate keys [here](https://mrspreader.com/config)

```
const SpreadCityAPI = require('spread-city');
 
const myApiKey = '123';
const myApiSecret = '456';

const scAPI = new SpreadCityAPI(myApiKey, myApiSecret);

```

Then use the methods of the api object to make requests and get responses

```

const options = await await scAPI.getOptions();

console.log(options);

const instanceID = 'abcdef'

const executor = await scAPI.startInstance(instanceID);

console.log(executor);

```

see `./examples/example.js` for full example code


## Methods Documentation

### `SpreadCityAPI.createInstance(config, maker, taker)`

#### `config`
```
{
    startQuote, // % change threshold for arbitrage
    startUnwind, // flip direction to take profit while % change is above this threshold
    maxPositionSize, //max position size in USD
    deltaTolerance, // allowed difference between maker and taker positions before error (USD)
    tickIncrement,
    strategy, // strategy for placing limit orders ('hug' or 'ninja')
    loopInterval, // time in between execution loops (milliseconds)
    AtoB, // maker order direction
    quoteSize, // order size (usd)
}
```

#### `maker` / `taker`
```
{
    id,
    ticker,
    testnet,
    key,
    secret,
    keyPair, // id of a saved key pair to use (key/secret are ignored unless this param is null)
    password, // password for the desired keyPair (only used if keyPair param is not null)
    subaccount
}
```

#### Returns
```
{
    id // id of the executor that has just been created
}
```

### `SpreadCityAPI.getOptions()`

#### Returns
```
{
    strategies: , // an array of strategy names ex: ['hug', 'ninja']
    config: {...}, // the default configuration
    exchanges [ // a list of all supported exchanges
        {
            name,
            id, // ID of an exhange (usually exchange name but all lowercase)
            supportTest, // boolean, whether the exchange has a testnet to connect to
            supportSub, // boolean, whether the exchange supports subaccount name when creating instances
        },
        { ... }
    ], 
    tickers: { // for every supported exchange, an array of all of the supported tickers (strings)
        exchange1: [...],
        exchange2: [...]
    }
}
```

### `SpreadCityAPI.getActiveInstances()`

#### Returns
```
[
    {
        id, // executor ID,
        config,
        running: // boolean
    },
    { ... }
]
```


### `SpreadCityAPI.startInstance(id)`

#### `id`
The ID of the instance you would like to start


#### Returns
```
{
    message // success message if executor has started
}
```


### `SpreadCityAPI.stopInstance(id)`

#### `id`
The ID of the instance you would like to start


#### Returns
```
{
    message // success message if executor has started
}
```


### `SpreadCityAPI.stopInstance(id)`

#### `id`
The ID of the instance you would like to stop


#### Returns
```
{
    message // success message if executor has stopped
}
```

### `SpreadCityAPI.setFavorite(instanceID, favName)`

#### `instanceID`
The ID of the instance you would like to set as a favorite

#### `favName`
The label you would like this favorited instance to hold

#### Returns
```
{
    message // success message if favorite was saved
}
```



### `SpreadCityAPI.history()`

#### Returns
```
[
    {
        id, // executor ID
        config,
        status, // 'not started' / 'running' / 'destroyed'
        fav, // name of fav (string), or null
    },
    { ... }
]
```

### `SpreadCityAPI.favoriteConfigs()`

#### Returns
```
[
    {
        id, // executor ID
        config,
        status, // 'not started' / 'running' / 'destroyed'
        fav,
    },
    { ... }
]
```

### `SpreadCityAPI.getActiveInstance(id)`

#### `id`
The ID of the instance you would like to set as a favorite

#### Returns
```
{
    id,
    config,
    running, // boolean, whether the instance is running
}
```