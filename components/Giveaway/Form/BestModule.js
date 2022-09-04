import {Component} from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input
} from "@chakra-ui/react";
import Select from "../../ui/Select";
import {ethers, providers} from "ethers";

import ABI from '../../../abi/erc20.json'
import { getBalance, send } from '../../../api'

export default class BestModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCurrency: null,
            amount: 0,
            balance: 0,
            valid: true
        }
    }

    handleCurrencySelected = async (currency) => {
        this.setState({ selectedCurrency: currency })
        const balance = await getBalance(currency, this.props.address)
        this.setState( { balance: balance })
        this.validate(this.state.amount, balance)
    }

    handleAmountChange = (e) => {
        this.setState( { amount: e.target.value })
        this.validate(e.target.value, this.state.balance)
    }

    validate = (value, balance) => {
        if (this.state.selectedCurrency !== null) {
            if (value > balance) {
                this.setState({ valid: false })
            } else {
                this.setState({ valid: true })
            }
        }
    }

    handleSend = async () => {
        await send(this.props.winner.ownedBy, this.state.amount, this.state.selectedCurrency)
    }

    render() {
        if (!this.props.winner) {
            return (
                <div>No { this.props.label }</div>
            )
        }
        return (
            <div>
                <div className="flex flex-col md:flex-row my-4 gap-4">
                    <FormControl className="z-20">
                        <FormLabel className="font-semibold">Currency</FormLabel>
                        <div className="block -z-10">
                            { this.state.selected?.name }
                            <Select
                                list={this.props.currencies}
                                selected={this.state.selectedCurrency}
                                onSelect={this.handleCurrencySelected}
                            />
                        </div>
                    </FormControl>
                    <FormControl position='initial'>
                        <FormLabel>
                            <div className="flex items-center justify-between">
                                <div>Amount</div>
                                <div className="font-thin text-gray-500">Balance : {this.state.balance}</div>
                            </div>
                        </FormLabel>
                        <Input position='initial' isInvalid={!this.state.valid} type='number' onChange={this.handleAmountChange} />
                    </FormControl>
                </div>
                <div className="flex mt-4 z-10">
                    <Button disabled={!this.state.valid} colorScheme='teal' w={{ base: 'full', sm: 'auto' }} onClick={this.handleSend}>Giveaway</Button>
                </div>
            </div>
        )
    }
}
