import { CosmWasmClient, SigningCosmWasmClient, Secp256k1HdWallet, GasPrice, Coin } from "cosmwasm";

import * as fs from 'fs';
import axios from 'axios';


const rpcEndpoint = "https://juno-testnet-rpc.polkachu.com/";

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

const amm_code_id = 0;
const cw20_code_id = 0;

const cw20_token1_address = "";
const cw20_token2_address = "";
const amm_token1_token2 = "";

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

    xit("Send Testnet Tokens", async () => {
        let client = await setupClient(mnemonic);
        let coin:Coin = {denom: "ujunox", amount: "3000000"};
        client.sendTokens(await getAddress(mnemonic), "juno1jjeaun6mlrtv0wzfpt9u57hx6keqsvv7ltuj4j", [coin], "auto");
    }).timeout(100000);

    it("Upload wasm-swap to testnet", async () => {
        //upload NFT contract to testnet twice and get two code_id's
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.upload(sender, cw20_base_wasm, "auto", undefined);
        console.log(res);
    }).timeout(100000);

    xit("Upload cw20-base to testnet", async () => {
        //upload NFT contract to testnet twice and get two code_id's
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.upload(sender, cw20_base_wasm, "auto", undefined);
        console.log(res);
    }).timeout(100000);

    /*
        let msg = cw20_base::msg::InstantiateMsg {
        name,
        symbol,
        decimals: 6,
        initial_balances: vec![Cw20Coin {
            address: owner.to_string(),
            amount: balance,
        }],
        mint: None,
        marketing: None,
    };*/

    xit("Instantiate token1 cw20-base on testnet", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, cw20_code_id, {name:"Axelar USDC", symbol:"auUSDC", decimals:6, initial_balances:[{address:sender, amount:"5000000"}]}, "token1", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token2 cw20-base on testnet", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, cw20_code_id, {name:"test token", symbol:"TTKN", decimals:6, initial_balances:[{address:sender, amount:"5000000"}]}, "token2", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);


    /*
        let msg = InstantiateMsg {
        token1_denom: Denom::Native(native_denom),
        token2_denom: Denom::Cw20(cash.addr()),
        lp_token_code_id: cw20_id,
        owner: Some(owner.to_string()),
        lp_fee_percent,
        protocol_fee_percent,
        protocol_fee_recipient,
    };*/

    xit("Instantiate token1-token2 wasm-swap on testnet", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);

    }).timeout(100000);

    /*    AddLiquidity {
        token1_amount: Uint128,
        min_liquidity: Uint128,
        max_token2: Uint128,
        expiration: Option<Expiration>,
    },*/

    xit("add token1-token2 liquidity to swap on testnet", async () => {
        //using contract address mint a NFT on the testnet.
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);

        //look at increase allowance msg for cw20.

        //add and allowance token1 and token2

        //add liquidity
 
    }).timeout(100000);




    xit("Query info for token1-token2 amm", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token2, { info: {} });
        console.log(res);
    }).timeout(100000);

    xit("Query balance from amm", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token2, { balance:{address:sender} });
        console.log(res);
    }).timeout(100000);

    xit("Query price for token1", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token2, { token1_for_token2_price:{token1_amount:"5000"} });
        console.log(res);
    }).timeout(100000);

    xit("Query price for token2", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token2, { token2_for_token1_price:{token2_amount:"5000"} });
        console.log(res);
    }).timeout(100000);

    /*
        Swap {
        input_token: TokenSelect,
        input_amount: Uint128,
        min_output: Uint128,
        expiration: Option<Expiration>,
    },*/

    xit("swap on testnet", async () => {
        //using contract address mint a NFT on the testnet.
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
    }).timeout(100000);
    
});