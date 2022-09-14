import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    useColorModeValue, Flex, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Show,
} from '@chakra-ui/react';
import Image from 'next/image'

export function UserRevenuCard({ revenue, label }) {
    return (
        <Center py={6} mx={4}>
            <Box
                w={'20rem'}
                h={'26rem'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'lg'}
                rounded={'md'}
                borderWidth={1}
                borderRadius='lg'
                p={6}
                textAlign={'center'}>
                <Flex flexDirection='column' align='center' justify='center' h='full'>
                    <Box w='full'>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th colSpan={2}>{ label }</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        revenue.map((revenu, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <Image
                                                        src={`/assets/${revenu.asset.symbol.toLowerCase()}.svg`}
                                                        alt="asset token image"
                                                        width={25}
                                                        height={25}
                                                    />
                                                </Td>
                                                <Td textAlign="right"> { revenu.total } { revenu.asset.symbol }</Td>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Flex>
            </Box>
        </Center>
    );
}
