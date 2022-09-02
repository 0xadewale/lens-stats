import {Menu, Image, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import Link from "next/link";

export default function AccountDropdown({ profile }) {
    return (
        <Menu>
            <MenuButton mx={2}>
                <Image
                    src={profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                    alt="user profile picture"
                    objectFit="cover"
                    boxSize="2.5rem"
                    borderRadius='full'
                />
            </MenuButton>
            <MenuList>
                <Link href={'/profile/' + profile.id}>
                    <MenuItem>
                        My Stats
                    </MenuItem>
                </Link>
            </MenuList>
        </Menu>
    )
}