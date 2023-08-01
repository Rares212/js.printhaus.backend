import {HttpException, HttpStatus} from "@nestjs/common";

export class FileSizeException extends HttpException {
    constructor(msg: string = 'File size is too large') {
        super(msg, HttpStatus.BAD_REQUEST);
    }
}