import { MongoClient } from 'mongodb';

const connections: any = {}

export async function getDatabase(location: string, database: string) {
    location = location.toUpperCase();

    if(connections[location] && connections[location][database]){
        console.log(`[MongoDB]: Using existing connection for ${location}.${database}`)
        return connections[location][database]
    }

    const client = await MongoClient.connect(process.env[`MONGO${location}`] || '');
    const db = await client.db(database);

    connections[location] = (connections[location])? 
        {...connections[location], [database]: db} : {[database]: db}

    console.log(`[MongoDB]: Fetched new connection for ${location}.${database}`)
    return db
};