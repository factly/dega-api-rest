// Drop the database
var dbName = db.getName();
db.dropDatabase();

// Create the database
db = db.getSiblingDB(dbName);

// Create the tiles collection
db.createCollection('role');
db.tiles.createIndex({ slug: 1 }, { unique: true });