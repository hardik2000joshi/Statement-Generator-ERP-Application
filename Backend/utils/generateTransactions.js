function getRandomAmount(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDate(startDate, endDate) {
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function generateTransactions({
    companyId,
    vendors,
    fromDate,
    toDate,
    txnsPerWeek
})
{
    const transactions = [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    for (let index = 0; index < txnsPerWeek; index++){
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];

        // whether that vendor is an income or expense for company
        const hasIncome = Number(vendor.incomingMax) > 0 && Number(vendor.incomingMax) >= Number(vendor.incomingMin);
        const hasExpense = Number(vendor.outgoingMax) > 0 && Number(vendor.outgoingMax) >= Number(vendor.outgoingMin);
        let type;
        let amount;

        if(hasIncome && !hasExpense){
            type = "credit";
            amount = getRandomAmount(Number(vendor.incomingMin), Number(vendor.incomingMax));
        }
        else if(hasExpense && !hasIncome){
            type = "debit";
            amount = getRandomAmount(Number(vendor.outgoingMin), Number(vendor.outgoingMax));
        }
        else {
            // skip vendors whose transaction type is unclear
            continue;
        }

        transactions.push({
            company: companyId,
            vendor: vendor._id,
            category: vendor.category,
            date: getRandomDate(startDate, endDate),
            description: vendor.name,
            type,
            amount,
        });
    }
    return transactions;
}
module.exports = generateTransactions;