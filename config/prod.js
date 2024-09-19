import dotenv from 'dotenv'
dotenv.config()

export default {
  dbURL: 'mongodb+srv://shahargadon:1234@mondaze.6rxq2.mongodb.net/?retryWrites=true&w=majority&appName=Mondaze',
  dbName: 'board_db'
}

// using dotenv
// export default {
//   dbURL: process.env.MONGO_URL,
//   dbName: process.env.DB_NAME
// }