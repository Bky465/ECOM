var mongoose = require('mongoose');
const { connect, connection } = mongoose;


var dbURI = "mongodb://localhost:27017/flip_clone";

const database = async() => {
	// .........CONNECTION EVENTS........
	connection.on('connecting', () => console.log('Connecting to database'));
	connection.on('connected', () => console.log('Connected'));
	connection.on('disconnected', () => console.log('Disconnected from database'));

	try {
		await connect(dbURI)
		console.log("SuccessFully connected to",connection.name, "database")
	} catch (error) {
		console.log(error)
	}
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	connection.close(() => {
		console.log('Database connection disconnected through app termination');
		process.exit(0);

	});
});

module.exports = database;