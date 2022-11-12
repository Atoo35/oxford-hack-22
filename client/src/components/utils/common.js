import { ethers, Contract } from "ethers";
import { WATER_CONTRACT_ADDRESS } from "./constants";
import waterABI from './waterABI.json'

export const getWaterContract = () => {
  const contract = new Contract(WATER_CONTRACT_ADDRESS, waterABI, getSigner())
  return contract;
}

export const getSigner = () => {
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  return provider.getSigner();
}