import React, { useState } from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import axios from "axios";
const CreateButton = (props) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      setConfirmLoading(true);
      axios.post('http://localhost:8080/v1/address', values, {headers: {
        'Content-Type': 'application/json'
      }})
        .then(function () {
          message.success('success');
          setOpen(false);
          props.fetchData();
        })
        .catch(function (err) {
          message.error(err.toString());
        }).finally(() => {
          setConfirmLoading(false);
      });
    }).catch(err => console.log(err.toString()));
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal} style={{marginBottom: "20px"}}>
        Add
      </Button>
      <Modal
        title="Add New Address"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Address ID"
            name="address_id"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default CreateButton;