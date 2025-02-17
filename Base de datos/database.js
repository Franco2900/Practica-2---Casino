const { MongoClient } = require('mongodb'); // Modulo para usar MongoDB

const url = 'mongodb://localhost:27017'; 
let db;

const conectarDB = async () => {
    
    if (db) return db;
    else 
    {
        try 
        {
            const client = await MongoClient.connect(url, {}); // Me conecto al servidor de MongoDB mediante la URL
            db = client.db('casino'); // Uso la base de datos 'casino'
            console.log('Conectado a MongoDB');
            
            return db;
        } 
        catch (error) 
        {
            console.error(error);
        }
    }
};

module.exports = { conectarDB };
