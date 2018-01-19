const expect = require('expect');

const {isRealString} = require("./validation");

describe('isRealString', () => {
	it('should reject non-string values', () => {
		var string = isRealString(98456321);
		expect(string).toBe(false);
	})


	it('should reject string with only spaces', () => {
		var string = isRealString("         ");
		expect(string).toBe(false);
	})


	it('should allow string with non-spaces characters', () => {
		var string = isRealString(" bilal ");
		expect(string).toBe(true);
	})


})