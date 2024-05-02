import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../Blockchain/abi.json';
import Navbar from '../Component/Navbar';

function PickWinner() {
    const [owner, setOwner] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isOwnerConnected, setIsOwnerConnected] = useState(false);
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(false);

    const contractAddress = 'x31a17eeb65AEe70B41670EC5bd5A7970192c7065';

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCurrentAccount(address);

                    window.ethereum.on('accountsChanged', (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install Metamask to use this application');
            }
        };

        const initializeContract = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contractIns = new ethers.Contract(contractAddress, abi, signer);
                setContractInstance(contractIns);

                const _status = await contractIns.isComplete();
                setStatus(_status);

                const _winner = await contractIns.getWinner();
                setWinner(_winner);

                const _owner = await contractIns.getManager();
                setOwner(_owner);

                const address = await signer.getAddress();
                setIsOwnerConnected(_owner === address);
            } catch (err) {
                console.error(err);
            }
        };

        loadBlockchainData();
        initializeContract();
    }, []);

    const pickWinner = async () => {
        try {
            if (contractInstance) {
                const tx = await contractInstance.pickWinner();
                await tx.wait();
            }
        } catch (error) {
            console.error('Error while picking the winner:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className='container'>
                <h1>Result Page</h1>
                <div className='button-container'>
                    {status ? (
                        <p>Lottery Winner is: {winner}</p>
                    ) : (
                        <>

                            {
                                owner === currentAccount &&
                                <button className='enter-button' onClick={pickWinner}>
                                    Pick Winner
                                </button>
                            }
                        </>


                    )}
                </div>
            </div>
        </>

    );
}

export default PickWinner;
