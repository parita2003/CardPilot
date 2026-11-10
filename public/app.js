
// // ============================================
// // CARDPILOT - APPLICATION DATA
// // Demo reward rates are configurable examples,
// // NOT verified bank reward terms.
// // ============================================

// const cards = [
//     {
//         id: 1,
//         name: "HDFC Millennia",
//         issuer: "HDFC Bank",
//         last4: "4291",
//         annualFee: 1000,
//         feeWaiverThreshold: 100000,
//         rewardRates: {
//             Shopping: 0.05,
//             Food: 0.01,
//             Travel: 0.01,
//             Bills: 0.01,
//             Others: 0.01
//         },
//         rewardCap: 500,
//         dueDate: "15 Nov 2026",
//         theme: "hdfc"
//     },
//     {
//         id: 2,
//         name: "SBI Cashback",
//         issuer: "SBI Card",
//         last4: "7832",
//         annualFee: 999,
//         feeWaiverThreshold: 200000,
//         rewardRates: {
//             Shopping: 0.05,
//             Food: 0.01,
//             Travel: 0.01,
//             Bills: 0.01,
//             Others: 0.01
//         },
//         rewardCap: 500,
//         dueDate: "18 Nov 2026",
//         theme: "sbi"
//     },
//     {
//         id: 3,
//         name: "ICICI Amazon Pay",
//         issuer: "ICICI Bank",
//         last4: "6521",
//         annualFee: 0,
//         feeWaiverThreshold: 0,
//         rewardRates: {
//             Shopping: 0.05,
//             Food: 0.01,
//             Travel: 0.01,
//             Bills: 0.01,
//             Others: 0.01
//         },
//         rewardCap: 500,
//         dueDate: "22 Nov 2026",
//         theme: "icici"
//     }
// ];

// let transactions = [
//     {
//         id: 1,
//         merchant: "Amazon",
//         category: "Shopping",
//         amount: 5000,
//         cardId: 3,
//         date: "2026-11-09"
//     },
//     {
//         id: 2,
//         merchant: "Swiggy",
//         category: "Food",
//         amount: 2000,
//         cardId: 1,
//         date: "2026-11-08"
//     },
//     {
//         id: 3,
//         merchant: "Myntra",
//         category: "Shopping",
//         amount: 4500,
//         cardId: 2,
//         date: "2026-11-07"
//     },
//     {
//         id: 4,
//         merchant: "BigBasket",
//         category: "Food",
//         amount: 3000,
//         cardId: 1,
//         date: "2026-11-06"
//     },
//     {
//         id: 5,
//         merchant: "MakeMyTrip",
//         category: "Travel",
//         amount: 8000,
//         cardId: 2,
//         date: "2026-11-05"
//     },
//     {
//         id: 6,
//         merchant: "Netflix",
//         category: "Others",
//         amount: 649,
//         cardId: 3,
//         date: "2026-11-04"
//     },
//     {
//         id: 7,
//         merchant: "Electricity Bill",
//         category: "Bills",
//         amount: 2800,
//         cardId: 1,
//         date: "2026-11-03"
//     },
//     {
//         id: 8,
//         merchant: "Zomato",
//         category: "Food",
//         amount: 2500,
//         cardId: 2,
//         date: "2026-11-02"
//     }
// ];

// const bills = [
//     {
//         name: "HDFC Millennia",
//         amount: 3500,
//         date: "15 Nov 2026"
//     },
//     {
//         name: "SBI Cashback",
//         amount: 2800,
//         date: "18 Nov 2026"
//     },
//     {
//         name: "ICICI Amazon Pay",
//         amount: 2200,
//         date: "22 Nov 2026"
//     }
// ];

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================

// const formatCurrency = (amount) =>
//     "₹" + Number(amount).toLocaleString("en-IN", {
//         maximumFractionDigits: 2
//     });

// const getCard = (id) =>
//     cards.find(card => card.id === Number(id));

// const getCardName = (id) =>
//     getCard(id)?.name || "Unknown Card";

// const getIcon = (category) => {
//     const icons = {
//         Shopping: "🛍",
//         Food: "🍽",
//         Travel: "✈",
//         Bills: "⚡",
//         Others: "💳"
//     };

//     return icons[category] || "💳";
// };

// const escapeHTML = (value) => {
//     return String(value).replace(/[&<>"']/g, char => ({
//         "&": "&amp;",
//         "<": "&lt;",
//         ">": "&gt;",
//         '"': "&quot;",
//         "'": "&#39;"
//     })[char]);
// };

// // ============================================
// // REWARD CALCULATION
// // ============================================

// function calculateReward(transaction) {
//     const card = getCard(transaction.cardId);

//     if (!card) return 0;

//     const rate = card.rewardRates[transaction.category] || 0;

//     return Math.min(
//         transaction.amount * rate,
//         card.rewardCap
//     );
// }

// function getTotalSpending() {
//     return transactions.reduce(
//         (total, transaction) => total + transaction.amount,
//         0
//     );
// }

// function getTotalRewards() {
//     return transactions.reduce(
//         (total, transaction) => total + calculateReward(transaction),
//         0
//     );
// }

// function getCardSpending(cardId) {
//     return transactions
//         .filter(t => t.cardId === cardId)
//         .reduce((sum, t) => sum + t.amount, 0);
// }

// // ============================================
// // DASHBOARD RENDERING
// // ============================================

// function renderDashboard() {

//     const totalSpending = getTotalSpending();
//     const totalRewards = getTotalRewards();

//     document.getElementById("total-spending").textContent =
//         formatCurrency(totalSpending);

//     document.getElementById("total-rewards").textContent =
//         formatCurrency(totalRewards);

//     document.getElementById("reward-highlight").textContent =
//         formatCurrency(totalRewards);

//     document.getElementById("chart-total").textContent =
//         formatCurrency(totalSpending) + " total";

//     document.getElementById("total-cards").textContent =
//         String(cards.length).padStart(2, "0");

//     const upcomingTotal = bills.reduce(
//         (sum, bill) => sum + bill.amount,
//         0
//     );

//     document.getElementById("upcoming-payments").textContent =
//         formatCurrency(upcomingTotal);

//     renderRecentTransactions();
//     renderBills();
//     renderSpendingChart();
// }

// function renderRecentTransactions() {

//     const tbody = document.getElementById("recent-transactions");

//     const recent = [...transactions]
//         .sort((a, b) => b.date.localeCompare(a.date))
//         .slice(0, 5);

//     if (!recent.length) {
//         tbody.innerHTML =
//             `<tr><td colspan="4" class="empty-row">
//                 No transactions yet.
//             </td></tr>`;
//         return;
//     }

//     tbody.innerHTML = recent.map(t => `
//         <tr>
//             <td>
//                 <div class="merchant-cell">
//                     <div class="merchant-icon">
//                         ${getIcon(t.category)}
//                     </div>
//                     <div>
//                         <span class="merchant-name">
//                             ${escapeHTML(t.merchant)}
//                         </span>
//                         <span class="merchant-sub">
//                             ${t.date}
//                         </span>
//                     </div>
//                 </div>
//             </td>
//             <td>
//                 <span class="category-tag">
//                     ${escapeHTML(t.category)}
//                 </span>
//             </td>
//             <td>${escapeHTML(getCardName(t.cardId))}</td>
//             <td>${formatCurrency(t.amount)}</td>
//         </tr>
//     `).join("");
// }

// function renderBills() {

//     const container = document.getElementById("bill-list");

//     container.innerHTML = bills.map(bill => `
//         <div class="bill-item">
//             <div>
//                 <div class="bill-name">
//                     ${escapeHTML(bill.name)}
//                 </div>
//                 <div class="bill-date">
//                     Due ${escapeHTML(bill.date)}
//                 </div>
//             </div>
//             <div>
//                 <div class="bill-amount">
//                     ${formatCurrency(bill.amount)}
//                 </div>
//                 <div class="bill-status">Upcoming</div>
//             </div>
//         </div>
//     `).join("");
// }

// // ============================================
// // SPENDING CHART
// // ============================================

// function renderSpendingChart() {

//     const categories = [
//         "Shopping",
//         "Food",
//         "Travel",
//         "Bills",
//         "Others"
//     ];

//     const totals = categories.map(category =>
//         transactions
//             .filter(t => t.category === category)
//             .reduce((sum, t) => sum + t.amount, 0)
//     );

//     const max = Math.max(...totals, 1);

//     const chart = document.getElementById("spending-chart");

//     chart.innerHTML = categories.map((category, index) => {

//         const height = Math.max(
//             4,
//             (totals[index] / max) * 90
//         );

//         return `
//             <div class="bar-group">
//                 <div class="bar"
//                      style="height:${height}%"
//                      title="${formatCurrency(totals[index])}">
//                 </div>
//                 <span>${category}</span>
//             </div>
//         `;
//     }).join("");
// }

// // ============================================
// // CREDIT CARD PAGE
// // ============================================

// function renderCards() {

//     const container = document.getElementById("cards-grid");

//     container.innerHTML = cards.map(card => `
//         <div class="credit-card-item">

//             <div class="credit-card-visual ${escapeHTML(card.theme)}">
//                 <div class="card-issuer">
//                     <span>${escapeHTML(card.issuer)}</span>
//                     <span>VISA</span>
//                 </div>

//                 <div class="card-chip">▦</div>

//                 <div class="card-last4">
//                     •••• &nbsp; •••• &nbsp; •••• &nbsp;
//                     ${escapeHTML(card.last4 || "0000")}
//                 </div>

//                 <div class="card-owner">
//                     PARITA MENDAPARA
//                 </div>
//             </div>

//             <div class="card-detail-title">
//                 ${escapeHTML(card.name)}
//                 <span>● Active</span>
//             </div>

//             <div class="card-info-grid">
//                 <div>
//                     <small>Annual fee</small>
//                     <strong>${formatCurrency(card.annualFee)}</strong>
//                 </div>

//                 <div>
//                     <small>Fee waiver target</small>
//                     <strong>
//                         ${formatCurrency(card.feeWaiverThreshold)}
//                     </strong>
//                 </div>

//                 <div>
//                     <small>Total spending</small>
//                     <strong>
//                         ${formatCurrency(getCardSpending(card.id))}
//                     </strong>
//                 </div>

//                 <div>
//                     <small>Reward cap (demo)</small>
//                     <strong>${formatCurrency(card.rewardCap)}</strong>
//                 </div>
//             </div>
//         </div>
//     `).join("");
// }

// // ============================================
// // TRANSACTIONS PAGE
// // ============================================

// function renderAllTransactions() {

//     const tbody = document.getElementById("all-transactions");

//     const search = document
//         .getElementById("transaction-search")
//         .value.toLowerCase();

//     const category = document
//         .getElementById("category-filter")
//         .value;

//     const filtered = [...transactions]
//         .filter(t =>
//             t.merchant.toLowerCase().includes(search) ||
//             t.category.toLowerCase().includes(search)
//         )
//         .filter(t =>
//             category === "all" || t.category === category
//         )
//         .sort((a, b) => b.date.localeCompare(a.date));

//     if (!filtered.length) {
//         tbody.innerHTML = `
//             <tr>
//                 <td colspan="5" class="empty-row">
//                     No matching transactions found.
//                 </td>
//             </tr>
//         `;
//         return;
//     }

//     tbody.innerHTML = filtered.map(t => `
//         <tr>
//             <td>
//                 <div class="merchant-cell">
//                     <div class="merchant-icon">
//                         ${getIcon(t.category)}
//                     </div>
//                     <span class="merchant-name">
//                         ${escapeHTML(t.merchant)}
//                     </span>
//                 </div>
//             </td>
//             <td>
//                 <span class="category-tag">
//                     ${escapeHTML(t.category)}
//                 </span>
//             </td>
//             <td>${escapeHTML(getCardName(t.cardId))}</td>
//             <td>${t.date}</td>
//             <td>${formatCurrency(t.amount)}</td>
//         </tr>
//     `).join("");
// }

// // ============================================
// // REWARDS & FEE WAIVER PAGE
// // ============================================

// function renderFeeWaiver() {

//     const container = document.getElementById("fee-waiver-list");

//     container.innerHTML = cards.map(card => {

//         const spent = getCardSpending(card.id);

//         const threshold = card.feeWaiverThreshold;

//         const percentage = threshold > 0
//             ? Math.min((spent / threshold) * 100, 100)
//             : 100;

//         return `
//             <div class="fee-item">
//                 <div class="fee-title">
//                     <strong>${escapeHTML(card.name)}</strong>
//                     <span>
//                         ${threshold > 0
//                             ? formatCurrency(spent) + " / " +
//                               formatCurrency(threshold)
//                             : "No waiver target configured"}
//                     </span>
//                 </div>

//                 <div class="progress-track">
//                     <div class="progress-fill"
//                          style="width:${percentage}%">
//                     </div>
//                 </div>

//                 <small style="color:#888;font-size:9px;">
//                     ${threshold > 0
//                         ? formatCurrency(Math.max(threshold - spent, 0)) +
//                           " remaining"
//                         : "No annual fee waiver target"}
//                 </small>
//             </div>
//         `;
//     }).join("");
// }

// // ============================================
// // SMART CARD SELECTOR
// // ============================================

// function compareCards() {

//     const amount = Number(
//         document.getElementById("purchase-amount").value
//     );

//     const category = document.getElementById(
//         "purchase-category"
//     ).value;

//     const result = document.getElementById("comparison-results");

//     if (!Number.isFinite(amount) || amount <= 0) {
//         showToast("Please enter a valid purchase amount.");
//         return;
//     }

//     const comparisons = cards.map(card => {

//         const rate = card.rewardRates[category] || 0;

//         const reward = Math.min(
//             amount * rate,
//             card.rewardCap
//         );

//         return {
//             card,
//             reward
//         };
//     }).sort((a, b) => b.reward - a.reward);

//     if (!comparisons.length) {
//         result.innerHTML = "<p>No cards available.</p>";
//         return;
//     }

//     result.innerHTML = comparisons.map((item, index) => `
//         <div class="comparison-result ${index === 0 ? "best" : ""}">
//             <h4>
//                 ${index === 0 ? "✦ Best estimated option: " : ""}
//                 ${escapeHTML(item.card.name)}
//             </h4>

//             <p>
//                 Estimated reward:
//                 <strong>${formatCurrency(item.reward)}</strong>
//                 · Configured reward rate:
//                 ${(item.card.rewardRates[category] * 100).toFixed(1)}%
//             </p>
//         </div>
//     `).join("");

// }

// // ============================================
// // MODAL FUNCTIONS
// // ============================================

// function openModal(id) {
//     document.getElementById(id).classList.add("show");
// }

// function closeModal(id) {
//     document.getElementById(id).classList.remove("show");
// }

// function showToast(message) {

//     const toast = document.getElementById("toast");

//     toast.textContent = message;
//     toast.classList.add("show");

//     setTimeout(() => {
//         toast.classList.remove("show");
//     }, 2500);
// }

// function updateCardDropdown() {

//     const select = document.getElementById("card-input");

//     select.innerHTML = cards.map(card => `
//         <option value="${card.id}">
//             ${escapeHTML(card.name)}
//         </option>
//     `).join("");
// }

// // ============================================
// // ADD TRANSACTION
// // ============================================

// document.getElementById("transaction-form")
//     .addEventListener("submit", function(event) {

//         event.preventDefault();

//         const merchant = document
//             .getElementById("merchant-input").value.trim();

//         const amount = Number(
//             document.getElementById("amount-input").value
//         );

//         const category = document
//             .getElementById("category-input").value;

//         const cardId = Number(
//             document.getElementById("card-input").value
//         );

//         const date = document
//             .getElementById("date-input").value;

//         if (!merchant || !Number.isFinite(amount) ||
//             amount <= 0 || !getCard(cardId) || !date) {
//             showToast("Please enter valid transaction details.");
//             return;
//         }

//         transactions.push({
//             id: Date.now(),
//             merchant,
//             amount,
//             category,
//             cardId,
//             date
//         });

//         renderDashboard();
//         renderAllTransactions();
//         renderCards();
//         renderFeeWaiver();

//         closeModal("transaction-modal");
//         this.reset();

//         showToast("Transaction added successfully!");
//     });

// // ============================================
// // ADD CREDIT CARD
// // ============================================

// document.getElementById("card-form")
//     .addEventListener("submit", function(event) {

//         event.preventDefault();

//         const name = document
//             .getElementById("new-card-name").value.trim();

//         const issuer = document
//             .getElementById("new-card-issuer").value.trim();

//         const last4 = document
//             .getElementById("new-card-last4").value.trim();

//         const fee = Number(
//             document.getElementById("new-card-fee").value
//         );

//         const threshold = Number(
//             document.getElementById("new-card-threshold").value
//         );

//         if (!name || !issuer ||
//             !Number.isFinite(fee) || fee < 0 ||
//             !Number.isFinite(threshold) || threshold < 0) {
//             showToast("Please enter valid card details.");
//             return;
//         }

//         cards.push({
//             id: Date.now(),
//             name,
//             issuer,
//             last4,
//             annualFee: fee,
//             feeWaiverThreshold: threshold,
//             rewardRates: {
//                 Shopping: 0.01,
//                 Food: 0.01,
//                 Travel: 0.01,
//                 Bills: 0.01,
//                 Others: 0.01
//             },
//             rewardCap: 500,
//             dueDate: "Not configured",
//             theme: "other"
//         });

//         renderCards();
//         renderDashboard();
//         renderFeeWaiver();
//         updateCardDropdown();

//         closeModal("card-modal");
//         this.reset();

//         showToast("New credit card added!");
//     });

// // ============================================
// // NAVIGATION
// // ============================================

// const pageInfo = {
//     dashboard: {
//         title: "Good evening, Parita 👋",
//         subtitle: "Here's what's happening with your credit cards."
//     },
//     cards: {
//         title: "My Cards",
//         subtitle: "Your complete credit card portfolio."
//     },
//     transactions: {
//         title: "Transactions",
//         subtitle: "Track and manage your card expenses."
//     },
//     rewards: {
//         title: "Rewards & Benefits",
//         subtitle: "Make the most of every card benefit."
//     },
//     smart: {
//         title: "Smart Card Selector",
//         subtitle: "Find the best card for your next purchase."
//     }
// };

// function navigateToPage(page) {

//     document.querySelectorAll(".page").forEach(section => {
//         section.classList.remove("active-page");
//     });

//     document.querySelectorAll(".nav-link").forEach(link => {
//         link.classList.remove("active");
//     });

//     const target = document.getElementById(`${page}-page`);

//     if (!target || !pageInfo[page]) return;

//     target.classList.add("active-page");

//     const activeLink = document.querySelector(
//         `.nav-link[data-page="${page}"]`
//     );

//     if (activeLink) activeLink.classList.add("active");

//     document.getElementById("page-title").textContent =
//         pageInfo[page].title;

//     document.getElementById("page-subtitle").textContent =
//         pageInfo[page].subtitle;

//     document.getElementById("breadcrumb-page").textContent =
//         pageInfo[page].title.replace(" 👋", "");

//     if (page === "cards") renderCards();
//     if (page === "transactions") renderAllTransactions();
//     if (page === "rewards") renderFeeWaiver();
// }

// document.querySelectorAll(".nav-link").forEach(link => {

//     link.addEventListener("click", event => {
//         event.preventDefault();
//         navigateToPage(link.dataset.page);
//     });

// });

// document.querySelectorAll("[data-go]").forEach(button => {

//     button.addEventListener("click", () => {
//         navigateToPage(button.dataset.go);
//     });

// });

// // ============================================
// // BUTTON EVENT LISTENERS
// // ============================================

// document.getElementById("add-transaction-btn")
//     .addEventListener("click", () => openModal("transaction-modal"));

// document.getElementById("transactions-add-btn")
//     .addEventListener("click", () => openModal("transaction-modal"));

// document.getElementById("add-card-btn")
//     .addEventListener("click", () => openModal("card-modal"));

// document.getElementById("compare-btn")
//     .addEventListener("click", compareCards);

// document.getElementById("transaction-search")
//     .addEventListener("input", renderAllTransactions);

// document.getElementById("category-filter")
//     .addEventListener("change", renderAllTransactions);

// document.querySelectorAll("[data-close]").forEach(button => {

//     button.addEventListener("click", () => {
//         closeModal(button.dataset.close);
//     });

// });

// document.querySelectorAll(".modal-overlay").forEach(overlay => {

//     overlay.addEventListener("click", event => {
//         if (event.target === overlay) {
//             overlay.classList.remove("show");
//         }
//     });

// });

// // ============================================
// // APPLICATION INITIALIZATION
// // ============================================

// document.getElementById("date-input").value =
//     new Date().toISOString().slice(0, 10);

// updateCardDropdown();

// renderDashboard();
// renderCards();
// renderAllTransactions();
// renderFeeWaiver();

// console.log("CardPilot initialized successfully.");

// ============================================
// CARDPILOT - APPLICATION DATA
// Demo reward rates are configurable examples,
// NOT verified bank reward terms.
// ============================================

let cards = [];
let transactions = [];

const bills = [
    {
        name: "HDFC Millennia",
        amount: 3500,
        date: "15 Nov 2026"
    },
    {
        name: "SBI Cashback",
        amount: 2800,
        date: "18 Nov 2026"
    },
    {
        name: "ICICI Amazon Pay",
        amount: 2200,
        date: "22 Nov 2026"
    }
];

// ============================================
// BACKEND API INTEGRATION
// The backend is the single source of truth for cards and transactions.
// ============================================

async function loadAppData() {
    try {
        const [cardsResponse, transactionsResponse] = await Promise.all([
            fetch("/api/cards"),
            fetch("/api/transactions")
        ]);

        if (!cardsResponse.ok || !transactionsResponse.ok) {
            throw new Error("Could not load CardPilot data from the server.");
        }

        const serverCards = await cardsResponse.json();
        const serverTransactions = await transactionsResponse.json();

        // Adapt backend field names and percentage rates to the UI's existing format.
        cards = serverCards.map(card => ({
            ...card,
            issuer: card.issuer || card.bank || "Card issuer",
            feeWaiverThreshold: Number(card.feeWaiverThreshold ?? card.waiverThreshold ?? 0),
            rewardCap: Number(card.rewardCap ?? card.monthlyRewardCap ?? 500),
            rewardRates: Object.fromEntries(
                Object.entries(card.rewardRates || {}).map(([category, rate]) => [
                    category,
                    Number(rate) > 1 ? Number(rate) / 100 : Number(rate)
                ])
            ),
            theme: card.theme || (
                /hdfc/i.test(card.bank || card.issuer || "") ? "hdfc" :
                /sbi/i.test(card.bank || card.issuer || "") ? "sbi" :
                /icici/i.test(card.bank || card.issuer || "") ? "icici" : "other"
            )
        }));

        transactions = serverTransactions.map(transaction => ({
            ...transaction,
            amount: Number(transaction.amount),
            cardId: Number(transaction.cardId)
        }));

        updateCardDropdown();
        renderDashboard();
        renderCards();
        renderAllTransactions();
        renderFeeWaiver();

        console.log("CardPilot data loaded from backend.");

    } catch (error) {
        console.error("CardPilot data loading failed:", error);
        showToast("Unable to load data. Check that the CardPilot server is running.");
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatCurrency = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });

const getCard = (id) =>
    cards.find(card => card.id === Number(id));

const getCardName = (id) =>
    getCard(id)?.name || "Unknown Card";

const getIcon = (category) => {
    const icons = {
        Shopping: "🛍",
        Food: "🍽",
        Travel: "✈",
        Bills: "⚡",
        Others: "💳"
    };

    return icons[category] || "💳";
};

const escapeHTML = (value) => {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
};

// ============================================
// REWARD CALCULATION
// ============================================

function calculateReward(transaction) {
    const card = getCard(transaction.cardId);

    if (!card) return 0;

    const rate = card.rewardRates[transaction.category] || 0;

    return Math.min(
        transaction.amount * rate,
        card.rewardCap
    );
}

function getTotalSpending() {
    return transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
    );
}

function getTotalRewards() {
    return transactions.reduce(
        (total, transaction) => total + calculateReward(transaction),
        0
    );
}

function getCardSpending(cardId) {
    return transactions
        .filter(t => t.cardId === cardId)
        .reduce((sum, t) => sum + t.amount, 0);
}

// ============================================
// DASHBOARD RENDERING
// ============================================

function renderDashboard() {

    const totalSpending = getTotalSpending();
    const totalRewards = getTotalRewards();

    document.getElementById("total-spending").textContent =
        formatCurrency(totalSpending);

    document.getElementById("total-rewards").textContent =
        formatCurrency(totalRewards);

    document.getElementById("reward-highlight").textContent =
        formatCurrency(totalRewards);

    document.getElementById("chart-total").textContent =
        formatCurrency(totalSpending) + " total";

    document.getElementById("total-cards").textContent =
        String(cards.length).padStart(2, "0");

    const upcomingTotal = bills.reduce(
        (sum, bill) => sum + bill.amount,
        0
    );

    document.getElementById("upcoming-payments").textContent =
        formatCurrency(upcomingTotal);

    renderRecentTransactions();
    renderBills();
    renderSpendingChart();
}

function renderRecentTransactions() {

    const tbody = document.getElementById("recent-transactions");

    const recent = [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5);

    if (!recent.length) {
        tbody.innerHTML =
            `<tr><td colspan="4" class="empty-row">
                No transactions yet.
            </td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(t => `
        <tr>
            <td>
                <div class="merchant-cell">
                    <div class="merchant-icon">
                        ${getIcon(t.category)}
                    </div>
                    <div>
                        <span class="merchant-name">
                            ${escapeHTML(t.merchant)}
                        </span>
                        <span class="merchant-sub">
                            ${t.date}
                        </span>
                    </div>
                </div>
            </td>
            <td>
                <span class="category-tag">
                    ${escapeHTML(t.category)}
                </span>
            </td>
            <td>${escapeHTML(getCardName(t.cardId))}</td>
            <td>${formatCurrency(t.amount)}</td>
        </tr>
    `).join("");
}

function renderBills() {

    const container = document.getElementById("bill-list");

    container.innerHTML = bills.map(bill => `
        <div class="bill-item">
            <div>
                <div class="bill-name">
                    ${escapeHTML(bill.name)}
                </div>
                <div class="bill-date">
                    Due ${escapeHTML(bill.date)}
                </div>
            </div>
            <div>
                <div class="bill-amount">
                    ${formatCurrency(bill.amount)}
                </div>
                <div class="bill-status">Upcoming</div>
            </div>
        </div>
    `).join("");
}

// ============================================
// SPENDING CHART
// ============================================

function renderSpendingChart() {

    const categories = [
        "Shopping",
        "Food",
        "Travel",
        "Bills",
        "Others"
    ];

    const totals = categories.map(category =>
        transactions
            .filter(t => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const max = Math.max(...totals, 1);

    const chart = document.getElementById("spending-chart");

    chart.innerHTML = categories.map((category, index) => {

        const height = Math.max(
            4,
            (totals[index] / max) * 90
        );

        return `
            <div class="bar-group">
                <div class="bar"
                     style="height:${height}%"
                     title="${formatCurrency(totals[index])}">
                </div>
                <span>${category}</span>
            </div>
        `;
    }).join("");
}

// ============================================
// CREDIT CARD PAGE
// ============================================

function renderCards() {

    const container = document.getElementById("cards-grid");

    container.innerHTML = cards.map(card => `
        <div class="credit-card-item">

            <div class="credit-card-visual ${escapeHTML(card.theme)}">
                <div class="card-issuer">
                    <span>${escapeHTML(card.issuer)}</span>
                    <span>VISA</span>
                </div>

                <div class="card-chip">▦</div>

                <div class="card-last4">
                    •••• &nbsp; •••• &nbsp; •••• &nbsp;
                    ${escapeHTML(card.last4 || "0000")}
                </div>

                <div class="card-owner">
                    PARITA MENDAPARA
                </div>
            </div>

            <div class="card-detail-title">
                ${escapeHTML(card.name)}
                <span>● Active</span>
            </div>

            <div class="card-info-grid">
                <div>
                    <small>Annual fee</small>
                    <strong>${formatCurrency(card.annualFee)}</strong>
                </div>

                <div>
                    <small>Fee waiver target</small>
                    <strong>
                        ${formatCurrency(card.feeWaiverThreshold)}
                    </strong>
                </div>

                <div>
                    <small>Total spending</small>
                    <strong>
                        ${formatCurrency(getCardSpending(card.id))}
                    </strong>
                </div>

                <div>
                    <small>Reward cap (demo)</small>
                    <strong>${formatCurrency(card.rewardCap)}</strong>
                </div>
            </div>
        </div>
    `).join("");
}

// ============================================
// TRANSACTIONS PAGE
// ============================================

function renderAllTransactions() {

    const tbody = document.getElementById("all-transactions");

    const search = document
        .getElementById("transaction-search")
        .value.toLowerCase();

    const category = document
        .getElementById("category-filter")
        .value;

    const filtered = [...transactions]
        .filter(t =>
            t.merchant.toLowerCase().includes(search) ||
            t.category.toLowerCase().includes(search)
        )
        .filter(t =>
            category === "all" || t.category === category
        )
        .sort((a, b) => b.date.localeCompare(a.date));

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">
                    No matching transactions found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td>
                <div class="merchant-cell">
                    <div class="merchant-icon">
                        ${getIcon(t.category)}
                    </div>
                    <span class="merchant-name">
                        ${escapeHTML(t.merchant)}
                    </span>
                </div>
            </td>
            <td>
                <span class="category-tag">
                    ${escapeHTML(t.category)}
                </span>
            </td>
            <td>${escapeHTML(getCardName(t.cardId))}</td>
            <td>${t.date}</td>
            <td>${formatCurrency(t.amount)}</td>
        </tr>
    `).join("");
}

// ============================================
// REWARDS & FEE WAIVER PAGE
// ============================================

function renderFeeWaiver() {

    const container = document.getElementById("fee-waiver-list");

    container.innerHTML = cards.map(card => {

        const spent = getCardSpending(card.id);
        const threshold = card.feeWaiverThreshold;

        const percentage = threshold > 0
            ? Math.min((spent / threshold) * 100, 100)
            : 100;

        return `
            <div class="fee-item">
                <div class="fee-title">
                    <strong>${escapeHTML(card.name)}</strong>
                    <span>
                        ${threshold > 0
                            ? formatCurrency(spent) + " / " +
                              formatCurrency(threshold)
                            : "No waiver target configured"}
                    </span>
                </div>

                <div class="progress-track">
                    <div class="progress-fill"
                         style="width:${percentage}%">
                    </div>
                </div>

                <small style="color:#888;font-size:9px;">
                    ${threshold > 0
                        ? formatCurrency(Math.max(threshold - spent, 0)) +
                          " remaining"
                        : "No annual fee waiver target"}
                </small>
            </div>
        `;
    }).join("");
}

// ============================================
// SMART CARD SELECTOR
// ============================================

function compareCards() {

    const amount = Number(
        document.getElementById("purchase-amount").value
    );

    const category = document.getElementById(
        "purchase-category"
    ).value;

    const result = document.getElementById("comparison-results");

    if (!Number.isFinite(amount) || amount <= 0) {
        showToast("Please enter a valid purchase amount.");
        return;
    }

    const comparisons = cards.map(card => {

        const rate = card.rewardRates[category] || 0;

        const reward = Math.min(
            amount * rate,
            card.rewardCap
        );

        return {
            card,
            reward
        };
    }).sort((a, b) => b.reward - a.reward);

    if (!comparisons.length) {
        result.innerHTML = "<p>No cards available.</p>";
        return;
    }

    result.innerHTML = comparisons.map((item, index) => `
        <div class="comparison-result ${index === 0 ? "best" : ""}">
            <h4>
                ${index === 0 ? "✦ Best estimated option: " : ""}
                ${escapeHTML(item.card.name)}
            </h4>

            <p>
                Estimated reward:
                <strong>${formatCurrency(item.reward)}</strong>
                · Configured reward rate:
                ${(item.card.rewardRates[category] * 100).toFixed(1)}%
            </p>
        </div>
    `).join("");
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function updateCardDropdown() {

    const select = document.getElementById("card-input");

    select.innerHTML = cards.map(card => `
        <option value="${card.id}">
            ${escapeHTML(card.name)}
        </option>
    `).join("");
}

// ============================================
// ADD TRANSACTION
// ============================================

document.getElementById("transaction-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const merchant = document
            .getElementById("merchant-input").value.trim();

        const amount = Number(
            document.getElementById("amount-input").value
        );

        const category = document
            .getElementById("category-input").value;

        const cardId = Number(
            document.getElementById("card-input").value
        );

        const date = document
            .getElementById("date-input").value;

        if (!merchant || !Number.isFinite(amount) ||
            amount <= 0 || !getCard(cardId) || !date) {
            showToast("Please enter valid transaction details.");
            return;
        }

        try {
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ merchant, amount, category, cardId, date })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not add transaction.");
            }

            await loadAppData();
            closeModal("transaction-modal");
            this.reset();

            document.getElementById("date-input").value =
                new Date().toISOString().slice(0, 10);

            showToast("Transaction added successfully!");

        } catch (error) {
            console.error(error);
            showToast(error.message || "Unable to add transaction.");
        }
    });

// ============================================
// ADD CREDIT CARD
// ============================================

document.getElementById("card-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document
            .getElementById("new-card-name").value.trim();

        const issuer = document
            .getElementById("new-card-issuer").value.trim();

        const last4 = document
            .getElementById("new-card-last4").value.trim();

        const fee = Number(
            document.getElementById("new-card-fee").value
        );

        const threshold = Number(
            document.getElementById("new-card-threshold").value
        );

        if (!name || !issuer || !/^\d{4}$/.test(last4) ||
            !Number.isFinite(fee) || fee < 0 ||
            !Number.isFinite(threshold) || threshold < 0) {
            showToast("Enter valid card details and exactly four digits.");
            return;
        }

        try {
            const response = await fetch("/api/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    bank: issuer,
                    last4,
                    annualFee: fee,
                    waiverThreshold: threshold
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not add card.");
            }

            await loadAppData();
            closeModal("card-modal");
            this.reset();
            showToast("New credit card added!");

        } catch (error) {
            console.error(error);
            showToast(error.message || "Unable to add credit card.");
        }
    });

// ============================================
// NAVIGATION
// ============================================

const pageInfo = {
    dashboard: {
        title: "Good evening, Parita 👋",
        subtitle: "Here's what's happening with your credit cards."
    },
    cards: {
        title: "My Cards",
        subtitle: "Your complete credit card portfolio."
    },
    transactions: {
        title: "Transactions",
        subtitle: "Track and manage your card expenses."
    },
    rewards: {
        title: "Rewards & Benefits",
        subtitle: "Make the most of every card benefit."
    },
    smart: {
        title: "Smart Card Selector",
        subtitle: "Find the best card for your next purchase."
    }
};

function navigateToPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active-page");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    const target = document.getElementById(`${page}-page`);

    if (!target || !pageInfo[page]) return;

    target.classList.add("active-page");

    const activeLink = document.querySelector(
        `.nav-link[data-page="${page}"]`
    );

    if (activeLink) activeLink.classList.add("active");

    document.getElementById("page-title").textContent =
        pageInfo[page].title;

    document.getElementById("page-subtitle").textContent =
        pageInfo[page].subtitle;

    document.getElementById("breadcrumb-page").textContent =
        pageInfo[page].title.replace(" 👋", "");

    if (page === "cards") renderCards();
    if (page === "transactions") renderAllTransactions();
    if (page === "rewards") renderFeeWaiver();
}

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", event => {
        event.preventDefault();
        navigateToPage(link.dataset.page);
    });

});

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {
        navigateToPage(button.dataset.go);
    });

});

// ============================================
// BUTTON EVENT LISTENERS
// ============================================

document.getElementById("add-transaction-btn")
    .addEventListener("click", () => openModal("transaction-modal"));

document.getElementById("transactions-add-btn")
    .addEventListener("click", () => openModal("transaction-modal"));

document.getElementById("add-card-btn")
    .addEventListener("click", () => openModal("card-modal"));

document.getElementById("compare-btn")
    .addEventListener("click", compareCards);

document.getElementById("transaction-search")
    .addEventListener("input", renderAllTransactions);

document.getElementById("category-filter")
    .addEventListener("change", renderAllTransactions);

document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });

});

document.querySelectorAll(".modal-overlay").forEach(overlay => {

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            overlay.classList.remove("show");
        }
    });

});

// ============================================
// APPLICATION INITIALIZATION
// ============================================

document.getElementById("date-input").value =
    new Date().toISOString().slice(0, 10);

loadAppData();

console.log("CardPilot initialized. Loading data from backend...");
