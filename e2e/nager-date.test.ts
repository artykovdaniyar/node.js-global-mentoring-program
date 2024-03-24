import request from 'supertest';
import { SUPPORTED_COUNTRIES } from '../src/config';
import { PublicHoliday, LongWeekend } from '../src/types';

const API_URL = 'https://date.nager.at/api/v3'; // Swagger https://date.nager.at/swagger/index.html

describe('=== DATE NAGER API ===', () => {
	describe('/NextPublicHolidays', () => {
		test('should return 200 and the upcoming public holidays for the next 365 days for the given country', async () => {
			const countryCode = SUPPORTED_COUNTRIES[0];
			const { status, body } = await request(API_URL).get<PublicHoliday[]>(
				`/NextPublicHolidays/${countryCode}`,
			);
			const expectedKeys = [
				'date',
				'localName',
				'name',
				'countryCode',
				'fixed',
				'global',
				'counties',
				'launchYear',
				'types',
			];

			expect(status).toEqual(200);
			expect(Array.isArray(body)).toBe(true);
			expect(body.length).toBeGreaterThan(0);

			body.forEach((holiday: PublicHoliday) => {
				expectedKeys.every((key) => expect(holiday).toHaveProperty(key));
			});
		});
	});
	describe('/NextPublicHolidaysWorldwide', () => {
		test('should return 200 status and long weekends for the given country', async () => {
			const year = new Date().getFullYear();
			const countryCode = SUPPORTED_COUNTRIES[0];

			const expectedKeys = ['startDate', 'endDate', 'dayCount', 'needBridgeDay'];

			const { status, body } = await request(API_URL).get<LongWeekend[]>(
				`/LongWeekend/${year}/${countryCode}`,
			);

			expect(status).toEqual(200);
			expect(Array.isArray(body)).toBe(true);
			expect(body.length).toBeGreaterThan(0);

			body.forEach((holiday: PublicHoliday) => {
				expectedKeys.every((key) => expect(holiday).toHaveProperty(key));
			});
		});
	});
});
