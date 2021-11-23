
const SpreadCityAPI = require("..");
const { assert } = require('chai');

const API_KEY = process.env.TEST_API_KEY;
const API_SECRET = process.env.TEST_API_SECRET;

// test starting a session? 
// (might open a small position on your test account before stopping)
const TEST_CREATING = true;
const TEST_STARTING = true && TEST_CREATING;

const spreadCity = new SpreadCityAPI(API_KEY, API_SECRET);

const favName = null;

describe('API Test Suite', function () {

    it('tests getting config options', async function () {
        this.timeout(5_000);

        const res = await spreadCity.getOptions();

        console.log(res);

        assert(res, "No data returned");

        assert(res.strategies, "No strategies found in response");
        assert(res.strategies.length > 0, "Empty strategy array returned");
        assert(res.config, "No default config in response");

        assert(res.exchanges, "No exchanges found in response");
        assert(res.exchanges.length > 0, "Empty exchanges array returned");

        assert(res.tickers, "No tickers in response");


        for (var i = 0; i < res.exchanges.length; i++) {
            assert(res.tickers[res.exchanges[i].id], `${res.exchanges[i].name} does not have ticker array`);
            assert(res.tickers[res.exchanges[i].id].length > 0, `${res.exchanges[i].name} ticker array is empty`);
        }

    });


    it('tests getting active executors', async function () {

        const res = await spreadCity.getActiveInstances();

        // console.log(res);

        assert(res, "No data returned");
        assert(res.length >= 0, "Return value not array type");

        for (var i = 0; i < res.length; i++) {
            assert(res[i].id, "No instance ID returned");
            assert(res[i].config, "No instnace config returned");
            assert((res[i].running === true || res[i].running === false), "'running' attribute not returned")
        }

    });


    it('tests getting executor config history', async function () {

        const res = await spreadCity.history();

        // console.log(res);

        assert(res, "No data returned");
        assert(res.length >= 0, "Return value not array type");

        for (var i = 0; i < res.length; i++) {
            assert(res[i].id, "No instance ID returned");
            assert(res[i].config, "No instnace config returned");
            assert((res[i].status), "No instance status returned");
        }

    });

    it('tests getting fav configs', async function () {

        const res = await spreadCity.favoriteConfigs();

        // console.log(res);

        assert(res, "No data returned");
        assert(res.length >= 0, "Return value not array type");

        for (var i = 0; i < res.length; i++) {
            assert(res[i].id, "No instance ID returned");
            assert(res[i].config, "No instnace config returned");
            assert((res[i].status), "No instance status returned");
        }

    });



    if (TEST_CREATING) {

        // create instance
        it('tests instance flow', async function () {

            this.timeout(10_000);

            var res;

            // create instance

            const config = {
                startQuote: 0.0001,
                startUnwind: 0.05,
                maxPositionSize: 200,
                deltaTolerance: 20,
                tickIncrement: 0.5,
                strategy: 'hug',
                loopInterval: 5000,
                AtoB: 'sell',
                quoteSize: 20,

            }
            const maker = {
                id: 'ftx',
                ticker: 'BTC-PERP',
                testnet: false,
                key: process.env.TEST_MAKER_KEY,
                secret: process.env.TEST_MAKER_SECRET,
                subaccount: process.env.TEST_MAKER_SUBACCOUNT || null
            }
            const taker = {
                id: 'ftx',
                ticker: 'BTC-PERP',
                testnet: false,
                key: process.env.TEST_TAKER_KEY,
                secret: process.env.TEST_TAKER_SECRET,
                subaccount: process.env.TEST_TAKER_SUBACCOUNT || null
            }

            res = await spreadCity.createInstance(config, maker, taker);

            // console.log(res);

            assert(res, "No data returned");
            assert(res.id, "Return value does not contain ID of created instance");

            const instanceID = res.id;




            // get the active instance

            res = await spreadCity.getActiveInstance(instanceID);
            // console.log(res);

            assert(res, "No data returned");
            assert.equal(res.id, instanceID, "Instance ID returned does not match parameter");
            assert(res.config, "No instnace config returned");
            assert((res.running === true || res.running === false), "'running' attribute not returned")

            console.log(instanceID);




            if (TEST_STARTING) {
    
                //  start instance

                res = await spreadCity.startInstance(instanceID);

                // console.log(res);

                assert(res, "No data returned");
                assert(res.message, "No message given by return");
    
            }




            // set instance as fav

            res = await spreadCity.setFavorite(instanceID, favName);

            // console.log(res);

            assert(res, "No data returned");
            assert(res.message, "No message returned");




            // stop instance

            if (TEST_STARTING) {

                res = await spreadCity.stopInstance(instanceID);

                // console.log(res);

                assert(res, "No data returned");
                assert(res.message, "No message given by return");

            }

        });

    }

})
