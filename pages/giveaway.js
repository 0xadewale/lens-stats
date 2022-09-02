import {Badge, FormControl, FormHelperText, FormLabel, Input, Text} from "@chakra-ui/react";
import Select from "../components/Giveaway/ModuleSelector";
import ModuleSelector from "../components/Giveaway/ModuleSelector";
import {useState} from "react";
import BestCollector from "../components/Giveaway/Form/BestCollector";

export default function Giveaway() {
    const [selected, setSelected] = useState();

    function handleSelected(item) {
        setSelected(item)
    }
    return (
        <div className="container mx-auto">
            <div className="flex">
                <Text fontSize="2xl" fontWeight='bold'>Community Giveaway</Text>
            </div>
            <div className="flex my-4">
                <FormControl>
                    <FormLabel>Module</FormLabel>
                    <ModuleSelector selected={selected} onSelect={handleSelected} />
                </FormControl>
            </div>
            {(() => {
                switch (selected?.id) {
                    case 1:
                        return <BestCollector />
                    default:
                        return <div className="text-gray-500">Comming Soon</div>
                }
            })()}
        </div>
    )
}