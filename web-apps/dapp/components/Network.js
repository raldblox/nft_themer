import { useState } from "react"

export default () => {

    const paymentTokens = [
        "APE COIN", "USDT", "USDC", "MNT"
    ]

    const networks = [
        "Mantle Testnet", "Scroll Testnet", "Polygon Mumbai", "Polygon zkEVM"
    ]

    const [selectedToken, setSelectedToken] = useState({
        item: null,
        idx: null
    })

    const [selectedNetwork, setSelectedNetwork] = useState({
        item: null,
        idx: null
    })

    const [state, setState] = useState(false)

    const handleSearch = (e) => {
        const menuEls = document.querySelectorAll('.menu-el-js')
        const searchVal = e.target.value.toLocaleLowerCase()

        menuEls.forEach(el => {
            el.classList.remove("hidden")
            if (!el.textContent.toLocaleLowerCase().includes(searchVal)) {
                el.classList.add("hidden")
            }
        })
    }

    return (
        <div className="relative w-[250px] px-4 mx-auto text-[15px]">
            <button className="flex items-center justify-between w-[250px] px-4 py-2 text-gray-500 bg-white border rounded-md shadow-sm outline-none cursor-default focus:border-indigo-600"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => setState(!state)}
            >
                {selectedToken.item || "Select Payment Token"}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </button>
            {
                state ? (
                    <div className="relative w-[250px]">
                        <ul className="absolute w-full mt-3 bg-white border rounded-md shadow-sm" role="listbox">
                            <div className="flex items-center shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full p-2 text-gray-500 rounded-md outline-none"
                                    onInput={handleSearch}
                                />
                            </div>
                            <div className="mt-2 overflow-y-auto max-h-64">
                                {
                                    paymentTokens.map((el, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => {
                                                setSelectedToken({
                                                    item: el,
                                                    idx
                                                })
                                                setState(false)
                                            }}
                                            role="option"
                                            className={`${selectedToken.idx == idx ? 'text-indigo-600 bg-indigo-50' : ''} menu-el-js flex items-center justify-between px-3 cursor-default py-2 duration-150 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50`}
                                        >
                                            {el}
                                            {
                                                selectedToken.idx == idx ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : ''
                                            }
                                        </li>
                                    ))
                                }
                            </div>
                        </ul>
                    </div>
                ) : ''
            }
            <div className="w-[250px] overflow-y-auto max-h-64">
                <h1 className="py-2 pt-8 font-bold text-center">Select Network</h1>
                {
                    networks.map((el, idx) => (
                        <li
                            key={idx}
                            onClick={() => {
                                setSelectedNetwork({
                                    item: el,
                                    idx
                                })
                            }}
                            role="option"
                            className={`${selectedNetwork.idx == idx ? 'text-indigo-600 bg-indigo-50' : 'bg-gray-600'} menu-el-js flex items-center justify-between px-3 cursor-default py-2 duration-150 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50`}
                        >
                            {el}
                            {
                                selectedNetwork.idx == idx ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : ''
                            }
                        </li>
                    ))
                }
            </div>
        </div>
    )
}
