// /*
//  * @copyRight by md sarwar hoshen.
//  */
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { apiUrl } from "../../config/appConfig";
// import { Post } from "../../api";
// const CheckoutSuccess = () => {
//   const [transactionDetails, setTransactionDetails] = useState(null);
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const sessionId = searchParams.get('session_id');
//   console.log("sessionIdsessionIdsessionIdsessionId::::", sessionId)
//   useEffect(() => {
//     // You can use the sessionId here as needed
//     console.log('Session ID:', sessionId);
//   }, [sessionId]);
//   //
//   useEffect(() => {
//     const fetchTransactionDetails = async () => {
//       try {
//         // Make a request to your server to fetch transaction details using the session ID
//         const response = await fetch(`${apiUrl()}/stripe/transaction-details?sessionId=${sessionId}`);
//         if (response.ok) {
//           const data = await response.json();
//           setTransactionDetails(data);
//         } else {
//           console.error('Failed to fetch transaction details:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching transaction details:', error);
//       }
//     };

//     fetchTransactionDetails();
//   }, [sessionId]);

//   return (
//     <div>
//       <h2>Checkout Successful</h2>
//       {transactionDetails ? (
//         <div>
//           <p>Transaction ID: {transactionDetails.id}</p>
//           <p>Amount: {transactionDetails.amount}</p>
//           {/* Display other transaction details as needed */}
//         </div>
//       ) : (
//         <p>Loading transaction details...</p>
//       )}
//       <p>Your order might take some time to process.</p>
//       <p>Check your order status at your profile after about 10 mins.</p>
//       <p>
//         In case of any inquiries, contact support at{' '}
//         <strong>support@onlineshop.com</strong>
//       </p>
//     </div>
//   );
// };

// export default CheckoutSuccess;

import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  return (
    <div>
      <h2>Checkout Successful</h2>
      <p>Session ID: {sessionId}</p>
      {/* Your success page content */}
    </div>
  );
};

export default CheckoutSuccess;