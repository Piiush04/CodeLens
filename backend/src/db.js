import dotenv from "dotenv"
import pg from "pg"

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});


pool.on("error",(err)=>{
    console.error("Unexpected error on idle client", err);
});

export default pool;