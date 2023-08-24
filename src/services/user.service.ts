import { Injectable, HttpStatus, NotFoundException, ConflictException, InternalServerErrorException , UnauthorizedException } from "@nestjs/common";
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

    async validateUser(email: string, password: string): Promise<any> {
        try {
          const user = await this.userRepository.findOne({ where: { email } });
    
          if (user && (await bcrypt.compare(password, user.password))) {
            const { password: userPassword, ...result } = user; // Remove password from the user object
            return {
              status: HttpStatus.OK,
              message: 'Login Successful',
              data: result,
            };
          } else {
            throw new UnauthorizedException('Invalid credentials');
          }
        } catch (error) {
          throw new InternalServerErrorException('server error');
        }
    }
}
