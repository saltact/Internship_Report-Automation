const redis = require('redis');

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.log('®️ 🔴 Error while connecting to Redis: ', err));

const connectRedis = async () => {
    try{
        await client.connect();
        console.log('®️ 🟢 Successfully connecting to Message queue on Redis!');
    } catch(err){
        console.error("®️ 🟥 Can't connect to Redis", err);
    }
};

module.exports = {client, connectRedis};