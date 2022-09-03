import {Component} from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import Select from "../../ui/Select";
import {ethers, providers} from "ethers";

const currencies = [
    {
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18,
        address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
    },
    {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    {
        name: "(PoS) Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    {
        name: "USD Coin (PoS)",
        symbol: "USDC",
        decimals: 6,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    },
    {
        name: "Toucan Protocol: Nature Carbon Tonne",
        symbol: "NCT",
        decimals: 18,
        address: "0xD838290e877E0188a4A44700463419ED96c16107"
    }
]
import ABI from 'abi/erc20.json'

export default class BestCollector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCurrency: null,
            amount: 0
        }
    }

    handleCurrencySelected = (currency) => {
        console.log('form catch', currency)
        this.setState({ selectedCurrency: currency })
    }

    handleAmountChange = (amount) => {
        this.setState( { amount })
    }

    send = async () => {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const tokenContract = new ethers.Contract(this.state.selectedCurrency.address, ABI, provider)
        const name = await tokenContract.name()
        console.log('Contract name : ' + name)

        if (this.state.selectedCurrency && this.amount > 0) {
            const tx = {
                from: this.props.address,
                to: this.winner.ownedBy,
                value: this.state.amount
            }
        }
    }

    render() {
        return (
            <div>
                <div className="flex flex-col md:flex-row my-4 gap-4">
                    <FormControl className="z-20">
                        <FormLabel className="font-semibold">Currency</FormLabel>
                        <div className="block -z-10">
                            { this.state.selected?.name }
                            <Select
                                list={currencies}
                                selected={this.state.selectedCurrency}
                                onSelect={this.handleCurrencySelected}
                            />
                        </div>
                    </FormControl>
                    <FormControl position='initial'>
                        <FormLabel>Amount</FormLabel>
                        <Input position='initial' type='number' onChange={this.handleAmountChange} />
                    </FormControl>
                </div>
                <div className="flex mt-4 z-10">
                    <Button disabled colorScheme='teal' w={{ base: 'full', sm: 'auto' }}>Giveaway</Button>
                </div>
            </div>
        )
    }
}