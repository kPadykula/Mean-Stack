module.exports = {
  DB: "mongodb+srv://" + process.env.MONGO_ATLAS_USER +
    ":" + process.env.MONGO_ATLAS_PW + "@learncluster.uabne.mongodb.net/"+
    process.env.MONGO_ATLAS_DB_NAME + "?retryWrites=true&w=majority"
}
