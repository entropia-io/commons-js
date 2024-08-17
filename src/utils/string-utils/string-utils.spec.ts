import {formatString, formatStringSimple} from './string-utils';

describe('string-utils-formatStringSimple', () => {

    it('format all params', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder, 'funny', 'great');

        expect(result).toEqual('im a funny string, with great params');
    })

    it('return same placeholder', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder);

        expect(result).toEqual('im a {} string, with {} params');
    })

    it('complex object as param', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder, 'angry', JSON.stringify({hello: 'world'}));

        expect(result).toEqual('im a angry string, with {"hello":"world"} params');
    })

});

describe('string-utils-formatString', () => {

    it('format all params', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatString(placeholder, {par1: 'funny', par2: 'great'});

        expect(result).toEqual('im a funny string, with great params');
    })

    it('return same placeholder', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatStringSimple(placeholder);

        expect(result).toEqual('im a {par1} string, with {par2} params');
    })

    it('some params missing', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatString(placeholder, {par1: 'funny', par3: 'great'});

        expect(result).toEqual('im a funny string, with {par2} params');
    })

});