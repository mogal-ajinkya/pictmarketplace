import { Form, Modal ,Input ,message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { PlaceNewBid } from "../../apicalls/products";
import { AddNotification } from "../../apicalls/notifications";

function BidModal({ ShowBidModal, setShowBidModal, product, reloadData }) {
  const {user} = useSelector((state) => state.users);
  const formRef = React.useRef(null);
  const rules = [{required: true,message: "Required"}];
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await PlaceNewBid({
        ...values,
        product : product._id,
        seller: product.seller._id,
        buyer:user._id,
      });
      if(response.success){
        dispatch(SetLoader(false));
        message.success("Bid placed successfully");

         // send notification to seller
         await AddNotification({
          title: "A new bid has been placed",
          message: `A new bid has been placed on your product ${product.name} by ${user.name} for $ ${values.bidAmount}`,
          user: product.seller._id,
          onClick: `/profile`,
          read: false,
        });
        reloadData();
        setShowBidModal(false);
      }
    } catch (error){
      message.error(error.message);
      dispatch(SetLoader(false));
    }
  };
  return (
    <Modal
      visible={ShowBidModal}
      onCancel={() => setShowBidModal(false)}
      open={ShowBidModal}
      width={600}
      centered
      onOk={() => formRef.current.submit()}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-orange-900 text-center">
          place A Bid
        </h1>
      </div>
      

      <Form layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        >

          <Form.Item label="Bid Amount" name="bidAmount"
          rules={rules}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label="Message" name="message" rules={rules}>
            <Input.TextArea/>
          </Form.Item>
          <Form.Item label="Mobile" name="mobile" rules={rules}>
            <Input type="number"/>
          </Form.Item>
      </Form>
    </Modal>
  );
}

export default BidModal;
