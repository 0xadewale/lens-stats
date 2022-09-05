import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { useRouter } from 'next/router'
import { createClient, STORAGE_KEY, authenticate as authenticateMutation, getChallenge, getDefaultProfile } from '../api'
import { parseJwt, refreshAuthToken } from '../utils'
import { AppContext } from '../context'
import { ChakraProvider } from '@chakra-ui/react'
import { Navbar } from '../components/Navbar'
import { Box } from '@chakra-ui/react'
import theme from '../theme'
import {Footer} from "../components/Footer";

function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(false)
  const [userAddress, setUserAddress] = useState()
  const [userProfile, setUserProfile] = useState()
  const [metamask, setMetamask] = useState(false)
  const router = useRouter()

  useEffect(() => {
    refreshAuthToken()
    async function checkConnection() {
      if (typeof window.ethereum !== 'undefined') {
        setMetamask(true)
        const provider = new ethers.providers.Web3Provider(
            (window).ethereum
        )
        const addresses = await provider.listAccounts();
        if (addresses.length) {
          setConnected(true)
          setUserAddress(addresses[0])
          getUserProfile(addresses[0])
        } else {
          setConnected(false)
        }
      } else {
        setMetamask(false)
      }
    }
    checkConnection()
    listenForRouteChangeEvents()
  }, [])

  async function getUserProfile(address) {
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(getDefaultProfile, {
        address
      }).toPromise()
      console.log('user profile :', response.data)
      setUserProfile(response.data.defaultProfile)
    } catch (err) {
      console.log('error fetching user profile...: ', err)
    }
  }

  async function listenForRouteChangeEvents() {
    router.events.on('routeChangeStart', () => {
      refreshAuthToken()
    })
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send(
        "eth_requestAccounts"
      )
      const account = accounts.result[0]
      setUserAddress(account)
      const urqlClient = await createClient()
      const response = await urqlClient.query(getChallenge, {
        address: account
      }).toPromise()
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const signature = await signer.signMessage(response.data.challenge.text)
      setConnected(true)
      console.log('Signature : ', signature)
      const authData = await urqlClient.mutation(authenticateMutation, {
        address: account, signature
      }).toPromise()
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)
      getUserProfile(account)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken, refreshToken, exp: accessTokenData.exp
      }))
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
      <ChakraProvider theme={theme}>
        <AppContext.Provider value={{
          userAddress,
          profile: userProfile
        }}>
          <Box position='relative' minH='100vh'>
            <Navbar
                connected={connected}
                profile={userProfile}
                metamask={metamask}
                signIn={signIn}
            />
            <Box pt={4} pb='10rem'>
              <Component {...pageProps} signIn={signIn} />
            </Box>
            <Footer />
          </Box>
        </AppContext.Provider>
      </ChakraProvider>
  )
}

export default MyApp
