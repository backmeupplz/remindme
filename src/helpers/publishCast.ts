import { MerkleAPIClient } from '@standard-crypto/farcaster-js'
import wallet from '@/helpers/wallet'

const client = new MerkleAPIClient(wallet)

export default async function (text: string, replyToId: string) {
  const cast = await client.fetchCast(replyToId)
  const publishedCast = await client.publishCast(text, cast)
  return publishedCast.hash
}
