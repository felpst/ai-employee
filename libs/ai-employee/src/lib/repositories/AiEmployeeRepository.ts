import { Document, Model, Schema, Types, model } from "mongoose";
import { IAiEmployee, IAiEmployeeModel } from "../entities/AiEmployee";

interface IAiEmployeeDocument extends IAiEmployeeModel, Document {
  id: Types.ObjectId;
}

const aiEmployeeSchema = new Schema<IAiEmployeeDocument>(
  {
    name: { type: String, required: true },
    profession: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export interface IAiEmployeeRepository {
  create(data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel>;
  findById(id: string): Promise<IAiEmployeeModel>;
  findAll(): Promise<IAiEmployeeModel[]>;
  update(id: string, data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel>;
  delete(id: string): Promise<void>;
}

const AiEmployeeModel = model<IAiEmployeeDocument>("AiEmployee", aiEmployeeSchema);

export default class AiEmployeeRepository implements IAiEmployeeRepository {
  private model: Model<IAiEmployeeDocument>;

  constructor(model: Model<IAiEmployeeDocument> = AiEmployeeModel) {
    this.model = model;
  }

  async create(data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel> {
    return await this.model.create(data);
  }

  async findAll(): Promise<IAiEmployee[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<IAiEmployee> {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<IAiEmployeeModel>): Promise<IAiEmployeeModel> {
    const aiEmployee = await this.model.findById(id);
    if (!aiEmployee) {
      throw new Error("User not found");
    }
    Object.assign(aiEmployee, data);
    return await aiEmployee.save();
  }

  async delete(id: string): Promise<void> {
    const aiEmployee = await this.model.findById(id);
    if (!aiEmployee) {
      throw new Error("User not found");
    }
    return await this.model.findByIdAndDelete(id);
  }
}
