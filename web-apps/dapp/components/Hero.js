"use client"
import { useContext } from "react";
import { Context } from "./Providers";

export default () => {
    const { connectWallet, connectedWallet } = useContext(Context);
    return (
        <section className="relative">
            <div className="absolute top-[80vh] md:top-[50vh] z-0 inset-0 m-auto h-[100vh] md:h-[150vh] blur-[200px] max-w-screen-xl" style={{ background: "linear-gradient(85deg, rgba(192, 132, 252, 0.25) 0%, rgba(14, 165, 233, 0.25) 15%, rgba(232, 121, 249, 0.25) 50%, rgba(79, 70, 229, 0.3) 100%)" }}></div>
            <div className="relative max-w-screen-xl gap-12 px-4 mx-auto space-y-16 text-gray-200 py-28 md:px-8">
                <div className="max-w-3xl mx-auto space-y-5 text-center">
                    <h1 className="text-base font-medium text-[#00b8ff]">
                        Built to Make Your NFTs Pop! 🎉
                    </h1>
                    <h2 className="mx-auto text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] to-[#939393] md:text-6xl">
                        Breathe Life into your NFTs with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00c1] via-[#4900ff] to-[#00fff9]">NFT Themers</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xs">
                        NFT Themer is an innovative project at the intersection of art, technology, and blockchain. We are dedicated to transforming static and ordinary NFTs (Non-Fungible Tokens) into dynamic, interactive, and captivating digital assets. Our mission is to add life and personalization to the world of NFTs, offering creators and collectors a unique platform to apply themes, interactivity, and custom elements to their digital treasures.
                    </p>
                    <div className="flex items-center justify-center gap-x-3 sm:space-y-0">
                        <button onClick={connectWallet} className="block px-4 py-2 font-medium text-white duration-150 bg-[#4900ff] rounded-lg shadow-lg hover:bg-[#ff00c1] active:bg-indigo-700 hover:shadow-none">
                            {connectedWallet ? <>{connectedWallet.slice(0, 7)}...{connectedWallet.slice(-5)}</> : "Connect Wallet"}
                        </button>
                        <button className="px-4 py-2 font-medium text-gray-700 duration-150 border rounded-lg hover:text-gray-500 active:bg-gray-100">
                            Tokenize
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="h-full space-y-8 col-span-2 pt-8 p-4 md:p-8 rounded-[25px] md:rounded-[50px] border-2 border-gray-600 bg-[#ffffff39]">
                        <h1 className="text-2xl font-bold text-center">Select Theme</h1>
                        <ul className="grid z-10 rounded-[30px] aspect-square md:aspect-auto overflow-y-scroll content-start md:grid-cols-3 gap-4">
                            <li className="col-span-1 rounded-[30px] border aspect-square border-1 border-gray-700 bg-white"></li>
                            <li className="col-span-1 rounded-[30px] border aspect-square border-1 border-gray-700 bg-white"></li>
                            <li className="col-span-1 rounded-[30px] border aspect-square border-1 border-gray-700 bg-white"></li>
                        </ul>
                    </div>
                    <div className="h-full space-y-8 col-span-2 pt-8 p-4 md:p-8 rounded-[25px] md:ounded-[50px] border-2 border-gray-600 bg-[#ffffff31]">
                        <h1 className="text-2xl font-bold text-center">Select Your NFT</h1>
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