import { SUPPORTED_COUNTRIES } from '../../config';
import { PublicHoliday, PublicHolidayShort } from '../../types';
import { validateInput, shortenPublicHoliday } from '../helpers';

describe('=== HELPERS UNIT ===', () => {
	describe('> validateInput', () => {
		it('should return true for valid inputs', () => {
			const country = SUPPORTED_COUNTRIES[0];
			const year = new Date().getFullYear();

			expect(validateInput({ year, country })).toBeTruthy();
		});

		it('should throw an error for unsupported country', () => {
			const unsupportedCountry = 'KG';

			expect(() => validateInput({ country: unsupportedCountry })).toThrow(
				new Error(`Country provided is not supported, received: ${unsupportedCountry}`),
			);
		});

		it('should throw an error for invalid year', () => {
			const year = 2000;

			expect(() => validateInput({ year })).toThrow(
				new Error(`Year provided not the current, received: ${year}`),
			);
		});
	});

	describe('> shortenPublicHoliday', () => {
		it('should return the shortened holiday', () => {
			const mockHoliday: PublicHoliday = {
				date: '2022-01-01',
				localName: "New Year's Day",
				name: "New Year's Day",
				countryCode: 'FR',
				fixed: true,
				global: true,
				counties: null,
				launchYear: 1870,
				types: ['National holiday'],
			};

			const expectedHoliday: PublicHolidayShort = {
				date: mockHoliday.date,
				localName: mockHoliday.localName,
				name: mockHoliday.name,
			};

			expect(shortenPublicHoliday(mockHoliday)).toEqual(expectedHoliday);
		});
	});
});
