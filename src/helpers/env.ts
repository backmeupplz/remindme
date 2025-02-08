import * as dotenv from 'dotenv'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  OP_PROVIDER_URL: str(),
  MONGO: str(),
  FID: num(),
  SIGNER_PRIVATE_KEY: str<`0x${string}`>({ default: '0x0' }),
  MNEMONIC: str(),
})
