import SQLite from 'react-native-sqlite-storage'

import { dbName } from 'constants/config'

success = () => {
  console.log("SQL executed fine");
}

error = (error) => {
  console.log("SQL Error: " + error);
}

// connect database
const db = SQLite.openDatabase({ name: dbName, readOnly: false, location: 'default' }, success, error);

// function that queries dayabase
export default query = (queryString) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // SELECT * FROM VIDEO_DATA
      tx.executeSql(queryString, [], (tx, results) => {
        console.log("Query completed", queryString);
          if (results.error) {
            console.log('error query')
            console.log(results.error)
            reject({status: 'failed', desc: 'query error'})
          }
          resolve(results.rows.raw())
      });
    });
  });
}