import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Reminder {
  @prop({ index: true, required: true })
  fireTime!: number
  @prop({ index: true, required: true })
  replyToCastId!: string
  @prop({ index: true })
  username!: string
}

export const ReminderModel = getModelForClass(Reminder)
