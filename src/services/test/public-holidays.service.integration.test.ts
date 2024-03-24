import {
	getListOfPublicHolidays,
	getNextPublicHolidays,
	checkIfTodayIsPublicHoliday,
} from '../public-holidays.service';
import { SUPPORTED_COUNTRIES } from '../../config';

describe('=== PUBLIC HOLIDAYS SERVICE INTEGRATION ===', () => {
	const year = new Date().getFullYear();
	const country = SUPPORTED_COUNTRIES[0];

	describe('> getListOfPublicHolidays', () => {
		it('should return a list of public holidays when props is valid', async () => {
			const holidays = await getListOfPublicHolidays(year, country);

			expect(holidays.length).toBeGreaterThan(0);
			holidays.forEach((holiday) => {
				expect(holiday).toHaveProperty('date');
				expect(holiday).toHaveProperty('localName');
				expect(holiday).toHaveProperty('date');
			});
		});

		it('should throw an error when year prop is invalid', async () => {
			const invalidYear = year + 1;

			expect(async () => {
				await getListOfPublicHolidays(invalidYear, country);
			}).rejects.toThrow(`Year provided not the current, received: ${invalidYear}`);
		});

		it('should throw an error when country prop is invalid', () => {
			const invalidCountry = 'EEE';

			expect(async () => {
				await getListOfPublicHolidays(year, invalidCountry);
			}).rejects.toThrow(`Country provided is not supported, received: ${invalidCountry}`);
		});
	});

	describe('> checkIfTodayIsPublicHoliday', () => {
		it('should return true when today is a public holiday', async () => {
			const result = await checkIfTodayIsPublicHoliday(country);

			if (result) {
				expect(result).toBeTruthy();
			}
		});

		it('should throw an error when country prop is invalid', () => {
			const invalidCountry = 'EEE';

			expect(async () => {
				await checkIfTodayIsPublicHoliday(invalidCountry);
			}).rejects.toThrow(`Country provided is not supported, received: ${invalidCountry}`);
		});
	});

	describe('> getNextPublicHolidays', () => {
		it('should return a list of next public holidays with a valid year and country', async () => {
			const holidays = await getNextPublicHolidays(country);

			expect(holidays.length).toBeGreaterThan(0);
			holidays.forEach((holiday) => {
				expect(holiday).toHaveProperty('date');
				expect(holiday).toHaveProperty('localName');
				expect(holiday).toHaveProperty('date');
			});
		});

		it('should throw an error when country prop is invalid', () => {
			const invalidCountry = 'EEE';

			expect(async () => {
				await getNextPublicHolidays(invalidCountry);
			}).rejects.toThrow(`Country provided is not supported, received: ${invalidCountry}`);
		});
	});
});
