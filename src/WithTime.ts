import { CustomEventEmitter } from './CustomEventEmitter';
import https from 'https';

export class WithTime extends CustomEventEmitter {
	execute(asyncFunc, ...args): void {
		this.emit('start');
		console.time('execute');
		asyncFunc(...args, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			console.timeEnd('execute');
			this.emit('end');
			this.emit('data', data);
		});
	}
}

export const fetchFromUrl = (url: string, cb: (error: Error | null, data?: any) => void): void => {
	https
		.get(url, (res) => {
			let data = '';

			// A chunk of data has been received.
			res.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received.
			res.on('end', () => {
				try {
					const jsonData = JSON.parse(data);
					cb(null, jsonData);
				} catch (error) {
					cb(error as Error);
				}
			});
		})
		.on('error', (error) => {
			cb(error);
		});
};

const withTime = new WithTime();

withTime.on('start', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));
withTime.on('data', (data) => console.log(data));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners('end'));

console.groupEnd();
