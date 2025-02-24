export const logTransaction = (transactionId, dateTime, mode, status) => {
  // Save the transaction details to your database or local storage
  console.log('Transaction Logged:', { transactionId, dateTime, mode, status });
}; 