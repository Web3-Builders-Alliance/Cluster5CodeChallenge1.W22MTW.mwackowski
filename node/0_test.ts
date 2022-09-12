import { CosmWasmClient, SigningCosmWasmClient, Secp256k1HdWallet, GasPrice, Coin } from "cosmwasm";

import * as fs from 'fs';
import axios from 'axios';


const rpcEndpoint = "https://rpc.uni.juno.deuslabs.fi";

const config = {
    chainId: "uni-3",
    rpcEndpoint: rpcEndpoint,
    prefix: "juno",
};

const wasmswap_wasm = fs.readFileSync("../artifacts/wasmswap.wasm");
const cw20_base_wasm = fs.readFileSync("../scripts/cw20_base.wasm");

const mnemonic =
    "test peanut elevator motor proud globe obtain gasp sad balance nature ladder";

const prefix = "juno";

async function setupClient(mnemonic:string): Promise<SigningCosmWasmClient> {
    let gas = GasPrice.fromString("0.025ujunox");
    let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: prefix });
    let client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: gas });
    return client;
}

async function getAddress(mnemonic:string) {
    let wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: prefix });
    let accounts = await wallet.getAccounts();
    return accounts[0].address;
}

describe("Cosmwasm Template Tests", () => {
    xit("Generate Wallet", async () => {
        let wallet = await Secp256k1HdWallet.generate(12);
        console.log(wallet.mnemonic);
    });

    xit("Upload wasm-swap to testnet", async () => {
        //upload NFT contract to testnet twice and get two code_id's
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.upload(sender, wasmswap_wasm, "auto", undefined);
        console.log(res);
    }).timeout(100000);

    xit("Upload cw20-base to testnet", async () => {
        //upload NFT contract to testnet twice and get two code_id's
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.upload(sender, cw20_base_wasm, "auto", undefined);
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token1 cw20-base on testnet", async () => {
        let code_id = 0;
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, code_id, {}, "token1", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token2 cw20-base on testnet", async () => {
        let code_id = 0;
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, code_id, {}, "token2", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token1-token2 wasm-swap on testnet", async () => {
        let code_id = 0;
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, code_id, {}, "wasmswap", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("add token1-token2 liquidity to swap on testnet", async () => {
        //using contract address mint a NFT on the testnet.
        let contract_address = "";
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.execute(sender, contract_address, {}, "auto");
        console.log(res);
    }).timeout(100000);

    xit("swap on testnet", async () => {
        //using contract address mint a NFT on the testnet.
        let contract_address = "";
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.execute(sender, contract_address, {}, "auto");
        console.log(res);
    }).timeout(100000);
});