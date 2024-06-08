import { binanceWithdraw, okxWithdraw } from "./functions.js"
import fs from "fs"
import { logger,getRandomAmountCex, randomDelay } from "./helpers.js"
import { general } from "./settings.js"









fs.writeFileSync('logs.log', '');
const addresses = fs.readFileSync("addresses.txt").toString().replace(/\r\n/g,'\n').split('\n');

for(let i = 0; i < addresses.length; i++){
    logger.info(`Starting with wallet - ${i+1}`)
    let amount = getRandomAmountCex(general.amountMin, general.amountMax)
    if(general.okx){
        await okxWithdraw(general.apiKey, general.secret, general.pass, general.token, amount, addresses[i], general.network)
    } else if (general.binance){
        await binanceWithdraw(general.apiKey, general.secret, amount, general.token, general.network, addresses[i])
    }
    logger.info(`${amount} ${general.token} was withdrawn to ${addresses[i]}`)
    await randomDelay(general.delayAfterWithdrawMin, general.delayAfterWithdrawMax)
}
