import {isNullOrEmpty} from '../string-utils';

const DECIMAL_NUMBER = new RegExp('^(-?\\d+\\.\\d+)$|^(-?\\d+)$');
const WHOLE_NUMBER = new RegExp('^[\\d]+$')

export function isNumeric(text: string, withDecimals?: boolean): boolean {
    if (isNullOrEmpty(text)) {
        return false;
    }
    const reg = withDecimals ? DECIMAL_NUMBER : WHOLE_NUMBER;

    return reg.test(text.toString().trim());

}
