import React, {useEffect, useState} from 'react';
import axios from "axios";
import {message, Table} from "antd";

const AddressDetail = ({addressID}) => {
  const [loading, setLoading] = useState(true);
  const [finalBalance, setFinalBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8080/v1/address/${addressID}`).then((res) => {
      setTransactions(res.data.txs);
      setFinalBalance(res.data.final_balance);
    }).catch(err => message.error(err.toString())).finally(() => setLoading(false));
  }, [addressID]);
  const columns = [{
    title: 'Transaction ID',
    dataIndex: 'transaction_id'
  }];
  return(
    <div>
      <h3>Bitcoin Address: {addressID}</h3>
      <h3>Current Balance: {finalBalance}</h3>
      <Table loading={loading} dataSource={transactions} columns={columns} />
    </div>
  );
};

export default AddressDetail;