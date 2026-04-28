import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import axios from "axios";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="text-center py-4">Loading PayPal...</div>;
  }

  const createOrder = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/paypal/create-order`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      return response.data.orderID;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      onError(error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/paypal/capture-order/${data.orderID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      onSuccess(response.data);
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      onError(error);
    }
  };

  return (
    <PayPalButtons 
        style={{layout: "vertical"}} 
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(error) => {
            console.error("PayPal error:", error);
            onError(error);
        }}
        onCancel={() => {
            console.log("Payment cancelled");
        }}
    />
  )
}

export default PaypalButton