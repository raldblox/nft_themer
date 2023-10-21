"use client"

import { useContext, useEffect, useState } from "react";
import { Context } from "./Providers";
import Dropzone from "react-dropzone";
import { NFTStorage } from "nft.storage";
import Card from "./Card";
import Network from "./Network";
import abi from "../libraries/ThemerAbi.json"
import apeAbi from "../libraries/ApeTokenAbi.json"
import { ethers } from "ethers";
import { mumbai } from "@/libraries/contracts";

export default () => {
    const { connectWallet, connectedWallet, apeBalance, setApeBlance } = useContext(Context);
    const [image, setImage] = useState("")
    const [selectedImage, setSelectedImage] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [uploading, setUploading] = useState("")
    const [processing, setProcessing] = useState("")
    const [txHash, setTxHash] = useState("")

    const [steps, setStep] = useState({
        stepsItems: ["Upload", "Theming", "Payment", "Done"],
        currentStep: 0
    })

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedImage(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            console.log("Image Selected")

            // const reader = new FileReader();
            // reader.onload = () => {
            //     setBase64Image(imageUrl);
            // };
            // reader.readAsDataURL(file);

            setStep({
                ...steps,
                currentStep: 1,
            });
        }
    };

    const clearImage = () => {
        setImage(null);

        setStep({
            ...steps,
            currentStep: 0,
        });
    };

    const selectNetwork = () => {
        setStep({
            ...steps,
            currentStep: 3,
        });
    };

    const uploadImage = async () => {
        const nftStorage = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0YTU3MjUwMjJDMWNmNjQ3NEVkQ0U5QzQ1MTJkQTUwQWUwOWYyYTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NzczNjQ3MDQyMSwibmFtZSI6Ik9DVkxBQlMifQ.JOkVvi3ZUQHPBmce9Nk65X_OliFs1UbYvnECHQNB7Wo", });
        try {
            setUploading(true);
            const fileName = selectedImage.name;
            const fileExtension = fileName.split(".").pop();
            const file = new File([selectedImage], `nft.${fileExtension}`)
            const metaData = await nftStorage.store({
                name: "Image",
                description: 'Uploaded at NFT Themer',
                image: file,
            });

            const gateways = [
                'https://gateway.ipfs.io',
                'https://ipfs.runfission.com',
                'https://ipfs.io',
                'https://nftstorage.link',
                'https://permaweb.eu.org',
                'https://cloudflare-ipfs.com',
            ];

            let metadata;
            let gatewayUrl;

            for (const gateway of gateways) {
                const metadataURL = `${gateway}/ipfs/${metaData.ipnft}/metadata.json`;
                const metadataResponse = await fetch(metadataURL);

                if (metadataResponse.ok) {
                    metadata = await metadataResponse.json();
                    const imageURL = metadata.image;
                    const imageCID = imageURL.split('//')[1].split('/')[0];
                    gatewayUrl = `https://cloudflare-ipfs.com/ipfs/${imageCID}/nft.${fileExtension}`;
                    setImageURL(gatewayUrl);
                    console.log(gatewayUrl);
                    break; // Stop trying other gateways once successful
                }
            }

            if (!metadata || !gatewayUrl) {
                // Handle the case where all gateways failed to fetch metadata
                console.error('Failed to fetch metadata from all gateways.');
            }

            setUploading(false);
            if (gatewayUrl) {
                setStep({
                    ...steps,
                    currentStep: 2,
                });
            }
        } catch (error) {
            console.log(error);
            setUploading(false);
        }

    };

    const apeFaucet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenABI = apeAbi;
        const tokenAddress = mumbai.apeToken;
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        try {
            const approvalTx = await tokenContract.gimmeMillionApe();
            await approvalTx.wait();
            console.log("Ape Token now on its way!");
        } catch (error) {
            console.error('Error faucet:', error);
        }
        try {
            const apeBalance = await tokenContract.balanceOf(connectedWallet);
            const formattedBalance = ethers.utils.formatEther(apeBalance);
            console.log("Ape Balance:", formattedBalance);
            setApeBlance(formattedBalance);
        } catch (error) {
            console.error('Error faucet:', error);
        }
    };

    const approveTokens = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenABI = apeAbi;
        const tokenAddress = mumbai.apeToken;
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        const spenderAddress = mumbai.themer;
        const approvalAmount = ethers.utils.parseEther("100");

        try {
            const approvalTx = await tokenContract.approve(spenderAddress, approvalAmount);
            await approvalTx.wait();
            console.log(`Approved ${approvalAmount.toString()} tokens for ${spenderAddress}`);
        } catch (error) {
            console.error('Error approving tokens:', error);
        }
    };

    const handleMint = async (encryptedURL) => {
        setProcessing(true);
        try {
            if (!imageURL) {
                return
            }
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const themerContract = new ethers.Contract(
                mumbai.themer,
                abi,
                provider.getSigner()
            );

            const paymentAddress = mumbai.apeToken; // Mocked APE Token
            const themeAddress = mumbai.theme; // Default Theme
            const factoryAddress = mumbai.factory; // Default Theme

            // Check if approval is needed
            const tokenContract = new ethers.Contract(mumbai.apeToken, apeAbi, provider.getSigner());
            const spenderAddress = mumbai.themer;
            const approvalRequired = await tokenContract.allowance(provider.getSigner().getAddress(), spenderAddress);

            if (approvalRequired.lt(ethers.utils.parseEther("1"))) {
                await approveTokens();
            }

            const tx = await themerContract.createThemedNFT(paymentAddress, 0, imageURL, factoryAddress, themeAddress, false);
            console.log(tx);
            const receipt = await tx.wait();
            if (receipt.status === 1) {
                setTxHash(tx.hash);
                setStep({
                    ...steps,
                    currentStep: 4,
                });
            } else {
                alert("Minting Failed")
            }
            setProcessing(false);

        } catch (error) {
            console.log(error);
        }
        setProcessing(false);
    }

    return (
        <section className="relative">
            <div className="absolute top-[80vh] md:top-[50vh] z-0 inset-0 m-auto h-[100vh] md:h-[150vh] blur-[200px] max-w-screen-xl" style={{ background: "linear-gradient(85deg, rgba(192, 132, 252, 0.25) 0%, rgba(14, 165, 233, 0.25) 15%, rgba(232, 121, 249, 0.25) 50%, rgba(79, 70, 229, 0.3) 100%)" }}></div>
            <div className="relative max-w-screen-lg gap-12 px-4 mx-auto space-y-16 text-gray-200 py-28 md:px-8">
                <div className="max-w-3xl mx-auto space-y-5 text-center">
                    <h1 className="text-base font-medium text-[#00b8ff]">
                        Built to Make Your NFTs Pop! 🎉
                    </h1>
                    <h2 className="mx-auto text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] to-[#939393] md:text-6xl">
                        Breathe Life into your NFTs with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00c1] via-[#4900ff] to-[#00fff9]">NFT Themer</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xs">
                        NFT Themer is an innovative project at the intersection of art, technology, and blockchain. We are dedicated to transforming static and ordinary NFTs (Non-Fungible Tokens) into dynamic, interactive, and captivating digital assets. Our mission is to add life and personalization to the world of NFTs, offering creators and collectors a unique platform to apply themes, interactivity, and custom elements to their digital treasures.
                    </p>
                    <div className="flex items-center justify-center gap-x-3 sm:space-y-0">
                        <button onClick={connectWallet} className="block px-4 py-2 font-medium text-white duration-150 bg-[#4900ff] rounded-lg shadow-lg hover:bg-[#ff00c1] active:bg-indigo-700 hover:shadow-none">
                            {connectedWallet ? <>{connectedWallet.slice(0, 7)}...{connectedWallet.slice(-5)}</> : "Connect Wallet"}
                        </button>
                        <button onClick={apeFaucet} className="px-4 py-2 font-medium text-gray-700 duration-150 border rounded-lg hover:text-gray-500 active:bg-gray-100">
                            Gimme million $APE
                        </button>
                    </div>
                    <p>Balance: {apeBalance} $APE</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="h-full space-y-8 col-span-2 pt-8 p-4 md:p-8 rounded-[25px] md:rounded-[50px] border-2 border-gray-600 bg-[#ffffff25]">
                        <div className="max-w-2xl px-4 mx-auto md:px-0">
                            <ul aria-label="Steps" className="items-center font-medium text-gray-300 md:flex">
                                {steps.stepsItems.map((item, idx) => (
                                    <li aria-current={steps.currentStep == idx + 1 ? "step" : false} className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0">
                                        <div className="flex flex-col items-center md:flex-row md:flex-1">
                                            <hr className={`w-full border hidden md:block ${idx == 0 ? "border-none" : "" || steps.currentStep >= idx + 1 ? "border-blue-300" : ""}`} />
                                            <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${steps.currentStep > idx + 1 ? "bg-blue-300 border-blue-300" : "" || steps.currentStep == idx + 1 ? "border-blue-300" : ""}`}>
                                                <span className={`w-2.5 h-2.5 rounded-full bg-[#ff00c1] ${steps.currentStep != idx + 1 ? "hidden" : ""}`}></span>
                                                {
                                                    steps.currentStep > idx + 1 ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    ) : ""
                                                }
                                            </div>
                                            <hr className={`h-12 border md:w-full md:h-auto ${idx + 1 == steps.stepsItems.length ? "border-none" : "" || steps.currentStep > idx + 1 ? "border-blue-300" : ""}`} />
                                        </div>
                                        <div className="flex items-center justify-center h-8 md:mt-3 md:h-auto">
                                            <h3 className={`text-sm font-bold uppercase ${steps.currentStep == idx + 1 ? "text-white" : ""}`}>
                                                {item}
                                            </h3>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {steps.currentStep == 0 &&
                            <div className="grid-cols-3 bg-gray-200 h-[30vh] rounded-[30px]">
                                <Dropzone onDrop={handleDrop} disabled={!connectedWallet}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section className="flex items-center justify-center h-full p-8 border-2 border-black border-dashed rounded-[30px]">
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <label htmlFor="file" className="m-4 text-center cursor-pointer md:p-8">
                                                    <svg className="w-10 h-10 mx-auto" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <p className="max-w-xs mx-auto mt-3 text-black">
                                                        Click to <span className="font-medium text-blue-800">upload your digital asset</span> or drag and drop your file here
                                                    </p>
                                                </label>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </div>}
                        {steps.currentStep == 1 &&
                            <div className="grid-cols-3 p-8 flex items-center justify-center mx-auto bg-transparent rounded-[30px]">
                                {image && (
                                    <div className="space-y-8 rounded-[30px]">
                                        <img src={image} alt="Uploaded" className="h-full rounded-3xl" />
                                        <div className="flex justify-center gap-4">
                                            <button onClick={clearImage} className="text-lg font-bold text-white">Clear Image</button>
                                            <button disabled={uploading} onClick={uploadImage} className={`${uploading && "animate-pulse"} px-4 py-2 font-medium text-white duration-150 bg-[#4900ff] rounded-lg hover:bg-[#ff00c1] active:bg-indigo-700 hover:shadow-none`}>
                                                {uploading ? "UPLOADING" : "UPLOAD"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>}
                        {steps.currentStep == 2 &&
                            <div className="z-10 flex flex-col items-center justify-center w-full gap-8">
                                <Card image={image} />
                                <div className="w-[300px] overflow-y-auto max-h-64">
                                    <h1 className="py-2 pt-8 font-bold text-center">Select Theme</h1>
                                    <li role="option"
                                        className={`bg-indigo-50  menu-el-js flex items-center justify-between px-3 cursor-pointer py-2 duration-150 text-indigo-600 hover:bg-gray-400`}
                                    >
                                        3D Interactive Card (Selected)
                                    </li>
                                    <li role="option"
                                        className={`bg-indigo-50 opacity-50 menu-el-js flex items-center justify-between px-3 cursor-pointer py-2 duration-150 text-indigo-600 hover:bg-gray-200`}
                                    >
                                        Holographic Card (Coming Soon)
                                    </li>
                                </div>
                                <button disabled={uploading} onClick={selectNetwork} className={`${uploading && "animate-pulse"} px-4 py-2 font-medium text-white duration-150 bg-[#4900ff] rounded-lg hover:bg-[#ff00c1] active:bg-indigo-700 hover:shadow-none`}>
                                    Continue
                                </button>
                            </div>}
                        {steps.currentStep == 3 &&
                            <div className="z-10 flex flex-col items-center justify-center w-full gap-8">
                                <Card image={image} />
                                <Network />
                                <button disabled={!imageURL} onClick={handleMint} className={`${uploading && "animate-pulse"} px-4 py-2 font-medium text-white duration-150 bg-[#4900ff] rounded-lg hover:bg-[#ff00c1] active:bg-indigo-700 hover:shadow-none`}>
                                    {processing ? "Processing" : "Process"}
                                </button>
                            </div>}
                        {steps.currentStep == 4 &&
                            <div className="z-10 flex flex-col items-center justify-center w-full gap-8">
                                <Card image={image} />
                                <h1 className="text-2xl font-bold text-green-500">SUCCESS!</h1>
                                <a href={`https://mumbai.polygonscan.com/tx/${txHash}`} target="_blank">TX RECEIPT</a>
                                <a href="https://testnets.opensea.io/collection/themednft" target="_blank">View themedNFT Collection</a>
                            </div>}
                    </div>
                    <div className="h-full space-y-8 col-span-2 pt-8 p-4 md:p-8 rounded-[25px] md:ounded-[50px] border-2 border-gray-600 bg-[#ffffff31]">
                        <h1 className="text-2xl font-bold text-center">Your Themed NFT</h1>
                        <ul className="grid z-10 aspect-square md:aspect-auto rounded-lg md:rounded-[30px] content-start grid-cols-2 md:grid-cols-6 gap-4 overflow-y-scroll">
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                            <li className="col-span-1 rounded-lg md:rounded-[30px] aspect-square border-1 border-gray-700 bg-[#ffffff] backdrop-blur-md"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}