import { Prop, Schema } from '@nestjs/mongoose';
import * as randomatic from 'randomatic';

@Schema()
export class BaseSchemaLess {
  @Prop({ type: String, default: () => randomatic('Aa0', 20) })
  id?: string;

  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop({ default: () => new Date() })
  updatedAt?: Date;

  @Prop({ required: false, default: null })
  deletedAt?: Date;
}
