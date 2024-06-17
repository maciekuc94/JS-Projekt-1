document.addEventListener("DOMContentLoaded", function () {
  let incomeTransactions = [];
  let expenseTransactions = [];

  const incomeForm = document.getElementById("incomeForm");
  const expenseForm = document.getElementById("expenseForm");
  const incomeList = document.getElementById("incomeList");
  const expenseList = document.getElementById("expenseList");
  const balanceDisplay = document.getElementById("balance");
  const incomeTotalDisplay = document.getElementById("incomeTotal");
  const expenseTotalDisplay = document.getElementById("expenseTotal");

  let isEditing = false;
  let editingIndex = null;

  incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const description = this.elements.incomeDescription.value;
    const amount = this.elements.incomeAmount.value;

    if (
      validateInput(
        description,
        amount,
        document.getElementById("incomeDescriptionError"),
        document.getElementById("incomeAmountError")
      )
    ) {
      addTransaction(description, amount, "income");
      this.reset();
    }
  });

  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const description = this.elements.expenseDescription.value;
    const amount = this.elements.expenseAmount.value;

    if (
      validateInput(
        description,
        amount,
        document.getElementById("expenseDescriptionError"),
        document.getElementById("expenseAmountError")
      )
    ) {
      addTransaction(description, amount, "expense");
      this.reset();
    }
  });

  function addTransaction(description, amount, type) {
    const amountValue = parseFloat(amount);

    if (isNaN(amountValue) || amountValue <= 0) {
      console.error("Invalid amount:", amount);
      return;
    }

    const transaction = { description, amount: amountValue };

    if (isEditing !== false) {
      if (type === "income") {
        incomeTransactions[editingIndex] = transaction;
        updateTransactionList(incomeList, incomeTransactions, "income");
        updateIncomeTotal();
      } else {
        expenseTransactions[editingIndex] = transaction;
        updateTransactionList(expenseList, expenseTransactions, "expense");
        updateExpenseTotal();
      }
    } else {
      if (type === "income") {
        incomeTransactions.push(transaction);
        updateTransactionList(incomeList, incomeTransactions, "income");
        updateIncomeTotal();
      } else {
        expenseTransactions.push(transaction);
        updateTransactionList(expenseList, expenseTransactions, "expense");
        updateExpenseTotal();
      }
    }

    updateBalance();

    isEditing = false;
    editingIndex = null;
  }

  function updateTransactionList(list, transactions, type) {
    list.innerHTML = "";

    transactions.forEach((transaction, index) => {
      const item = createTransactionItem(transaction, index, type);
      list.appendChild(item);
    });
  }

  function createTransactionItem(transaction, index, type) {
    const item = document.createElement("li");
    item.classList.add("transaction-item");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edytuj";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Usuń";

    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);

    const transactionInfo = document.createElement("span");
    transactionInfo.textContent = `${
      transaction.description
    } - ${transaction.amount.toFixed(2)} PLN`;

    item.appendChild(buttonsContainer);
    item.appendChild(transactionInfo);

    editBtn.addEventListener("click", () => handleEditClick(index, type));
    deleteBtn.addEventListener("click", () => handleDeleteClick(index, type));

    return item;
  }

  function handleEditClick(index, type) {
    const transactions =
      type === "income" ? incomeTransactions : expenseTransactions;
    const transactionToEdit = transactions[index];

    isEditing = { type, index };

    document.getElementById("editDescription").value =
      transactionToEdit.description;
    document.getElementById("editAmount").value = transactionToEdit.amount;

    document.getElementById("editModal").style.display = "block";
  }

  document.getElementById("editSaveBtn").addEventListener("click", () => {
    if (!isEditing) return;

    const { type, index } = isEditing;
    const transactions =
      type === "income" ? incomeTransactions : expenseTransactions;
    const newDescription = document.getElementById("editDescription").value;
    const newAmount = document.getElementById("editAmount").value;

    transactions[index].description = newDescription;
    transactions[index].amount = parseFloat(newAmount);

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

    document.getElementById("editModal").style.display = "none";
    isEditing = false;
    editingIndex = null;
  });

  function handleDeleteClick(index, type) {
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

    isEditing = false;
    editingIndex = null;
  }

  document.getElementById("editSaveBtn").addEventListener("click", () => {
    if (!isEditing) return;

    const { type, index } = isEditing;
    const transactions =
      type === "income" ? incomeTransactions : expenseTransactions;
    const newDescription = document.getElementById("editDescription").value;
    const newAmount = document.getElementById("editAmount").value;

    transactions[index].description = newDescription;
    transactions[index].amount = parseFloat(newAmount);

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

    document.getElementById("editModal").style.display = "none";

    isEditing = false;
    editingIndex = null;
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";

    isEditing = false;
    editingIndex = null;
  });

  function updateIncomeTotal() {
    incomeTotalDisplay.textContent = `Suma przychodów: ${calculateTotal(
      incomeTransactions
    ).toFixed(2)} PLN`;
  }

  function updateExpenseTotal() {
    expenseTotalDisplay.textContent = `Suma wydatków: ${calculateTotal(
      expenseTransactions
    ).toFixed(2)} PLN`;
  }

  function calculateTotal(transactions) {
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  }

  function updateBalance() {
    const incomeTotal = calculateTotal(incomeTransactions);
    const expenseTotal = calculateTotal(expenseTransactions);
    const balance = incomeTotal - expenseTotal;
    balanceDisplay.textContent =
      balance > 0
        ? `Możesz jeszcze wydać ${balance.toFixed(2)} złotych`
        : balance < 0
        ? `Bilans jest ujemny. Jesteś na minusie ${Math.abs(balance).toFixed(
            2
          )} złotych`
        : "Bilans wynosi zero";
    balanceDisplay.classList.toggle("expense", balance < 0);
  }

  function validateInput(description, amount, descriptionError, amountError) {
    descriptionError.textContent = "";
    amountError.textContent = "";

    let isValid = true;

    if (description.trim() === "") {
      descriptionError.textContent = "Opis nie może być pusty.";
      isValid = false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      amountError.textContent = "Wprowadź poprawną kwotę większą od zera.";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      amountError.textContent =
        "Wprowadź dodatnią kwotę z maksymalnie dwoma miejscami po przecinku.";
      isValid = false;
    }

    return isValid;
  }
});
