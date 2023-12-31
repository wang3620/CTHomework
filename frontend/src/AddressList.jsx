import React from 'react';
import {Button, message, Popconfirm, Space, Table} from 'antd';
import axios from "axios";
import CreateButton from "./CreateButton";

class AddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    axios({
      method: 'get',
      url: 'http://localhost:8080/v1/list_all_addresses',
    })
      .then((response) => {
        if (response.data) {
          this.setState({
            addresses: response.data,
          });
        }
      })
      .catch(err => message.error(err.toString()));
  }

  render() {
    const columns = [
      {
        title: 'Address ID',
        dataIndex: 'address_id'
      },
      {
        title: 'Description',
        dataIndex: 'description'
      },
      {
        title: 'Action',
        render: (text, record) =>
          <Popconfirm
            title="Delete the address"
            description="Are you sure to delete this address?"
            onConfirm={() => {
                axios({
                  method: 'delete',
                  url: `http://localhost:8080/v1/address/${record.address_id}`,
                })
                  .then( () => {
                    message.success("success")
                    this.fetchData();
                  }).catch((err) => message.error(err.toString()));
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
      }
    ];
    return (
      <div>
        <CreateButton fetchData={this.fetchData} />
        <br />
        <Table columns={columns} dataSource={this.state.addresses} />
      </div>
    );
  }
}

export default AddressList;