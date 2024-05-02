import { ethers } from "ethers";
import abi from "../abi.json"


let provider;
if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // Continue with your logic using the provider

} else {
    // Handle the case where the provider is not available
    console.log("Web3 provider (window.ethereum) not found!");
    provider = new ethers.providers.JsonRpcProvider();
}
const signer = provider.getSigner();
const contractAddress = "0x31a17eeb65AEe70B41670EC5bd5A7970192c7065"
const contract = new ethers.Contract(contractAddress, abi, signer);

export const getManager = async () => {
    try {
        const tx = await contract.getManager();
        return tx
    } catch (error) {
        console.log(error)
        return  error
    }
}













