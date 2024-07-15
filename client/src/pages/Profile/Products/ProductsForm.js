import { Modal, Tabs, Form, Input, Row, Col, message } from "antd";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import Images from "./Images";

const additionalThings = [
  {
    label: "Bill Available",
    name: "billAvailable",
  },
  {
    label: "Warranty Available",
    name: "warrantyAvailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label: "Box Available",
    name: "boxAvailable",
  },
];

const rules = [
  {
    required: true,
    message: "Required",
  },
];

function ProductsForm({
  showProductForm,
  setshowProductForm,
  selectedProduct,
  getData,
}) {
  const [SelectedTab, setSelectedTab] = React.useState("1");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));

      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values);
      }
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
        setshowProductForm(false);
      } else {
        message.error(response.message);
        dispatch(SetLoader(false));
        setshowProductForm(false);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const formRef = React.useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setshowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => {
        formRef.current.submit();
      }}
      {...(SelectedTab === "2" && { footer: false })}
    >
      <div>
        <div className="text-2xl text-primary text-center font-semibold uppercase">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={SelectedTab}
          onChange={(key) => setSelectedTab(key)}
        >
          <Tabs.TabPane tab="General" key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
            {/* <div className="p-2">Message : you can add images after saving details </div> */}

              <Form.Item label="Product Name" name="name" rules={rules}>
                <Input Type="text" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={rules}>
                <Input Type="text" />
              </Form.Item>

              <Row gutter={[16, 16]}>

                <Col span={8}>
                  <Form.Item label="Price" name="price" rules={rules}>
                    <Input Type="number" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select name="" id="">
                      <option value="">select</option>
                      <option value="all">all</option>
                      <option value="firstyear">First year</option>
                      <option value="secondyear">Second Year</option>
                      <option value="thirdyear">Third year</option>
                      <option value="finalyear">Final year</option>
                    </select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Age" name="age" rules={rules}>
                    <Input Type="number" />
                  </Form.Item>
                </Col>

              </Row>

              <div className="flex gap-10">
                {additionalThings.map((item) => {
                  return (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      valuePropName="checked"
                    >
                      <Input
                        type="checkbox"
                        value={item.name}
                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            [item.name]: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldValue(item.name)}
                      />
                    </Form.Item>
                  );
                })}
              </div>

              <Form.Item
                label="Show Bids on Product Page"
                name="showBidsOnProductPage"
                valuePropName="checked"
              >
                <Input
                  type="checkbox"
                  onChange={(e) => {
                    formRef.current.setFieldsValue({
                      showBidsOnProductPage: e.target.checked,
                    });
                  }}
                  checked={formRef.current?.getFieldValue(
                    "showBidsOnProductPage"
                  )}
                  style={{ width: 60  , marginLeft:20}}
                />
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
            <Images
              selectedProduct={selectedProduct}
              setShowProductForm={setshowProductForm}
              getData={getData}
            ></Images>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
}

export default ProductsForm;
