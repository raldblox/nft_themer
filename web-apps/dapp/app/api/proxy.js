import fetch from 'node-fetch';

export default async (req, res) => {
    try {
        const { query } = req;

        // Extract the "ipnft" parameter from the query
        const { ipnft } = query;

        if (!ipnft) {
            return res.status(400).json({ error: 'Missing "ipnft" parameter.' });
        }

        // Construct the NFT.Storage metadata URL
        const nftStorageURL = `https://api.nft.storage/ipfs/${ipnft}/metadata.json`;

        // Fetch the metadata from NFT.Storage
        const response = await fetch(nftStorageURL);

        if (response.ok) {
            const metadata = await response.json();
            return res.status(200).json(metadata);
        } else {
            return res.status(response.status).json({ error: 'Failed to fetch metadata.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
