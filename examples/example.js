require('dotenv').config;

const SpreadCityAPI = require("..");

const scAPI = new SpreadCityAPI(process.env.EXAMPLE_API_KEY, process.env.EXAMPLE_API_SECRET);

example();
async function example() {

    try {

        const pastInstances = await scAPI.history();

        // select my most recent config
        if (pastInstances.length > 0) {

            const useConfig = pastInstances[0].config;

            // maker: ftx BTC-PERP
            const maker = {
                id: 'ftx',
                ticker: 'BTC-PERP',
                testnet: false,
                key: process.env.EXAMPLE_FTX_KEY,
                secret: process.env.EXAMPLE_FTX_SECRET,
                subaccount: 'maker'
            }

            // taker: ftx BTC-1231
            const taker = {
                id: 'ftx',
                ticker: 'BTC-1231',
                testnet: false,
                key: process.env.EXAMPLE_FTX_KEY,
                secret: process.env.EXAMPLE_FTX_SECRET,
                subaccount: 'taker'
            }

            const result = await scAPI.createInstance(useConfig, maker, taker, 'FTX-PERPxFTX-DEC');

            console.log('creation success');

            // start instance
            await scAPI.startInstance(result.id);

            // run for 2 minutes, then stop
            setTimeout(() => {
                scAPI.getOptions()
                .then(res => {throw res})
                .catch(err => console.log(err))

            }, 120_000);
        }
        
    }
    catch (err) {
        console.log(err);
    }

}