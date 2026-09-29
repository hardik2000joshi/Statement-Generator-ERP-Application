// utils/calculateBalances.js

function calculateBalances(transactions, openingBalance) {
  let runningBalance = openingBalance;
  const transactionsWithBalance = transactions.map((transaction) => {
    if (transaction.type === "credit") {
      runningBalance += transaction.amount;
    } else if (transaction.type === "debit") {
      runningBalance -= transaction.amount;
    }

    return {
      ...transaction,
      balance: runningBalance,
    };
  });

  return {
    transactions: transactionsWithBalance,
    closingBalance: runningBalance,
  };
}

module.exports = calculateBalances;