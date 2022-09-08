import React, { useEffect, useState, Component } from "react";
import { useSearchParams } from 'react-router-dom'
import PropTypes from "prop-types";
import * as big from 'bn.js';
import * as bs58 from 'bs58';
import { WalletData, CalimeroToken } from "calimero-auth-sdk";

import calimeroSdk from "../../calimeroSdk";
import { PublicKey } from "near-api-js/lib/utils";

const networkId = 'hackathon-calimero-testnet' // TODO make configurable

const nearAPI = require('near-api-js');
const sha256 = require('js-sha256');

let polls = []

const PollList = () => {
  if (polls.length == 0) {
    return (
      <div>No Polls</div>
    )
  }
  return (
    <div>
      <ol>
        {polls.map((poll) => (
          <li key={poll}>{poll}</li>
        ))}
      </ol>
    </div>
  );
}

class PrivateComponent extends Component {
  async getProvider() {
    return await (nearAPI.connect({
      nodeUrl: `https://api.development.calimero.network/api/v1/shards/${networkId}/neard-rpc`,
      networkId: networkId,
      deps: {
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      },
      headers: {
        'x-api-key': localStorage.getItem('calimeroToken')
      },
    })).connection.provider;
  }

  async componentDidMount() {
    console.log("MOUNT")
    if (this.txHash) {
      console.log("IMAM")
    }
  }

  async sendTransaction() {
    console.log(this)
    const calimeroProvider = (await nearAPI.connect({
      nodeUrl: `https://api.development.calimero.network/api/v1/shards/${networkId}/neard-rpc`,
      networkId: networkId,
      deps: {
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      },
      headers: {
        'x-api-key': localStorage.getItem('calimeroToken')
      },
    })).connection.provider;

    const token = JSON.parse(localStorage.getItem('caliToken'))
    console.log(localStorage.getItem('calimeroToken'))
    console.log(token)
    let sender = token.tokenData.accountId;
    let receiver = 'voting.hackathon.calimero.testnet'; // TODO make configurable
    // gets sender's public key
    const publicKeyAsStr = bs58.encode(token.walletData.publicKey.data.data)

    console.log(publicKeyAsStr)
    console.log("TEST")

    // gets sender's public key information from NEAR blockchain 
    const accessKey = await calimeroProvider.query(
      [`access_key/${sender}/${publicKeyAsStr}`, '']
    );

    // constructs actions that will be passed to the createTransaction method below
    const actions = [nearAPI.transactions.functionCall(
      'get_poll',
      {},
      new big.BN('300000000000000'),
      new big.BN('0')
    )];

    // converts a recent block hash into an array of bytes 
    // this hash was retrieved earlier when creating the accessKey (Line 26)
    // this is required to prove the tx was recently constructed (within 24hrs)
    const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);

    console.log("RCH: " + recentBlockHash)
    // each transaction requires a unique number or nonce
    // this is created by taking the current nonce and incrementing it
    const nonce = ++accessKey.nonce + 1;

    console.log("NONCE " + nonce)

    // create transaction
    const transaction = nearAPI.transactions.createTransaction(
      sender,
      PublicKey.fromString(publicKeyAsStr),
      receiver,
      nonce,
      actions,
      recentBlockHash
    );
    console.log("PROSAO")
    console.log(transaction)


    let serializedTx
    try {
      serializedTx = nearAPI.utils.serialize.serialize(
        nearAPI.transactions.SCHEMA,
        transaction
      );
      console.log(serializedTx)
    } catch (e) {
      console.log("ERROR")
    }
    try {
      // This always redirects, but sometimes fails
      calimeroSdk.signTransaction(Buffer.from(serializedTx).toString('base64'))
    } catch (e) {
      console.log("EXCEPTION")
      console.log(e)
    }
  }


  render() {

    return (<div>
      <button onClick={calimeroSdk.syncAccount}>Sync Account</button>
      <button onClick={this.sendTransaction}>Send Transaction</button>
      <button onClick={calimeroSdk.signOut}>Logout</button>
      <PollList />
    </div>)
  }

};
const PrivateComponentWithRouter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  let txHash;
  useEffect(() => {
    if (searchParams.has('transactionHashes')) {
      txHash = searchParams.get('transactionHashes')
      searchParams.delete('transactionHashes')

      // Extract reponse from txHash

      setSearchParams(searchParams)
    }

    console.log('txHash: ' + txHash)
  }, [])


  return (<PrivateComponent />)
}

const PublicComponent = () => <div>
  <button onClick={calimeroSdk.signIn}>Login with NEAR</button>
  <PollList />
</div>;

export default function Dashboard() {
  return calimeroSdk.isSignedIn() ? <PrivateComponentWithRouter /> : <PublicComponent />;
};
