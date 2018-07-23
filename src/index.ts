import http from 'http';
import https from 'https';

export default class HeartPing {
	private DEFAULT_TIMEOUT: number = 5000;
	private DEFAULT_INTERVAL: number = 3000;

	private interval: number = this.DEFAULT_INTERVAL;
	private timeout: number = this.DEFAULT_TIMEOUT;
	private lastHeartbeatTime: number;
	private timer: NodeJS.Timer | undefined;
	private timeoutTimer: NodeJS.Timer | undefined;
	private timeoutFn = () => {
		// User defined
	};

	public HeartPing() {
		// Empty constructor
	}

	/**
	 * @public
	 * @function getBeatInterval
	 * @description Returns the current heartbeat interval
	 */
	public getBeatInterval = () => this.interval;

	/**
	 * @public
	 * @function setBeatInterval
	 * @param number newInterval The new interval period
	 * @description Sets the current heartbeat interval to the given one
	 */
	public setBeatInterval = (newInterval: number) => {
		this.interval = newInterval;
	};

	/**
	 * @public
	 * @function getBeatTimeout
	 * @description Returns the current heartbeat timeout period
	 */
	public getBeatTimeout = () => this.timeout;

	/**
	 * @public
	 * @function setBeatTimeout
	 * @param number newTimeout The new timeout period
	 * @description Sets the current timeout to the given one.
	 * Setting the timeout this way will immediately affect the <code>hasTimedOut</code> method without the need to restart the heartbeat object.
	 * Invoking this method <b>does</b> restart the timer controlling the <code>onTimeout</code> event.
	 */
	public setBeatTimeout = (newTimeout: number) => {
		this.timeout = newTimeout;
		if (this.timeoutTimer !== undefined) {
			clearTimeout(this.timeoutTimer);
		}
		this.timeoutTimer = setTimeout(this.timeoutFn, this.timeout);
	};

	/**
	 * @public
	 * @function hasTimedOut
	 * @description Used to detected if a heartbeat has timed out
	 */
	public hasTimedOut = () => Date.now() - this.lastHeartbeatTime > this.timeout;

	/**
	 * @public
	 * @function setOnTimeout
	 * @param function fn The function to be executed when a timeout occurs.
	 * @description Runs the given function when the heartbeat detects a timeout.
	 */
	public setOnTimeout = (fn: () => void) => {
		this.timeoutFn = fn;
	};

	/**
	 * @public
	 * @function isBeating
	 * @returns boolean <code>true</code> if the heartbeat is active, <code>false</code> otherwise
	 * @description Returns <code>true</code> if the heartbeat is active, <code>false</code> otherwise.
	 * A heartbeat is considered active if it was started and has not been stopped yet.
	 */
	public isBeating = () => this.timer !== undefined;

	/**
	 * @public
	 * @function stop
	 * @description Stops the heartbeat object and clears all internal states
	 */
	public stop = () => {
		this.lastHeartbeatTime = -1;
		if (this.timer !== undefined) {
			clearInterval(this.timer);
		}
		this.timer = undefined;
		if (this.timeoutTimer !== undefined) {
			clearTimeout(this.timeoutTimer);
		}
		this.timeoutTimer = undefined;
	};

	/**
	 * @public
	 * @function start
	 * @param url The destination url, e.g. www.google.com
	 * @param port Optional: The port of the destination url
	 * @param function successFn The function to be executed on a successful ping
	 * @param function failedFn The function to be executed on a failed ping
	 * @description Starts the heartbeat object, executing the a ping function at the defined interval
	 */
	public start = (
		url: string,
		port: number,
		successFn: (time: number) => void,
		failedFn: () => void
	) => {
		this.lastHeartbeatTime = Date.now();
		this.timer = setInterval(() => {
			this.timeoutTimer = setTimeout(this.timeoutFn, this.timeout);
			this.ping(url, port)
				.then(successFn)
				.catch(failedFn);
		}, this.interval);
	};

	/**
	 * @public
	 * @function reset
	 * @description Stops the heartbeat if it is beating, and resets all properties to the original default values.
	 */
	public reset = () => {
		stop();
		this.interval = this.DEFAULT_INTERVAL;
		this.timeout = this.DEFAULT_TIMEOUT;
		this.timeoutFn = () => {
			// Reset timeout function
		};
	};

	/**
	 * @public
	 * @function ping
	 * @param url The destination url, e.g. www.google.com
	 * @param port Optional: The port of the destination url
	 * @returns A promise that returns the round trip time in milliseconds. Returns -1 if an error occurred.
	 */
	public ping(url: string, port?: number) {
		const promise = new Promise<number>((resolve, reject) => {
			const useHttps = url.indexOf('https') === 0;
			const mod = useHttps ? https.request : http.request;
			const outPort = port || (useHttps ? 443 : 80);
			const baseUrl = url.replace('http://', '').replace('https://', '');

			const options = { host: baseUrl, port: outPort, path: '/' };
			const startTime = Date.now();

			const pingRequest = mod(options, () => {
				this.lastHeartbeatTime = Date.now();
				if (this.timeoutTimer !== undefined) {
					clearTimeout(this.timeoutTimer);
				}
				resolve(Date.now() - startTime);
				pingRequest.abort();
			});

			pingRequest.on('error', () => {
				if (this.timeoutTimer !== undefined) {
					clearTimeout(this.timeoutTimer);
				}
				reject(-1);
				pingRequest.abort();
			});

			pingRequest.write('');
			pingRequest.end();
		});
		return promise;
	}
}
