// Create variables that hold env variables for database connection
const { DATABASE_HOST, DATABASE_NAME, REPLACE_DATABASE_NAME } = process.env;

// Export the database configuration object
export const mongoDBConfig = {
  // Define the URI for the database connection using environment variables.
  uri: `mongodb://${DATABASE_HOST}/${DATABASE_NAME}?replicaSet=${REPLACE_DATABASE_NAME}`,
};
