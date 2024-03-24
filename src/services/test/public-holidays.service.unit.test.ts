import axios from 'axios';
import {
	getListOfPublicHolidays,
	getNextPublicHolidays,
	checkIfTodayIsPublicHoliday,
} from '../public-holidays.service';
import { SUPPORTED_COUNTRIES, PUBLIC_HOLIDAYS_API_URL } from '../../config';
import { shortenPublicHoliday } from '../../utils/helpers';

const mockData = [
	{
		date: '2024-11-01',
		localName: 'Toussaint',
		name: "All Saints' Day",
		countryCode: 'FR',
		fixed: false,
		global: true,
		counties: null,
		launchYear: null,
		types: ['Public'],
	},
	{
		date: '2024-12-25',
		localName: 'Noël',
		name: 'Christmas Day',
		countryCode: 'FR',
		fixed: false,
		global: true,
		counties: null,
		launchYear: null,
		types: ['Public'],
	},
];

describe('=== PUBLIC HOLIDAYS SERVICE UNIT ===', () => {
	describe('> getListOfPublicHolidays', () => {
		let year: number;
		let country: string;
		let url: string;

		beforeEach(() => {
			year = new Date().getFullYear();
			country = SUPPORTED_COUNTRIES[1];
			url = `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${year}/${country}`;
		});

		it('should return public holidays on success', async () => {
			const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: mockData });
			const publicHolidays = await getListOfPublicHolidays(year, country);

			expect(publicHolidays).toEqual(mockData.map(shortenPublicHoliday));
			expect(axiosGetSpy).toHaveBeenCalledTimes(1);
			expect(axiosGetSpy).toHaveBeenCalledWith(url);
		});

		it('should return an empty array on error', async () => {
			const axiosGetSpy = jest
				.spyOn(axios, 'get')
				.mockRejectedValue(new Error('Failed to fetch data'));
			const publicHolidays = await getListOfPublicHolidays(year, country);

			expect(publicHolidays).toEqual([]);
			expect(axiosGetSpy).toHaveBeenCalledTimes(1);
			expect(axiosGetSpy).toHaveBeenCalledWith(url);
		});
	});

	describe('> checkIfTodayIsPublicHoliday', () => {
		let country: string;
		let url: string;

		beforeEach(() => {
			country = SUPPORTED_COUNTRIES[1];
			url = `${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${country}`;
		});

		it('should return true on success', async () => {
			const status = 200;
			const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({
				status,
			});

			const isHoliday = await checkIfTodayIsPublicHoliday(country);

			expect(axiosGetSpy).toHaveBeenCalledWith(url);
			expect(axiosGetSpy).toHaveBeenCalledTimes(1);
			expect(isHoliday).toEqual(true);
		});

		it('should return false when API returns an error', async () => {
			const status = 500;
			const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({
				status,
			});
			const isHoliday = await checkIfTodayIsPublicHoliday(country);

			expect(axiosGetSpy).toHaveBeenCalledWith(url);
			expect(axiosGetSpy).toHaveBeenCalledTimes(1);
			expect(isHoliday).toEqual(false);
		});
	});

	describe('> getNextPublicHolidays', () => {
		let country: string;
		let url: string;

		beforeEach(() => {
			country = SUPPORTED_COUNTRIES[1];
			url = `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${country}`;
		});

		it('should return the public holidays on success', async () => {
			const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: mockData });
			const publicHolidays = await getNextPublicHolidays(country);

			expect(publicHolidays).toEqual(mockData.map(shortenPublicHoliday));
			expect(axiosGetSpy).toHaveBeenCalledWith(url);
		});

		it('should return an empty array when API returns an error', async () => {
			const axiosGetSpy = jest
				.spyOn(axios, 'get')
				.mockRejectedValue(new Error('Failed to fetch data'));
			const publicHolidays = await getNextPublicHolidays(country);

			expect(publicHolidays).toEqual([]);
			expect(axiosGetSpy).toHaveBeenCalledWith(url);
		});
	});
});
