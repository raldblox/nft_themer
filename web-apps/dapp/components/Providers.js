"use client"

import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const Providers = (props) => {
    const [connectedWallet, setConnectedWallet] = useState("");
    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Please install Metamask.");
                return;
            } else {
            }
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected", accounts[0]);
            setConnectedWallet(accounts[0].toLowerCase());
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object");
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Connected account:", account);
            setConnectedWallet(accounts[0].toLowerCase());
        } else {
            console.log("No authorized account found");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const value = {
        connectWallet,
        connectedWallet,
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
