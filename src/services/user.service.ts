import { Injectable, HttpStatus, NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/repository/user";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users>) { }

    async signUpUser(userInfo: { user_email: string, user_name: string, password: string }) {
        const { user_email, user_name, password } = userInfo;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password using bcrypt


            const user = this.userRepository.create({
                name: user_name,
                email: user_email,
                password: hashedPassword
            });

            const result = await this.userRepository.save(user);

            return {
                status: HttpStatus.CREATED,
                message: "User Created Successfully",
                data: result,
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException("Email already exists.");
            } else {
                throw new InternalServerErrorException("An error occurred while creating the user.");
            }
        }
    }
}
