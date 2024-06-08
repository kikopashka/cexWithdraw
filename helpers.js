import winston from "winston"



export const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.colorize({
        all: false,
        colors: { error: 'red' } 
      }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs.log",
      level: "info"
    })
    ]
});






export async function getNetworkNameOKX(networkName){
  let network
  switch(networkName){
    case "arbitrum" : return network = "Arbitrum One"
    case "base" : return network = "Base"
    case "ethereum" : return network = "ERC20"
    case "linea" : return network = "Linea"
    case "optimism" : return network = "Optimism"
    case "zkSync" : return network = "zkSync Era"
  }
}





export function getRandomAmountCex(low, high) {
  const number = Math.random() * (high - low) + low;
  return Number(number.toFixed(5));
};


export async function randomDelay(min, max) {
  let number = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
  logger.info(`Delay ${number / 1000}  started...`)
  await delay(number)
}



export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}