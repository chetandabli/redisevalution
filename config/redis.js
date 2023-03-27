const {createClient} = require('redis');

const client = createClient({
    password: 'pVzbyh7bT8L3Z6NLGcINuF5UFoqOFm9J',
    socket: {
        host: 'redis-14448.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14448
    }
});

client.on('error', err => console.log('Redis Client Error', err));

try {
    client.connect();
} catch (error) {
    console.log(error)
}

module.exports = {
    client
}