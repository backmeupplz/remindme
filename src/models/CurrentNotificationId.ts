import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class CurrentNotificationId {
  @prop({ index: true, required: true })
  notificationId!: string
}

export const CurrentNotificationIdModel = getModelForClass(
  CurrentNotificationId
)
