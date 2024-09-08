import dotenv from 'dotenv'
dotenv.config()

// export default {
//   dbURL: process.env.MONGO_URL || 'mongodb+srv://theUser:thePass@cluster0-klgzh.mongodb.net/test?retryWrites=true&w=majority',
//   dbName : process.env.DB_NAME || 'tester_db'
// }

// using dotenv
export default {
  dbURL: process.env.MONGO_URL,
  dbName: process.env.DB_NAME
}
