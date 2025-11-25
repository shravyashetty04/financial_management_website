let transactions = [];
let initialBalance = 50000;
let currentFilter = 'all';
let financeChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if(dateInput) dateInput.valueAsDate = new Date();
    
    // Load saved data
    loadData();
    
    // Initialize chart and dashboard
    initChart();
    updateDashboard();
});

// --- NEW: Manual Balance Logic ---
function editBalance() {
    const newBalance = prompt("Enter your current initial wallet balance (₹):", initialBalance);
    if (newBalance !== null && !isNaN(newBalance) && newBalance.trim() !== "") {
        initialBalance = parseFloat(newBalance);
        saveData(); // Save to localStorage
        updateDashboard();
        showNotification("Initial balance updated! 💰");
    } else if (newBalance !== null) {
        alert("Please enter a valid number.");
    }
}

// --- Dashboard Updates ---
function updateDashboard() {
    // 1. Calculate Transaction Totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // 2. Calculate Final Balance (Initial + Income - Expense)
    const totalBalance = initialBalance + income - expense;

    // 3. Update DOM
    updateText('totalBalance', `₹${totalBalance.toFixed(2)}`);
    updateText('totalIncome', `₹${income.toFixed(2)}`);
    updateText('totalExpense', `₹${expense.toFixed(2)}`);

    // 4. Update Tables & Chart
    displayRecentTransactions();
    displayTransactions();
    updateChart();
}

function updateText(id, value) {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
}

// --- Chart Logic (Expenses by Category) ---
function initChart() {
    const ctx = document.getElementById('financeChart');
    if(!ctx) return;

    financeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#ff7675', '#74b9ff', '#55efc4', '#a29bfe', 
                    '#ffeaa7', '#fab1a0', '#fd79a8', '#636e72'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#a0a0a0', font: { family: 'Poppins' } } }
            },
            cutout: '70%'
        }
    });
}

function updateChart() {
    if(!financeChart) return;
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenses.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // Handle empty state for chart
    if(labels.length === 0) {
        financeChart.data.labels = ['No Expenses'];
        financeChart.data.datasets[0].data = [1];
        financeChart.data.datasets[0].backgroundColor = ['#2d3436'];
    } else {
        financeChart.data.labels = labels;
        financeChart.data.datasets[0].data = data;
        financeChart.data.datasets[0].backgroundColor = [
            '#ff7675', '#74b9ff', '#55efc4', '#a29bfe', 
            '#ffeaa7', '#fab1a0', '#fd79a8', '#636e72'
        ];
    }
    financeChart.update();
}

// --- Add Transaction ---
const form = document.getElementById('transactionForm');
if(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };

        transactions.unshift(transaction);
        saveData();
        updateDashboard();
        
        this.reset();
        document.getElementById('date').valueAsDate = new Date();
        showNotification('Transaction added successfully! 🎉');
    });
}

// --- Data Persistence (LocalStorage) ---
function saveData() {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    localStorage.setItem('finance_initial_balance', initialBalance.toString());
}

function loadData() {
    const savedTransactions = localStorage.getItem('finance_transactions');
    const savedBalance = localStorage.getItem('finance_initial_balance');

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    if (savedBalance) {
        initialBalance = parseFloat(savedBalance);
    }
}

// --- Helper Functions ---
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(sectionName).classList.add('active');
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
}

function displayRecentTransactions() {
    const tbody = document.getElementById('recentTransactions');
    if(!tbody) return;
    const recent = transactions.slice(0, 5);
    tbody.innerHTML = recent.length ? recent.map(rowHTML).join('') : emptyHTML();
}

function displayTransactions() {
    const tbody = document.getElementById('allTransactions');
    if(!tbody) return;
    const filtered = currentFilter === 'all' ? transactions : transactions.filter(t => t.type === currentFilter);
    tbody.innerHTML = filtered.length ? filtered.map(rowHTMLWithDelete).join('') : emptyHTML();
}

function filterTransactions(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(event) event.target.classList.add('active');
    displayTransactions();
}

function deleteTransaction(id) {
    if(confirm('Delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        updateDashboard();
        showNotification('Transaction deleted 🗑️');
    }
}

// HTML Generators
const emptyHTML = () => `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #666;">No transactions found</td></tr>`;

const rowHTML = (t) => `
    <tr>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td>${t.description}</td>
        <td>${t.category}</td>
        <td><span class="transaction-type ${t.type}">${t.type}</span></td>
        <td class="${t.type === 'income' ? 'amount-positive' : 'amount-negative'}">
            ${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
        </td>
    </tr>`;

const rowHTMLWithDelete = (t) => `
    <tr>
        ${rowHTML(t).replace('<tr>','').replace('</tr>','')}
        <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button></td>
    </tr>`;

function showNotification(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #6c5ce7; color: white; padding: 12px 24px;
        border-radius: 8px; font-weight: 600; z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Add animation style
const style = document.createElement('style');
style.innerHTML = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);
