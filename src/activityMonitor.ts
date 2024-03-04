/* eslint-disable no-console */
import * as child_process from 'child_process';
import * as fs from 'fs';

class ActivityMonitor {
	private readonly refreshRate: number;
	private readonly logInterval: number;
	private readonly logFilePath: string;
	private readonly systemCommand: string;

	constructor(refreshRate: number, logInterval: number, logFilePath: string) {
		const windowCommand = `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
		const LinuxAndMacOSCommand = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';

		this.systemCommand = process.platform === 'win32' ? windowCommand : LinuxAndMacOSCommand;
		this.refreshRate = refreshRate;
		this.logInterval = logInterval;
		this.logFilePath = logFilePath;
	}

	private writeToLog(output: string): void {
		const unixTime = Math.floor(Date.now() / 1000);
		try {
			if (!fs.existsSync(this.logFilePath)) {
				fs.writeFileSync(this.logFilePath, '');
			}
			fs.appendFileSync(this.logFilePath, `${unixTime} : ${output}\n`);
		} catch (error) {
			console.error('Error writing to log file:', error);
		}
	}

	private logSystemActivity(): void {
		try {
			const output = child_process.execSync(this.systemCommand).toString().trim();
			this.writeToLog(output);
		} catch (error) {
			console.error('Error logging system activity:', error);
		}
	}

	private displaySystemActivity(): void {
		try {
			const output = child_process.execSync(this.systemCommand).toString().trim();
			process.stdout.write(output + '\r');
		} catch (error) {
			console.error('Error displaying system activity:', error);
		}
	}

	public startMonitoring(): void {
		setInterval(() => {
			this.logSystemActivity();
		}, this.logInterval);

		setInterval(() => {
			this.displaySystemActivity();
		}, this.refreshRate);

		process.on('SIGINT', () => {
			process.exit();
		});
	}
}

const REFRESH_RATE = 100;
const LOG_INTERVAL = 60 * 1000;
const LOG_FILE_PATH = 'activityMonitor.log';

const activityMonitor = new ActivityMonitor(REFRESH_RATE, LOG_INTERVAL, LOG_FILE_PATH);
activityMonitor.startMonitoring();
