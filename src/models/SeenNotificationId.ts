import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class SeenNotificationId {
  @prop({ index: true, required: true })
  notificationId!: string
}

export const SeenNotificationIdModel = getModelForClass(SeenNotificationId)
