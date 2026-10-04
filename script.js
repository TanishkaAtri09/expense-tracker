/* ================================= */
/* TRANSACTIONS */
/* ================================= */

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];


let editingIndex = null;
/* ================================= */
/* FINANCIAL CHART */
/* ================================= */

const ctx = document.getElementById("financeChart");

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];


/* ================================= */
/* CALCULATE MONTHLY DATA */
/* ================================= */

function getMonthlyData() {

  const monthlyIncome = new Array(12).fill(0);
  const monthlyExpense = new Array(12).fill(0);

  transactions.forEach(function (transaction) {

    const date = new Date(transaction.date);

    const month = date.getMonth();

    if (transaction.type === "income") {

      monthlyIncome[month] += transaction.amount;

    }

    if (transaction.type === "expense") {

      monthlyExpense[month] += transaction.amount;

    }

  });


  /* Calculate balance */

  const monthlyBalance = monthlyIncome.map(function (income, index) {

    return income - monthlyExpense[index];

  });


  return {
    income: monthlyIncome,
    expense: monthlyExpense,
    balance: monthlyBalance
  };

}


/* ================================= */
/* GET CHART DATA */
/* ================================= */

const monthlyData = getMonthlyData();


/* ================================= */
/* CREATE CHART */
/* ================================= */

const financeChart = new Chart(ctx, {

  type: "line",

  data: {

    labels: monthLabels,

    datasets: [

      {
        label: "Income",

        data: monthlyData.income,

        tension: 0.4
      },

      {
        label: "Expense",

        data: monthlyData.expense,

        tension: 0.4
      },

      {
        label: "Balance",

        data: monthlyData.balance,

        tension: 0.4
      }

    ]

  },


  options: {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: "top"
      }

    },

    scales: {

      y: {
        beginAtZero: true
      }

    }

  }

});

function updateChart() {

    const monthlyData = getMonthlyData();
  
    financeChart.data.datasets[0].data =
      monthlyData.income;
  
    financeChart.data.datasets[1].data =
      monthlyData.expense;
  
    financeChart.data.datasets[2].data =
      monthlyData.balance;
  
    financeChart.update();
  }

const addTransactionBtn = document.querySelector(".add-transaction-btn");
const transactionModal = document.getElementById("transactionModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

addTransactionBtn.addEventListener("click", function () {
  transactionModal.classList.add("show");
});
closeModal.addEventListener("click", function () {
  transactionModal.classList.remove("show");
});
cancelModal.addEventListener("click", function () {
  transactionModal.classList.remove("show");
});
//transactions
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");

//add transactions
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  //get values from form
  const title = document.getElementById("transactionTitle").value;
  const amount = document.getElementById("transactionAmount").value;
  const type = this.querySelector(
    'input[name="transactionType"]:checked'
  ).value;
  const category = document.getElementById("transactionCategory").value;
  const date = document.getElementById("transactionDate").value;

  //create transaction object
  const transaction = {
    title: title,
    amount: Number(amount),
    type: type,
    category: category,
    date: date,
  };

/* ================================= */
/* ADD OR UPDATE TRANSACTION */
/* ================================= */

if (editingIndex !== null) {

    // Update existing transaction
    transactions[editingIndex] = transaction;

    // Reset editing mode
    editingIndex = null;

} else {

    // Add new transaction
    transactions.push(transaction);

}

// Save transactions
localStorage.setItem("transactions", JSON.stringify(transactions));

  //shpw transactions
  displayTransactions();
  // update
  updateSummary();

  updateChart();

  //reset form
  transactionForm.reset();

  //cancel modal
  transactionModal.classList.remove("show");
});
//display transactions
function displayTransactions() {
  transactionList.innerHTML = "";

  //if there are no transaction
  if (transactions.length === 0) {
    transactionList.innerHTML = `
            <div class="empty-transactions">
                <p>No transactions yet</p>
                <span>
                    Add your first transaction to see it here.
                </span>
            </div>
        `;

    return;
  }

  /* Display every transaction */

  transactions.forEach(function (transaction) {
    const transactionItem = document.createElement("div");

    transactionItem.classList.add("transaction-item");

    /* Income or expense sign */

    const sign = transaction.type === "income" ? "+" : "-";

    /* Income or expense icon */

    const icon = transaction.type === "income" ? "↗" : "↘";

    /* Create transaction HTML */

    transactionItem.innerHTML = `

            <div class="transaction-info">

                <div class="transaction-icon ${transaction.type}">
                    ${icon}
                </div>

                <div class="transaction-details">

                    <h3>
                        ${transaction.title}
                    </h3>

                    <p>
                        ${transaction.category} • ${transaction.date}
                    </p>

                </div>

            </div>

<div class="transaction-amount ${transaction.type}">

    ${sign} ₹${transaction.amount.toLocaleString("en-IN")}

    <button class="edit-btn" onclick="editTransaction(${transactions.indexOf(transaction)})">
        Edit
    </button>

    <button class="delete-btn" onclick="deleteTransaction(${transactions.indexOf(transaction)})">
        Delete
    </button>

</div>

        `;

    /* Add transaction to list */

    transactionList.appendChild(transactionItem);
  });
}
displayTransactions();

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += transaction.amount;
    }

    if (transaction.type === "expense") {
      expense += transaction.amount;
    }
  });

  const balance = income - expense;

  totalIncome.textContent = `₹${income.toLocaleString("en-IN")}`;

  totalExpense.textContent = `₹${expense.toLocaleString("en-IN")}`;

  totalBalance.textContent = `₹${balance.toLocaleString("en-IN")}`;
}

/* ================================= */
/* DELETE TRANSACTION */
/* ================================= */

function deleteTransaction(index) {

    // Remove transaction from array
    transactions.splice(index, 1);

    // Update localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Update transaction list
    displayTransactions();

    // Update summary
    updateSummary();

    // Update chart
    updateChart();
}

/* ================================= */
/* EDIT TRANSACTION */
/* ================================= */

/* ================================= */
/* EDIT TRANSACTION */
/* ================================= */

function editTransaction(index) {

    // Remember which transaction is being edited
    editingIndex = index;

    // Get the selected transaction
    const transaction = transactions[index];

    // Fill the form
    document.getElementById("transactionTitle").value = transaction.title;
    document.getElementById("transactionAmount").value = transaction.amount;
    document.getElementById("transactionCategory").value = transaction.category;
    document.getElementById("transactionDate").value = transaction.date;

    // Select income or expense
    document.querySelector(
        `input[name="transactionType"][value="${transaction.type}"]`
    ).checked = true;

    // Open modal
    transactionModal.classList.add("show");
}

updateSummary();
