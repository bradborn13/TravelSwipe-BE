import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/infrastructure/user.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async getByEmail(email: string) {
    return await this.model.findOne({ email: email }).select('+password');
  }
  async addUser(user: User) {
    return await this.model.create(user);
  }
}
