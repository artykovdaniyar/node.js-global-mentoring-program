type EventEmitterCallBack = (...arg: any[]) => void;

interface EventEmitterListener {
	[key: string]: EventEmitterCallBack[];
}

export class CustomEventEmitter {
	listeners: EventEmitterListener;

	constructor() {
		this.listeners = {};
	}

	on(eventName: string, fn: EventEmitterCallBack): void {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(fn);
	}

	addListener(eventName: string, fn: EventEmitterCallBack): void {
		this.on(eventName, fn);
	}

	off(eventName: string, fn: EventEmitterCallBack): void {
		if (!this.listeners[eventName]) return;

		this.listeners[eventName] = this.listeners[eventName].filter((listener) => listener !== fn);
	}

	removeListener(eventName: string, fn: EventEmitterCallBack): void {
		this.off(eventName, fn);
	}

	once(eventName: string, fn: EventEmitterCallBack): void {
		const onceWrapper = (...args: any[]): void => {
			fn(...args);
			this.off(eventName, onceWrapper);
		};
		this.on(eventName, onceWrapper);
	}

	emit(eventName: string, ...args: any[]): void {
		const eventListeners = this.listeners[eventName];
		if (eventListeners) {
			eventListeners.forEach((listener) => {
				listener(...args);
			});
		}
	}

	listenerCount(eventName: string): number {
		return this.listeners[eventName] ? this.listeners[eventName].length : 0;
	}

	rawListeners(eventName: string): EventEmitterCallBack[] | undefined {
		return this.listeners[eventName];
	}
}
