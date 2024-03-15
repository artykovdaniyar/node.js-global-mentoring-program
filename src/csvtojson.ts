import { pipeline } from 'stream/promises';
import * as fs from 'fs';
import csvtojson from 'csvtojson';
import path from 'path';

export const convertCsvToJson = async (
	csvFilePath: string,
	txtOutputPath: string,
): Promise<void> => {
	const readStream = fs.createReadStream(csvFilePath);
	const writeStream = fs.createWriteStream(txtOutputPath);
	const csvConverter = csvtojson({
		headers: ['book', 'author', 'amount', 'price'],
		ignoreColumns: /amount/i,
		colParser: {
			price: 'number',
		},
	});

	try {
		await pipeline(readStream, csvConverter, writeStream);

		console.log('Pipeline succeeded');
	} catch (err) {
		console.error('Pipeline failed', err);
	}
};

// Example usage with dynamic file paths
const csvFilePath = path.join(__dirname, 'csv', 'example.csv');
const txtOutputPath = path.join(__dirname, 'example.txt');

convertCsvToJson(csvFilePath, txtOutputPath);
