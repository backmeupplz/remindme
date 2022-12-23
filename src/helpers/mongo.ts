import * as mongoose from 'mongoose'
import env from './env'

export default function runMongo(mongoUrl = env.MONGO) {
  return mongoose.connect(mongoUrl)
}
