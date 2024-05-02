import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import { ethers } from 'ethers';
import abi from '../Blockchain/abi.json';

const Home = () => {

    const [currentAccount, setCurrentAccount] = useState('');
    // const [OwnerAddr, setOwnerAddr] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [status, setStatus] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    const contractAddress = '0x17D9504E692718AB8601625DCc5372098A8dAA47';

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                try {
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    console.log(address);
                    setCurrentAccount(address);
                    window.ethereum.on('accountsChanged', (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });

                    const contractIns = new ethers.Contract(contractAddress, abi, signer);
                    setContractInstance(contractIns);

                    const status = await contractIns.isComplete();
                    setStatus(status);

                    const winner = await contractIns.getWinner();
                    if (winner === address) {
                        setIsWinner(true);
                    } else {
                        setIsWinner(false);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install Metamask to use this application');
            }
        };

        loadBlockchainData();
    }, []);

    const enterLottery = async () => {
        if (contractInstance) {
            const amountToSend = ethers.utils.parseEther('0.001');
            try {
                const tx = await contractInstance.enter({ value: amountToSend });
                await tx.wait();
            } catch (error) {
                console.error('Error while entering the lottery:', error);
            }
        }
    };

    const claimPrize = async () => {
        if (contractInstance) {
            try {
                const tx = await contractInstance.claimPrize();
                await tx.wait();
            } catch (error) {
                console.error('Error while claiming the prize:', error);
            }
        }
    };

    const resetLottery = async () => {
        try {
            if (contractInstance) {
                const tx = await contractInstance.resetLottery();
                await tx.wait();
            }
        } catch (error) {
            console.error('Error while reset the winner:', error);
        }
    };

    // useEffect(()=>{
    //     const OwnerAddress = async () => {
    //         try {
    //             if (contractInstance) {
    //                 const tx = await contractInstance.manager();
    //                 console.log(tx)
    //                 setOwnerAddr(tx)
    //             }
    //         } catch (error) {
    //             console.error('Error while picking the owner address:', error);
    //         }
    //     };
    //     OwnerAddress()
    // },[])


    return (
        <>


            <Navbar currentAccount={currentAccount} resetLottery={resetLottery} />

            <div className="button-container">
                {status ? (
                    isWinner ? (
                        <button className="enter-button" onClick={claimPrize}>
                            Claim Prize
                        </button>
                    ) : (
                        <p>You are not the winner</p>
                    )
                ) : (
                    <button className="enter-button" onClick={enterLottery}>
                        Enter Lottery
                    </button>
                )}
            </div>
        </>
    );
};

export default Home;
