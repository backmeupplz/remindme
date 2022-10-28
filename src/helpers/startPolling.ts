import { startPolling } from '@big-whale-labs/botcaster'
import handleNotification from '@/helpers/handleNotification'
import wallet from '@/helpers/wallet'

export default function () {
  startPolling(wallet.address, handleNotification)
}
