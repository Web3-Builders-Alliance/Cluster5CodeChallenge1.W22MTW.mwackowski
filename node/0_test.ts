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

const amm_code_id = 3871;
const cw20_code_id = 3872;

const cw20_token1_address = "juno1s80kymenekqsz2va7qglwumh2rcza9lymej0pzgam0mw5gv2l5gsdsqpu5";
const cw20_token2_address = "juno1h4fvap7wxvk7x6xuvp280ee907ah974q33lkc8d4d9eesqtymgfqx4mskc";
const amm_token1_token2 = "juno1mzw6vj2zefn04pcwfge0gam49sr7m006n23vc9m8c2uhv56mxmtsy0jazf";

const amm_token1_token1 = "juno19cdfsfmwzp52yv33zmhnh0e9473t5t8q6h4u3p785g994wdplzrqr3wv4q";

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
        let res = await client.instantiate(sender, cw20_code_id, {name:"token1", symbol:"TKN", decimals:6, initial_balances:[{address:sender, amount:"5000000"}]}, "token1", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token2 cw20-base on testnet", async () => {
        let code_id = 0;
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, cw20_code_id, {name:"token2", symbol:"TKNT", decimals:6, initial_balances:[{address:sender, amount:"5000000"}]}, "token2", "auto", {admin:sender});
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
        let res = await client.instantiate(sender, amm_code_id, { token1_denom: {cw20:cw20_token1_address}, token2_denom: {cw20:cw20_token2_address}, lp_token_code_id: cw20_code_id, owner:sender, lp_fee_percent:"0.2", protocol_fee_percent:"0.1", protocol_fee_recipient:sender }, "wasmswap", "auto", {admin:sender});
        console.log(res);
    }).timeout(100000);

    xit("Instantiate token1-token1 wasm-swap on testnet", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.instantiate(sender, amm_code_id, { token1_denom: {cw20:cw20_token1_address}, token2_denom: {cw20:cw20_token1_address}, lp_token_code_id: cw20_code_id, owner:sender, lp_fee_percent:"0.2", protocol_fee_percent:"0.1", protocol_fee_recipient:sender }, "wasmswap", "auto", {admin:sender});
        console.log(res);
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

        //add and allowance token1 and token2
        let allow_1_res = await client.execute(sender, cw20_token1_address, {increase_allowance:{spender:amm_token1_token2, amount:"1000000"}}, "auto");
        let allow_2_res = await client.execute(sender, cw20_token2_address, {increase_allowance:{spender:amm_token1_token2, amount:"1000000"}}, "auto");
        let res = await client.execute(sender, amm_token1_token2, { add_liquidity:{ token1_amount:"5000", min_liquidity:"5000", max_token2:"5000"} }, "auto");
        console.log(res);
    }).timeout(100000);

    xit("add token1-token1 liquidity to swap on testnet", async () => {
        //using contract address mint a NFT on the testnet.
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);

        //add and allowance token1 and token2
        let allow_1_res = await client.execute(sender, cw20_token1_address, {increase_allowance:{spender:amm_token1_token1, amount:"1000000"}}, "auto");
        //let allow_2_res = await client.execute(sender, cw20_token1_address, {increase_allowance:{spender:amm_token1_token1, amount:"1000000"}}, "auto");
        let res = await client.execute(sender, amm_token1_token1, { add_liquidity:{ token1_amount:"5000", min_liquidity:"5000", max_token2:"5000"} }, "auto");
        console.log(res);
    }).timeout(100000);


    xit("Query info for token1-token2 amm", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token2, { info: {} });
        console.log(res);
    }).timeout(100000);

    xit("Query info for token1-token1 amm", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token1, { info: {} });
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

    //price query for token1-token1
    xit("Query price for token1", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token1, { token1_for_token2_price:{token1_amount:"5000"} });
        console.log(res);
    }).timeout(100000);

    
    xit("Query price for token2", async () => {
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.queryContractSmart(amm_token1_token1, { token2_for_token1_price:{token2_amount:"5000"} });
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
        let res = await client.execute(sender, amm_token1_token2, {swap:{input_token:"Token1", input_amount:"1000", min_output:"594"}}, "auto");
        console.log(res);
    }).timeout(100000);


    xit("swap on testnet for token1-token1 amm", async () => {
        //using contract address mint a NFT on the testnet.
        let client = await setupClient(mnemonic);
        let sender = await getAddress(mnemonic);
        let res = await client.execute(sender, amm_token1_token1, {swap:{input_token:"Token1", input_amount:"1000", min_output:"831"}}, "auto");
        console.log(res);
    }).timeout(100000);

    
});