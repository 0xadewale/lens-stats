import { createClient as createUrqlClient } from 'urql'
import { getProfiles, getProfile, getPublications, whoCollectedPublication } from './queries'
import { refreshAuthToken, generateRandomColor } from '../utils'
import { ethers, providers } from 'ethers'
import ABI from '../abi/erc20.json'

export const APIURL = "https://api.lens.dev"
export const STORAGE_KEY = "LH_STORAGE_KEY"
export const LENS_HUB_CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
export const PERIPHERY_CONTRACT_ADDRESS = "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"

export const basicClient = new createUrqlClient({
  url: APIURL
})

export async function fetchProfile(handle) {
  try {
    const urqlClient = await createClient()
    const returnedProfile = await urqlClient.query(getProfile, {
      request: { handle }
    }).toPromise();
    console.log(returnedProfile)
    const profileData = returnedProfile.data.profile
    profileData.color = generateRandomColor()
    const pubs = await urqlClient.query(getPublications, {
      request: {
        profileId: profileData.id,
        publicationTypes: ['POST']
      }
    }).toPromise()
    return {
      profile: profileData,
      publications: pubs.data.publications.items
    }
  } catch (err) {
    console.log('error fetching profile...', err)
  }
}

export async function getStats(pubs) {
  try {
    const client = await createClient()
    let collectors = {}
    let comments = {}
    let bestCollector = {}
    let bestCommentator = {}
    for (const publication of pubs) {
      const collectorResponse = await client.query(whoCollectedPublication, {
        request: { publicationId: publication.id }
      }).toPromise()
      const items = collectorResponse.data.whoCollectedPublication.items
      for (let i = 0; i < items.length; i++){
        collectors[items[i].defaultProfile?.id] ?
            collectors[items[i].defaultProfile?.id].collects.push(publication) :
            collectors[items[i].defaultProfile?.id] = { collects: [publication], defaultProfile: items[i].defaultProfile }
      }
      const commentsResponse = await getComments(publication.id)
      for (let i = 0; i < commentsResponse.length; i++){
        comments[commentsResponse[i].profile?.id] ?
            comments[commentsResponse[i].profile?.id].comments.push(publication) :
            comments[commentsResponse[i].profile?.id] = { comments: [publication], profile: commentsResponse[i].profile }
      }
    }
    delete collectors['undefined']
    let array = Object.keys(collectors).map((key) => {
      return collectors[key]
    })
    if (array.length > 0) {
      let best = array.reduce((prev, current) => (prev.collects.length > current.collects.length) ? prev : current)
      bestCollector = best.defaultProfile
    } else {
      bestCollector = null
    }
    delete comments['undefined']
    array = Object.keys(comments).map((key) => {
      return comments[key]
    })
    if (array.length > 0) {
      let best = array.reduce((prev, current) => (prev.comments.length > current.comments.length) ? prev : current)
      bestCommentator = best.profile
    } else {
      bestCommentator = null
    }
    console.log(bestCommentator)
    return {
      bestCollector,
      bestCommentator: bestCommentator
    }
  } catch (err) {
    console.log('error fetching stats...', err)
  }
}

async function getComments(id) {
  try {
    const client = await createClient()
    const comments = await client.query(getPublications, {
      request: { commentsOf: id }
    }).toPromise()
    return comments.data.publications.items
  } catch (err) {
    console.log('Error fetching comments...', err)
  }
}

export async function createClient() {
  const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (storageData) {
    try {
      const { accessToken } = await refreshAuthToken()
      const urqlClient = new createUrqlClient({
        url: APIURL,
        fetchOptions: {
          headers: {
            'x-access-token': `Bearer ${accessToken}`
          },
        },
      })
      return urqlClient
    } catch (err) {
      return basicClient
    }
  } else {
    return basicClient
  }
}

export async function getBalance(currency, address) {
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const tokenContract = new ethers.Contract(currency.address, ABI, provider)
  const contractWithSigner = await tokenContract.connect(signer)
  const res = await contractWithSigner.balanceOf(address)
  const ethRes = ethers.utils.formatEther(res)
  const balance = Number.parseFloat(ethRes).toFixed(6)
  return balance.toString().replace('.000000', '')
}

export async function send(to, amount, currency) {
  const provider = new providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const tokenContract = new ethers.Contract(currency.address, ABI, provider)

  const parsedAmount = ethers.utils.parseUnits(amount, currency.decimals)
  const contractWithSigner = await tokenContract.connect(signer)

  try {
    let tx = await contractWithSigner.transfer(to, parsedAmount)
    await tx.wait()
  } catch (e) {
    console.log(e)
  }
}

export {
  recommendProfiles,
  getProfile,
  getProfiles,
  getDefaultProfile,
  getPublications,
  searchProfiles,
  searchPublications,
  explorePublications,
  exploreProfiles,
  doesFollow,
  getChallenge,
  timeline,
  globalProtocolStats,
  whoCollectedPublication,
  profilePublicationRevenue,
  profileFollowRevenue
} from './queries'

export {
  followUser,
  authenticate,
  refresh,
  createUnfollowTypedData,
  broadcast,
  createProfileMetadataTypedData
} from './mutations'
