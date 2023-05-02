import net from "net";

class Httz {
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
			console.log("called: " + arg);
			console.log("count");
			this.#contentLength += arg.length;
			console.log(this.#contentLength);
			const content = `${this.#data}\r\n\r\n${arg}`;
			console.log(arg);
			console.log(content);
			this.#data += content;
			return `HTTP/1.1 ${this.#response.statusCode} OK\r\nContent-Length: ${
				this.#contentLength
			}${content}`;
		};

		this.#response = {
			statusCode: 200,

			// write: (arg) => {
			// 	this.#socket.write(writeResponse(arg));
			// },

			end: (arg) => {
				// if (arg) {
				// 	const sike = writeResponse(arg);
				// 	this.#socket.write(sike);
				// }
				this.#socket.end(writeResponse(arg));
			},
		};
	}

	createServer(cb) {
		this.tcpServer = net.createServer((socket) => {
			this.#socket = socket;
			let body = "";
			this.#contentLength = 0;
			this.#data = "";
			// socket.on("connect", () => {
			// 	console.log("COnnected");
			// });
			socket.on("data", (data) => {
				body = data.toString("utf-8");
				const lines = body.split("\r\n");
				// console.log(lines);
				const [method, url, version] = lines[0].split(" ");

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
		let host = "localhost";
		let cb;
		if (args.length === 1) {
			port = args[0];
		} else if (args.length === 2) {
		} else {
			port = args[0];
			host = args[1];
			cb = args[2];
		}
		this.tcpServer.listen(port, host, cb);
	}
}

const httz = new Httz();
httz.createServer((req, res) => {
	res.statusCode = 400;
	res.end("hello there postman");
});
httz.listen(3000, "localhost", () => {});
