import { Pool } from "pg";

const pool = new Pool({
  user: "your_user",
  host: "your_host",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

export const getUserTestAttempts = async (userId: number) => {
  const query = `SELECT * FROM test_attempts WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};
