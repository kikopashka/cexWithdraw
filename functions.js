import ccxt from "ccxt"
import { logger, getNetworkNameOKX, delay } from "./helpers.js"



export async function okxWithdraw(apiKey, secret, pass, token, amount, address, network){
    try{
      logger.info(`Starting the withdrawal from OKX, amount is ${amount + token}`)
      let networkName = await getNetworkNameOKX(network)
    //   const provider = new ethers.JsonRpcProvider(general[network])
    //   const balanceBefore = await provider.getBalance(address)
      const cexAccount = new ccxt.okx({
          'apiKey': apiKey,
          'secret': secret,
          'password': pass,
          'enableRateLimit': true
        })

        let subAccounts = await cexAccount.privateGetUsersSubaccountList()
        let accs = []
        for(let acc of subAccounts.data){
            accs.push(acc.subAcct)
        }
        for(let acc of accs){
          let subBalances = await cexAccount.privateGetAssetSubaccountBalances({subAcct: acc, currency: token})
          if(subBalances.data.length > 0){
              for(let balances of subBalances.data){
                  if(balances.ccy == token){
                      // nonZeroAccs.push({
                      //     name: acc,
                      //     balances: balances.availBal
                      // })
                      await cexAccount.transfer(token, balances.availBal, 'funding', 'funding', {
                          type: '2',
                          subAcct: acc
                        })
                    }
                }
            }
        }

      
      const chainName = await cexAccount.fetchCurrencies()
      let y = chainName[token].networks[networkName].id
      const withdraw = await cexAccount.withdraw(
          token,
          amount,
          address,
          {
              toAddress: address,
              chain: chainName[token].networks[networkName].id,
              dest: 4,
              fee: chainName[token].networks[networkName].fee,
              pwd: '-',
              amt: amount,
              network: chainName[token].networks[networkName].network

          }
      )
      logger.info(`${amount + token} was withdrawn to the wallet ${address} in ${network}`)
  }catch(e){
      if(e.name == 'InsufficientFunds'){
          logger.error('Insufficient Funds on OKX account')
          await delay(60000)
          await withdrawOKX(apiKey, secret, pass, token, amount, address, network)
      }else if (e.name == 'PermissionDenied'){
          logger.error(`OKX IP IS NOT WHITELISTED!!!`)
          await delay(60000)
          await withdrawOKX(apiKey, secret, pass, token, amount, address, network)
      }else if(e.name == 'InvalidAddress'){
          logger.error('Withdrawal address is not allowlisted')
          await delay(60000)
          await withdrawOKX(apiKey, secret, pass, token, amount, address, network)
      }else if(e.name == 'ExchangeError'){
          logger.error(`Withdrawals suspended in ${network} network, Waiting 1 hour...`)
          await delay(36000000)
          await withdrawOKX(apiKey, secret, pass, token, amount, address, network)
      }else{
          logger.error(e)
          await delay(120000)
          await withdrawOKX(apiKey, secret, pass, token, amount, address, network)
      }
    }
}







export async function binanceWithdraw(apiKey, secret, amount, token, network, address) {
    try{
        const accountBinance = new ccxt.binance({
        apiKey: apiKey,                   //всталвеям
        secret: secret,                   //вставляем
        enableRateLimit: true,
        timeout: 30000,
        options: {
            defaultType: 'spot',
        },
        });
        const chainName = await accountBinance.fetchCurrencies()
        await accountBinance.withdraw(token, amount, address, null, { network: network });
    }catch(e){
        logger.error(`Unknown problem with binanceWithdraw - ${e}`)
    }
  };