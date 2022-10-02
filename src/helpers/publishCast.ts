import {
  Farcaster,
  FarcasterGuardianContentHost,
} from '@standard-crypto/farcaster-js'
import { Wallet } from 'ethers'
import env from '@/helpers/env'
import wallet from '@/helpers/wallet'

/**
 * Credit: https://gist.github.com/gskril/59d16fefbc411e61c9cce41963f3accf
 * MODIFIED FROM STANDARD-CRYPTO LIBRARY
 * Signs and publishes a simple text string.
 * The cast will be attributed to the username currently registered
 * to the given private key's address.
 */
const _defaultFarcaster = new Farcaster()
export default async function publishCast(text: string, replyTo: string) {
  const contentHost = new FarcasterGuardianContentHost(wallet.privateKey)
  const signer = new Wallet(wallet.privateKey)
  const unsignedCast = await _defaultFarcaster.prepareCast({
    fromUsername: env.USERNAME,
    text,
    replyTo,
  })
  const signedCast = await Farcaster.signCast(unsignedCast, signer)
  await contentHost.publishCast(signedCast)
  return signedCast
}
