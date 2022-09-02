import { css, keyframes } from '@emotion/css'
import {Box, Center, Skeleton} from "@chakra-ui/react";

export function Placeholders({
  number
}) {
  const rows = []
  for (let i = 0; i < number; i ++) {
    rows.push(
        <Center py={4}>
          <Skeleton
              h='7rem'
              w={{ base: '100%', md: '540px' }}
              rounded={'md'}
              borderWidth={1}
              borderRadius='lg'
          />
        </Center>
    )
  }
  return rows
}