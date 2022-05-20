import { Controller, Get, Post, Body, HttpCode, UseGuards, Request, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiCookieAuth()
@ApiTags('auth')
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }
    // @HttpCode(200)
    // @Get()
    // findAll(): string {
    //     return 'it works';
    // }

    @HttpCode(201)
    @Post('register')
    async create(@Body() dto: CreateUserDto) {
        await this.usersService.create(dto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body() dto: CreateUserDto,
        @Response() res,
        ) {
        const access_token =  await this.authService.login(dto);
        res.cookie('auth', access_token, {
            expires: new Date(new Date().getTime() + 15 * 60 * 1000),
            sameSite: 'strict',
            httpOnly: true,
          });
          return res.send({username: dto.username});
    }

    // @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(
        @Request() req,
    ){
        return req.user;
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @Request() req,
        @Response() res,
    ){
        res.cookie('auth', {},{});
        return res.send(req.user);
    }
}