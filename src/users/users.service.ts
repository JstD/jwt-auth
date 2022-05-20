import { User, UserDocument } from '../schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltOrRounds = parseInt(process.env.SALTORROUNDS);
// const hash = await bcrypt.hash(password, saltOrRounds);

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hash: string = await bcrypt.hash(dto.password, saltOrRounds);
    dto = {
      ...dto,
      password : hash
    }
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({username})
  }
}