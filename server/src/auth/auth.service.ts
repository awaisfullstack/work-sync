import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser, JwtPayload } from 'src/types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const role = dto.role ?? UserRole.EMPLOYEE;

    if (role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Admin cannot be created from register API',
      );
    }

    const user = await this.usersService.create({
      ...dto,
      role,
    });

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  logout() {
    return null;
  }

  private async generateAccessToken(user: AuthenticatedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  private sanitizeUser(user: User) {
    const plainUser = user.get({ plain: true }) as Record<string, unknown>;

    delete plainUser.password;

    return plainUser;
  }
}
