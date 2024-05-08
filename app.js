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
    const amountValue = Number(amount);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      console.error("Invalid amount:", amount);
      return;
    }

    const transaction = { description, amount: amountValue };

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
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    transactions.forEach((transaction, index) => {
      const item = document.createElement("li");
      item.classList.add("transaction-item");

      const buttonsContainer = document.createElement("div");
      buttonsContainer.classList.add("buttons-container");

      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.setAttribute("data-index", index);
      editBtn.setAttribute("data-type", type);
      editBtn.textContent = "Edytuj";

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.setAttribute("data-index", index);
      deleteBtn.setAttribute("data-type", type);
      deleteBtn.textContent = "Usuń";

      buttonsContainer.appendChild(editBtn);
      buttonsContainer.appendChild(deleteBtn);

      const transactionInfo = document.createElement("span");
      transactionInfo.textContent = `${transaction.description} - ${transaction.amount} PLN`;

      item.appendChild(buttonsContainer);
      item.appendChild(transactionInfo);

      list.appendChild(item);

      editBtn.addEventListener("click", function (event) {
        event.preventDefault();
        editTransaction(index, type);
      });

      deleteBtn.addEventListener("click", function (event) {
        event.preventDefault();
        deleteTransaction(index, type);
      });
    });
  }

  function updateIncomeTotal() {
    const total = calculateTotal(incomeTransactions);
    incomeTotalDisplay.innerText = `Suma przychodów: ${total.toFixed(2)} PLN`;
  }

  function updateExpenseTotal() {
    const total = calculateTotal(expenseTransactions);
    expenseTotalDisplay.innerText = `Suma wydatków: ${total.toFixed(2)} PLN`;
  }

  function calculateTotal(transactions) {
    return transactions.reduce(
      (total, transaction) => total + parseFloat(transaction.amount),
      0
    );
  }

  function updateBalance() {
    const incomeTotal = calculateTotal(incomeTransactions);
    const expenseTotal = calculateTotal(expenseTransactions);
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
    const transactionToEdit = transactions[index];

    const modal = document.getElementById("editModal");
    const descriptionInput = document.getElementById("editDescription");
    const amountInput = document.getElementById("editAmount");
    const editDescriptionError = document.getElementById(
      "editDescriptionError"
    );
    const editAmountError = document.getElementById("editAmountError");

    modal.style.display = "block";

    descriptionInput.value = transactionToEdit.description;
    amountInput.value = transactionToEdit.amount;

    editDescriptionError.innerText = "";
    editAmountError.innerText = "";

    descriptionInput.classList.remove("error");
    amountInput.classList.remove("error");

    const editSaveBtn = document.getElementById("editSaveBtn");

    editSaveBtn.addEventListener("click", function () {
      const newDescription = descriptionInput.value;
      const newAmount = amountInput.value;

      if (
        validateInput(
          newDescription,
          newAmount,
          editDescriptionError,
          editAmountError
        )
      ) {
        transactions[index].description = newDescription;
        transactions[index].amount = newAmount;

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

        modal.style.display = "none";
      }
    });

    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
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

  function validateInput(description, amount, descriptionError, amountError) {
    descriptionError.innerText = "";
    amountError.innerText = "";

    let isValid = true;

    if (description.trim() === "") {
      descriptionError.innerText = "Opis nie może być pusty.";
      isValid = false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      amountError.innerText = "Wprowadź poprawną kwotę większą od zera.";
      isValid = false;
    }

    if (!/^(\d{1,})+(\.\d{1,2})?$/.test(amount)) {
      amountError.innerText =
        "Wprowadź dodatnią kwotę z maksymalnie dwoma miejscami po przecinku.";
      isValid = false;
    }

    return isValid;
  }
});
