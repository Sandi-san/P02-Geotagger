import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
    constructor() { }

    //for testing purposes, check if app connects
    @HttpCode(HttpStatus.OK)
    @Get('hello-world')
    async getHello(): Promise<string> {
        console.log("USING NODE: ", process.env.NODE_ENV)
        console.log("USING DB: ", process.env.DATABASE_URL)
        console.log("Using DB file: ", process.env.PRISMA_SCHEMA)
        return 'It works!'
    }
}