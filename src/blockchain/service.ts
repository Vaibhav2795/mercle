import { ethers } from 'ethers';
import { tokenData } from '../contract/tokenData';
import { createEtherInstance, requirePanic } from '../utils/helper';
import { createContract } from '../utils/dbHelper';
import Contract from '../models/contract';

const byteCode = tokenData.byteCode;
const ABI = tokenData.ABI;

export async function deployContract(payload: {
  privateKey: string;
  network: string;
  name: string;
  symbol: string;
}) {
  const { privateKey, network, name, symbol } = payload;
  requirePanic({ privateKey, network, name, symbol }, [
    'privateKey',
    'network',
    'name',
    'symbol',
  ]);
  const provider = createEtherInstance(network);
  const wallet = new ethers.Wallet(privateKey, provider);
  const ContractInstance = new ethers.ContractFactory(ABI, byteCode, wallet);
  try {
    const contractInstance = await ContractInstance.deploy(name, symbol);
    await contractInstance.deployed();

    const payload = {
      name,
      contractAddress: contractInstance.address,
      walletAddress: wallet.address,
      symbol,
      tx: contractInstance.deployTransaction.hash,
    };
    await createContract(payload);
    return payload;
  } catch (error) {
    throw new Error('Error occured on blockchain');
  }
}

export async function getFaucet(payload: {
  privateKey: string;
  contractAddress: string;
}) {
  const { privateKey, contractAddress } = payload;
  requirePanic({ privateKey, contractAddress }, [
    'privateKey',
    'contractAddress',
  ]);
  const provider = createEtherInstance();
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, ABI, wallet);
  try {
    const tx = await contract.faucet();
    await tx.wait();
    return tx.hash;
  } catch (error) {
    throw new Error('Error occured on blockchain');
  }
}

export async function getAllContract() {
  const contracts = Contract.find();
  return contracts;
}
