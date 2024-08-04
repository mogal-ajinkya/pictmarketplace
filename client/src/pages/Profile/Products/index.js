import React, { useState } from "react";
import { Button, message, Table } from "antd";
import ProductsForm from "./ProductsForm";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { GetProducts } from "../../../apicalls/products";
import { useEffect } from "react";
import { DeleteProduct } from "../../../apicalls/products";
import moment from "moment";
import { useSelector } from "react-redux";
import Bids from "./Bids";

const Products = () => {
  const [showBids, setShowBids] = useState(false);
  const [bids, setBids] = useState([]);
  const [products, setProducts] = React.useState(null);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [showProductForm, setshowProductForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({
        seller: user._id,
      });
      if (response.success) {
        dispatch(SetLoader(false));
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      className:"max-sm:hidden",
      render: (text, record) => {
        return (
          <img
            src={record?.images?.length > 0 ? record.images[0] : ""}
            alt=""
            className="w-20 h-20 object-cover rounded-md"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      className:"max-sm:hidden",
    },
    {
      title: "Price",
      dataIndex: "price",
      className:"max-sm:hidden",
      className:"max-sm:hidden",
    },
    {
      title: "Category",
      dataIndex: "category",
      className:"max-sm:hidden",
    },
    {
      title: "Age",
      dataIndex: "age",
      className:"max-sm:hidden"
    },
    {
      title: "Status",
      dataIndex: "status",
      className:"max-sm:hidden",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        // moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
      moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
      className:"max-sm:hidden"
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteProduct(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedProduct(record);
                setshowProductForm(true);
              }}
            ></i>

            <span
              className="underline cursor-pointer"
              onClick={() => {
                setSelectedProduct(record);
                setShowBids(true);
              }}
            >
              Show Bids
            </span>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setshowProductForm(true);
            setSelectedProduct(null);
          }}
        >
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} scroll={{ x: 'max-content' }}></Table>
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setshowProductForm={setshowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}

      {showBids && (
        <Bids
          showBidsModal={showBids}
          setShowBidsModal={setShowBids}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
