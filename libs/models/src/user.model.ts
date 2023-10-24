import { IUser } from '@cognum/interfaces';
import * as bcrypt from 'bcrypt';
import { Model, Schema, model } from 'mongoose';
import { triggers } from './default.model';

const schema = new Schema<IUser>({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
  photo: { type: String, required: false },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
triggers(schema);

schema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

schema.pre('findOneAndUpdate', async function (next) {
  const bcryptHashRegex = /^\$2[abxy]\$\d{2}\$[./0-9A-Za-z]{53}$/;
  function isBcryptHash(str: string) {
    return bcryptHashRegex.test(str);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docToUpdate: any = this.getUpdate();
  if (docToUpdate.password && !isBcryptHash(docToUpdate.password)) {
    const hashedPassword = await bcrypt.hash(docToUpdate.password, 10);
    docToUpdate.password = hashedPassword;
  }
  next();
});

// Dependency injection
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const User: Model<IUser> = model<IUser>('User', schema);
export default User as Model<IUser>;
