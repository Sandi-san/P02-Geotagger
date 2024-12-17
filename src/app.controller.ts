import { Controller, Get, HttpCode, HttpStatus, Logger } from "@nestjs/common";

@Controller()
export class AppController {
    constructor() { }

    //for testing purposes, check if app connects
    @HttpCode(HttpStatus.OK)
    @Get('hello-world')
    async getHello(): Promise<string> {
        //console.log("USING NODE: ", process.env.NODE_ENV)
        Logger.log(`[Testing Logger] USING NODE: ${process.env.NODE_ENV}`)
        return 'It works!'
    }
}