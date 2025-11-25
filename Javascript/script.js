let transactions = [];
let currentFilter = 'all';

document.getElementById('date').valueAsDate = new Date();

window.onload = function () {
    loadTransactions();
    updateDashboard();
};

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');
}

document.getElementById('transactionForm').addEventListener('submit', function (e) {
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
    saveTransactions();
    updateDashboard();
    displayTransactions();

    this.reset();
    document.getElementById('date').valueAsDate = new Date();

    showNotification('Transaction added successfully! ✅');
});


function updateDashboard() {
    const income = transactions.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    document.getElementById('totalBalance').textContent = `₹${balance.toFixed(2)}`;
    document.getElementById('totalIncome').textContent = `₹${income.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `₹${expense.toFixed(2)}`;
    document.getElementById('transactionCount').textContent = transactions.length;

    displayRecentTransactions();
}

function displayRecentTransactions() {
    const tbody = document.getElementById('recentTransactions');
    const recent = transactions.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>No transactions yet</p>
                    </div>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = recent.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td><span class="transaction-type ${t.type}">${t.type}</span></td>
            <td class="${t.type === 'income' ? 'amount-positive' : 'amount-negative'}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </td>
        </tr>
    `).join('');
}

function displayTransactions() {
    const tbody = document.getElementById('allTransactions');
    const filtered = currentFilter === 'all'
        ? transactions
        : transactions.filter(t => t.type === currentFilter);

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>No transactions found</p>
                    </div>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td><span class="transaction-type ${t.type}">${t.type}</span></td>
            <td class="${t.type === 'income' ? 'amount-positive' : 'amount-negative'}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </td>
            <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button></td>
        </tr>
    `).join('');
}

function filterTransactions(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    displayTransactions();
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateDashboard();
        displayTransactions();
        showNotification('Transaction deleted! 🗑️');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function saveTransactions() {
    // currently in-memory only
}


function loadTransactions() {
    transactions = [
        {
            id: 1,
            description: "Starting Income",
            amount: 60000,
            type: "income",
            category: "Salary",
            date: new Date().toISOString().split("T")[0]
        }
    ];
}
