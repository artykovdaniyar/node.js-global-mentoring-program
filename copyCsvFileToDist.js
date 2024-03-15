const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { pipeline } = require('stream');

const csvFilePath = './src/csv/example.csv';
const csvOutputPath = './dist/csv/example.csv';

function copyFile(csvFilePath, csvOutputPath) {
	return new Promise((resolve, reject) => {
		const csvOutputDir = path.dirname(csvOutputPath);
		fs.mkdir(csvOutputDir, { recursive: true }, (err) => {
			if (err) return reject(err);

			const readFileStream = fs.createReadStream(csvFilePath);
			const writeFileStream = fs.createWriteStream(csvOutputPath);

			pipeline(readFileStream, writeFileStream, (err) => {
				if (err) return reject(err);
				resolve();
			});
		});
	});
}
copyFile(csvFilePath, csvOutputPath);
