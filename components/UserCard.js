import {
    Badge,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import {css} from "@emotion/css";

export function UserCard({ user }) {
    return (
        <Link href={`/profile/${user.profileId}`} style={{ textDecoration: 'none' }}>
            <Center py={4}>
                <Stack
                    borderWidth="1px"
                    borderRadius="xl"
                    w={{ base: '100%', md: '540px' }}
                    height='7rem'
                    direction='row'
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'md'}
                    padding={4}>
                    <Flex flex={{ base: 2, sm: 1}}>
                        {
                            user.picture && user.picture.original ? (
                                <Image
                                    objectFit="cover"
                                    boxSize="5rem"
                                    borderRadius='full'
                                    src={user.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                />
                            ) : (
                                <Box
                                    boxSize="5rem"
                                    borderRadius='full'
                                    bg='gray.400'
                                />
                            )
                        }
                    </Flex>
                    <Stack
                        flex={{ base: 4, sm: 5}}
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="start"
                        p={1}
                    >
                        <Heading fontSize={'2xl'} fontFamily={'body'}>
                            { user.name }
                        </Heading>
                        <Text fontWeight={600} color={'gray.500'} size="sm">
                            @{ user.handle }
                        </Text>
                    </Stack>
                </Stack>
            </Center>
        </Link>
    );
}