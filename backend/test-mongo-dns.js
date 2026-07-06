import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = "mongodb+srv://shaiksanafarheen14_db_user:sanasweety786@cluster0.f8elnji.mongodb.net/startup-crm-lite?retryWrites=true&w=majority&appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
