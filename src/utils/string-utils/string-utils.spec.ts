import {stringFormat} from './string-utils';

describe('string-utils-formatString', () => {

    it('format all params', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = stringFormat(placeholder, 'funny', 'great');

        expect(result).toEqual('im a funny string, with great params');
    })

    it('return same placeholder', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = stringFormat(placeholder);

        expect(result).toEqual('im a {} string, with {} params');
    })

    it('return same placeholder', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = stringFormat(placeholder, 'angry', JSON.stringify({hello: 'world'}));

        expect(result).toEqual('im a angry string, with {"hello":"world"} params');
    })

})