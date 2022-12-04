import fs from 'fs'
import dotenv from 'dotenv'
import { Wallet } from '@ethersproject/wallet'
import { hexlify, concat } from '@ethersproject/bytes'
import { JsonRpcProvider } from '@ethersproject/providers'
import { defaultAbiCoder as abi } from '@ethersproject/abi'
dotenv.config()

const WorldCoinIdModule = JSON.parse(fs.readFileSync('./out/WorldCoinIdModule.sol/WorldCoinIdModule.json', 'utf-8'))

let validConfig = true
if (process.env.RPC_URL === undefined) {
    console.log('Missing RPC_URL')
    validConfig = false
}
if (process.env.PRIVATE_KEY === undefined) {
    console.log('Missing PRIVATE_KEY')
    validConfig = false
}
if (!validConfig) process.exit(1)

const provider = new JsonRpcProvider(process.env.RPC_URL)
const wallet = new Wallet(process.env.PRIVATE_KEY, provider)

async function main() {
    const network = await provider.getNetwork()

    let tx = await wallet.sendTransaction({
        data: hexlify(
            concat([
                WorldCoinIdModule.bytecode.object,
                abi.encode(WorldCoinIdModule.abi[0].inputs, [
                    "0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5",
                    "0xa2F80FecB88f4b431E95815f97B0C62f2e926276"
                ]),
            ])
        ),
    })

    tx = await tx.wait()
    console.log(tx.contractAddress)

    // spinner.succeed(`Deployed WorldCoinIdModule to ${tx.contractAddress}`)
}

main(...process.argv.splice(2)).then(() => process.exit(0))
