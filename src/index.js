import net from "net";

export default class httz {
	#tcpServer;
	#request;
	#response;
	#socket;
	#contentLength;
	#data;

	constructor() {
		this.#setResponse();
		this.#request = {
			method: "",
			url: "",
			data: "",
			headers: {},
		};
	}

	#setResponse() {
		const writeResponse = (arg) => {
			this.#contentLength += arg.length;
			const content = `${this.#data}\r\n\r\n${arg}`;
			this.#data += content;
			return `HTTP/1.1 ${
				this.#response.statusCode
			} OK\r\nContent-Type: application/json\r\nContent-Length: ${
				this.#contentLength
			}${content}`;
		};

		this.#response = {
			statusCode: 200,

			end: (arg) => {
				if (arg) {
					const sike = writeResponse(arg);
					this.#socket.write(sike, "utf-8", () => {
						this.#socket.end();
					});
				} else {
					this.#socket.write(writeResponse(""), "utf-8", () => {
						this.#socket.end();
					});
				}
			},
		};
	}

	createServer(cb) {
		this.#tcpServer = net.createServer((socket) => {
			let body = "";
			socket.on("data", (data) => {
				this.#data = "";
				this.#contentLength = 0;
				this.#socket = socket;
				body += data.toString("utf-8");
				const lines = body.split("\r\n");
				if (lines.length > 1) {
					const contentTypeHeader = lines.find((line) =>
						line.startsWith("Content-Type:")
					);
					if (
						contentTypeHeader &&
						contentTypeHeader.includes("application/json")
					) {
						const contentIndex = body.indexOf("\r\n\r\n") + 4;
						this.#request.data = JSON.parse(body.slice(contentIndex));
					}
				}

				// Attach headers to req
				for (let i = 0; i < lines.length; i++) {
					const [key, value] = lines[i].split(":");
					if (!key || !value) continue;
					this.#request.headers[key] = value;
				}

				this.#request.method = body.split(" ")[0];
				this.#request.url = body.split(" ")[1];

				cb(this.#request, this.#response);
			});
		});
	}

	listen(...args) {
		if (args[0] && typeof args[0] !== "number")
			throw new Error("PORT must be a number");
		let port = 3000;
		let host;
		let cb;
		if (args.length === 1) {
			port = args[0];
		} else if (args.length === 2) {
			port = args[0];
			cb = args[1];
		} else {
			port = args[0];
			host = args[1];
			cb = args[2];
		}
		this.#tcpServer.listen(port, host, cb);
	}
}
