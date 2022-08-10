import {BaseError} from "../BaseError";

export class Exception extends BaseError {
    public errorInfo = [];
    protected code: string;

    constructor(message: string, errorInfo:any = [], code = '', previous = null) {
        super(message);
        this.errorInfo = errorInfo;
        this.name = 'Database Exception' // good practice
        this.code = code // error code for responding to client
        Error.captureStackTrace(this)
    }
}
