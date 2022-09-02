import {Badge, FormControl, FormHelperText, FormLabel, Input, Text} from "@chakra-ui/react";
import Select from "../components/ui/GiveawayRadioGroup";
import GiveawayRadioGroup from "../components/ui/GiveawayRadioGroup";
import {useState} from "react";

export default function Giveaway() {
    const [selected, setSelected] = useState();

    function handleSelected(item) {
        setSelected(item)
    }
    return (
        <div className="container mx-auto">
            <div className="flex text-red-500 dark:text-green-600">
                <Text fontSize="2xl" fontWeight='bold'>Community Giveaway</Text>
            </div>
            <div className="flex my-4">
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input type='email' />
                </FormControl>
            </div>
            <div className="flex my-4">
                <FormControl>
                    <FormLabel>Module</FormLabel>
                    <GiveawayRadioGroup selected={selected} onSelect={handleSelected} />
                </FormControl>
            </div>
        </div>
    )
}