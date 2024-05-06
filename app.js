let incomeTransactions = [];
let expenseTransactions = [];

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const addIncomeBtn = document.getElementById("addIncomeBtn");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const balanceDisplay = document.getElementById("balance");
const incomeTotalDisplay = document.getElementById("incomeTotal");
const expenseTotalDisplay = document.getElementById("expenseTotal");

function addTransaction(description, amount, type) {
  const transaction = { description, amount };

  if (type === "income") {
    incomeTransactions.push(transaction);
    updateTransactionList(incomeList, incomeTransactions, "income");
    updateIncomeTotal();
  } else {
    expenseTransactions.push(transaction);
    updateTransactionList(expenseList, expenseTransactions, "expense");
    updateExpenseTotal();
  }

  updateBalance();
}

function updateTransactionList(list, transactions, type) {
  list.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const item = document.createElement("li");
    item.classList.add("transaction-item");
    item.innerHTML = `
            <span>${transaction.description} - ${transaction.amount} PLN</span>
            <button class="edit-btn" onclick="editTransaction(${index}, '${type}')">Edytuj</button>
            <button class="delete-btn" onclick="deleteTransaction(${index}, '${type}')">Usuń</button>
        `;
    list.appendChild(item);
  });
}

function updateIncomeTotal() {
  const total = incomeTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0
  );
  incomeTotalDisplay.innerText = `Suma przychodów: ${total.toFixed(2)} PLN`;
}

function updateExpenseTotal() {
  const total = expenseTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0
  );
  expenseTotalDisplay.innerText = `Suma wydatków: ${total.toFixed(2)} PLN`;
}

function updateBalance() {
  const incomeTotal = incomeTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0
  );
  const expenseTotal = expenseTransactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0
  );
  const balance = incomeTotal - expenseTotal;

  if (balance > 0) {
    balanceDisplay.innerText = `Możesz jeszcze wydać ${balance.toFixed(
      2
    )} złotych`;
    balanceDisplay.classList.remove("expense");
  } else if (balance < 0) {
    balanceDisplay.innerText = `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balance
    ).toFixed(2)} złotych`;
    balanceDisplay.classList.add("expense");
  } else {
    balanceDisplay.innerText = "Bilans wynosi zero";
    balanceDisplay.classList.remove("expense");
  }
}

function editTransaction(index, type) {
  const transactions =
    type === "income" ? incomeTransactions : expenseTransactions;
  const newDescription = prompt("Wprowadź nowy opis:");
  const newAmount = parseFloat(prompt("Wprowadź nową kwotę:"));

  if (newDescription !== null && newAmount !== null && !isNaN(newAmount)) {
    transactions[index].description = newDescription;
    transactions[index].amount = newAmount.toFixed(2);
    updateTransactionList(
      type === "income" ? incomeList : expenseList,
      transactions,
      type
    );
    if (type === "income") {
      updateIncomeTotal();
    } else {
      updateExpenseTotal();
    }
    updateBalance();
  }
}

function deleteTransaction(index, type) {
  const transactions =
    type === "income" ? incomeTransactions : expenseTransactions;
  transactions.splice(index, 1);
  updateTransactionList(
    type === "income" ? incomeList : expenseList,
    transactions,
    type
  );
  if (type === "income") {
    updateIncomeTotal();
  } else {
    updateExpenseTotal();
  }
  updateBalance();
}

addIncomeBtn.addEventListener("click", () => {
  const description = document.getElementById("incomeDescription").value;
  const amount = document.getElementById("incomeAmount").value;

  if (description.trim() !== "" && amount.trim() !== "") {
    addTransaction(description, amount, "income");
    document.getElementById("incomeDescription").value = "";
    document.getElementById("incomeAmount").value = "";
  } else {
    alert("Wprowadź opis i kwotę przychodu.");
  }
});

addExpenseBtn.addEventListener("click", () => {
  const description = document.getElementById("expenseDescription").value;
  const amount = document.getElementById("expenseAmount").value;

  if (description.trim() !== "" && amount.trim() !== "") {
    addTransaction(description, amount, "expense");
    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseAmount").value = "";
  } else {
    alert("Wprowadź opis i kwotę wydatku.");
  }
});
