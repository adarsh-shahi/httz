The Httz class is a custom HTTP server build upon TCP server using Node.js' net module. Here's a brief documentation on how to use this class:

### _The Httz class is designed to handle HTTP requests and responses with JSON data. It parses incoming requests and extracts any JSON data from the request body. It also provides a response object that you can use to send a JSON response back to the client._

#

### **Creating an HTTP server**

To create an HTTP server using the Httz class, you need to instantiate the class and call its createServer() method, passing a callback function that will handle incoming requests. For example:

```javascript
const httz = new Httz();

httz.createServer((req, res) => {
	// Handle the request and send a response
	res.statusCode = 200;
	res.end("Hello, world!");
});
```

In this example, we create a new Httz instance and call its createServer() method with a callback function that sets the response status code to 200 and sends a plain text response body.

#

### **Listening for incoming connections**

To listen for incoming connections on a specific port, you can call the listen() method of the Httz instance, passing the desired port number as an argument. For example:

```javascript
httz.listen(3000, () => {
	console.log("Server listening on port 3000");
});
```

In this example, we call the listen() method with port number 3000 and a callback function that will be called when the server starts listening for incoming connections.

#

### **Handling incoming requests**

When a client sends a request to the server, the callback function passed to createServer() is called with two arguments: the request object and the response object. You can use these objects to handle the request and send a response back to the client.

The request object (**req**) contains the following properties:

- method: The HTTP method of the request (e.g. "GET", "POST").
- url: The URL of the request.
- headers: An object containing the request headers.
- data: The request body, parsed as JSON if the "Content-Type"
- header is set to "application/json".

The response object (res) contains the following properties and methods:

- statusCode: The HTTP status code of the response (e.g. 200, 404, etc.).
- end(): A method that sends the response body and closes the connection. You can pass a string as an argument to set the response body.

Here's an example that shows how to use the req and res objects to handle incoming requests:

```javascript
httz.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/") {
		res.statusCode = 200;
		res.end("Hello, world!");
	} else {
		res.statusCode = 404;
		res.end("Not found");
	}
});
```

In this example, we check if the request method is "GET" and the URL is "/", and send a "Hello, world!" response if that's the case. If the request doesn't match this pattern, we send a "Not found" response with status code 404.

Note that you can use any logic you want to handle incoming requests and send responses back to the client. The req and res objects give you full control over the HTTP request and response.
