import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    Stack,
    Button,
    Link,
    Badge,
    useColorModeValue, Spacer, Flex,
} from '@chakra-ui/react';

export function TopUserCard({ user, label }) {
    return (
        <Center py={6} mx={4}>
            <Box
                w={'20rem'}
                h={'25rem'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'lg'}
                rounded={'md'}
                borderWidth={1}
                borderRadius='lg'
                p={6}
                textAlign={'center'}>
                <Flex flexDirection='column' align='center' justify='space-between' h='full'>
                    <Box>
                        <Avatar
                            size={'xl'}
                            src={user.picture?.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                            alt={'Avatar Alt'}
                            mb={4}
                            pos={'relative'}
                            _after={{
                                content: '""',
                                w: 4,
                                h: 4,
                                bg: 'green.300',
                                border: '2px solid white',
                                rounded: 'full',
                                pos: 'absolute',
                                bottom: 0,
                                right: 3,
                            }}
                        />
                        <Heading fontSize={'2xl'} fontFamily={'body'}>
                            { label }
                        </Heading>
                        <Text fontWeight={600} color={'gray.500'} mb={4}>
                            @{ user.handle }
                        </Text>
                        <Text
                            textAlign={'center'}
                            color={useColorModeValue('gray.700', 'gray.400')}
                            px={3}
                        >
                            { user.bio }
                        </Text>
                    </Box>
                    <Box w='full'>
                        <Stack align={'center'} justify={'space-around'} direction={'row'} mt={6}>
                            <Box align='left'>
                                <Text fontWeight={600}>
                                    { user.stats.totalFollowers }
                                </Text>
                                <Text fontWeight={500} color={'gray.500'} size="sm">
                                    Followers
                                </Text>
                            </Box>
                            <Box align='left'>
                                <Text fontWeight={600}>
                                    { user.stats.totalFollowing }
                                </Text>
                                <Text fontWeight={500} color={'gray.500'} size="sm">
                                    Following
                                </Text>
                            </Box>
                        </Stack>
                        <Stack mt={8} direction={'row'} spacing={4}>
                            <Button
                                flex={1}
                                fontSize={'sm'}
                                rounded={'full'}
                                bg={'blue.400'}
                                color={'white'}
                                disabled
                                boxShadow={
                                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                }
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                _focus={{
                                    bg: 'blue.500',
                                }}>
                                Follow
                            </Button>
                        </Stack>
                    </Box>
                </Flex>
            </Box>
        </Center>
    );
}