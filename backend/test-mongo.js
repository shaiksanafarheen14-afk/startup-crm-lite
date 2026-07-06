import mongoose from 'mongoose';

const uri = "mongodb://shaiksanafarheen14_db_user:sanasweety786@ac-6x04tit-shard-00-00.f8elnji.mongodb.net:27017,ac-6x04tit-shard-00-01.f8elnji.mongodb.net:27017,ac-6x04tit-shard-00-02.f8elnji.mongodb.net:27017/startup-crm-lite?ssl=true&replicaSet=atlas-79cztf-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri, { family: 4 })
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
