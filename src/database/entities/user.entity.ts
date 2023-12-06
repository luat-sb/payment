import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../base.entity';

@Schema({
  collection: 'user',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User extends BaseSchemaLess {
  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, required: false, default: null })
  token?: string;

  @Prop({ required: false, default: null })
  tokenExpiredDate?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
