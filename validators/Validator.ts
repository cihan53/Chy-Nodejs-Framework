import {Component} from "../base";

export class Validator extends Component {
    public static builtInValidators = {
        'boolean': '',
        'email': '',
    }


    /**
     * @var array|string attributes to be validated by this validator. For multiple attributes,
     * please specify them as an array; for single attribute, you may use either a string or an array.
     */
    public attributes = [];
    public message: string = "";

    public except = [];
    public isEmpty = [];

    public init() {
        super.init();
    }

    public static createValidator(type: any, model: any, attributes: any, params = []) {

    }
}