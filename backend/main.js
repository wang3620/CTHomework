const express = require('express');
const mariadb = require('mariadb');
const axios = require('axios');

const app = express();

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'daniel',
  password: '7777', // todo -- save this credential in a safer place
  database: 'CTWallet',
  connectionLimit: 5
});

// Middleware to add CORS headers, todo -- improve CORS in the future
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.get('/v1/list_all_addresses', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM address');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) conn.end();
  }
});

app.post('/v1/address', async (req, res) => {
  const { address_id, description } = req.body;

  if (!address_id || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const blockchainInfoResponse = await axios.get(`https://blockchain.info/rawaddr/${address_id}`);
    const final_balance = blockchainInfoResponse.data.final_balance;
    const query = 'INSERT INTO address (address_id, description, final_balance) VALUES (?, ?, ?)';
    await conn.query(query, [address_id, description, final_balance]);
    const txs = blockchainInfoResponse.data.txs;
    for (let i = 0; i< txs.length; i += 1) {
      const query = 'INSERT INTO transaction (transaction_id, address_id, metadata) VALUES (?, ?, ?)';
      await conn.query(query, [txs[i].hash, address_id, txs[i]]);
    }
    res.status(200).json({ message: 'Address added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) conn.end();
  }
});

app.delete('/v1/address/:address_id', async (req, res) => {
  const address_id = req.params.address_id;

  if (!address_id) {
    return res.status(400).json({ error: 'Address ID is required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const query = 'DELETE FROM address WHERE address_id = ?';
    const result = await conn.query(query, [address_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const queryTransaction = 'DELETE FROM transaction WHERE address_id = ?';
    await conn.query(queryTransaction, [address_id]);

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) conn.end();
  }
});

app.get('/v1/address/:address_id', async (req, res) => {
  const address_id = req.params.address_id;

  if (!address_id) {
    return res.status(400).json({ error: 'Address ID is required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const query = 'SELECT * FROM transaction WHERE address_id = ?';
    const rows = await conn.query(query, [address_id]);
    const queryAddress = 'SELECT * FROM address WHERE address_id = ?';
    const queryAddressRes = await conn.query(queryAddress, [address_id]);
    const response = {
      final_balance: queryAddressRes[0].final_balance,
      txs: rows
    }
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (conn) conn.end();
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});