const ctx = document.getElementById("financeChart");

new Chart(ctx, {
    type: "line",

    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [
            {
                label: "Income",
                data: [30000, 35000, 32000, 40000, 38000, 42000],
                tension: 0.4
            },
            {
                label: "Expense",
                data: [18000, 21000, 19000, 23000, 20000, 14550],
                tension: 0.4
            },
            {
                label: "Balance",
                data: [12000, 14000, 13000, 17000, 18000, 27450],
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

const addTransactionBtn = document.querySelector(".add-transaction-btn");
const transactionModal = document.getElementById("transactionModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

addTransactionBtn.addEventListener("click",function(){
    transactionModal.classList.add("show")
});
closeModal.addEventListener("click",function(){
    transactionModal.classList.remove("show")
});
cancelModal.addEventListener("click",function(){
    transactionModal.classList.remove("show")
});