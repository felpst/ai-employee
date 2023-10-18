import * as bcrypt from "bcrypt";
import { Document, Model, Schema, Types, model } from "mongoose";
import { IUser } from "../entities/User";

interface IUserDocument extends IUser, Document {
  id: Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUser>;
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  update(id: string, data: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<IUser>;
}

const UserModel = model<IUserDocument>("User", userSchema);

export default class UserRepository implements IUserRepository {
  private model: Model<IUserDocument>;

  constructor(model: Model<IUserDocument> = UserModel) {
    this.model = model;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return await this.model.create(data);
  }

  async findAll(): Promise<IUser[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IUser> {
    return await this.model.findById(id);
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.model.findOne({ email });
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    Object.assign(user, data);
    return await user.save();
  }

  async delete(id: string): Promise<IUser> {
    const user = await this.model.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await this.model.findByIdAndDelete(id);
  }
}
