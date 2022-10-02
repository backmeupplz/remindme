import { Wallet } from 'ethers'
import env from '@/helpers/env'

export default Wallet.fromMnemonic(env.FARCASTER_MNEMONIC)
