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
      
      if (!token) {
        throw new Error("Please login to continue with payment");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
      
      const response = await axios.post(
        `${backendUrl}/api/paypal/create-order`,
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
      console.error("Error creating PayPal order:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create PayPal order";
      onError(new Error(errorMessage));
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      
      if (!token) {
        throw new Error("Please login to continue with payment");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
      
      const response = await axios.post(
        `${backendUrl}/api/paypal/capture-order/${data.orderID}`,
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
      console.error("Error capturing PayPal order:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || "Failed to capture PayPal payment";
      onError(new Error(errorMessage));
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