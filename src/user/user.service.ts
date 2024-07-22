import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<any>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<any> {
    const newUser:any = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  // Find a user by email
  async findOneByEmail(email: string): Promise<any> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Find a user by ID
  async findOneById(id: any): Promise<any> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Update a user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  // Remove a user
  async remove(id: string): Promise<any> {
    await this.userRepository.delete(id);
  }
}
