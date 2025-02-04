import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const getUserTestAttempts = async (userId: number) => {
  const query = `SELECT * FROM test_attempts WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};
