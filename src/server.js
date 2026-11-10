
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Shared in-memory data: website and Claude will use these same arrays.
const cards = [
  {
    id: 1, name: "HDFC Millennia", bank: "HDFC",
    last4: "4291", annualFee: 1000, waiverThreshold: 100000,
    rewardRates: { Shopping: 5, Food: 1, Travel: 1, Bills: 1, Others: 1 },
    monthlyRewardCap: 500
  },
  {
    id: 2, name: "SBI Cashback", bank: "SBI",
    last4: "7832", annualFee: 999, waiverThreshold: 200000,
    rewardRates: { Shopping: 5, Food: 1, Travel: 1, Bills: 1, Others: 1 },
    monthlyRewardCap: 500
  },
  {
    id: 3, name: "ICICI Amazon Pay", bank: "ICICI",
    last4: "6521", annualFee: 0, waiverThreshold: 0,
    rewardRates: { Shopping: 5, Food: 1, Travel: 1, Bills: 1, Others: 1 },
    monthlyRewardCap: 500
  }
];

const transactions = [
  { id: 1, merchant: "Amazon", amount: 5000, category: "Shopping", cardId: 3, date: "2026-11-02" },
  { id: 2, merchant: "Swiggy", amount: 2000, category: "Food", cardId: 1, date: "2026-11-03" },
  { id: 3, merchant: "Myntra", amount: 4500, category: "Shopping", cardId: 2, date: "2026-11-04" },
  { id: 4, merchant: "BigBasket", amount: 3000, category: "Food", cardId: 1, date: "2026-11-05" },
  { id: 5, merchant: "MakeMyTrip", amount: 8000, category: "Travel", cardId: 2, date: "2026-11-06" },
  { id: 6, merchant: "Netflix", amount: 649, category: "Others", cardId: 3, date: "2026-11-07" },
  { id: 7, merchant: "Electricity Bill", amount: 2800, category: "Bills", cardId: 1, date: "2026-11-08" },
  { id: 8, merchant: "Zomato", amount: 2500, category: "Food", cardId: 2, date: "2026-11-09" }
];

function calculateReward(card, amount, category) {
  const rate = card.rewardRates?.[category] ?? 1;
  return Math.min(amount * rate / 100, card.monthlyRewardCap);
}

function getCardById(id) {
  return cards.find(card => card.id === Number(id));
}

// REST API for the dashboard
app.get("/api/cards", (req, res) => res.json(cards));

app.get("/api/transactions", (req, res) => {
  res.json(transactions.map(tx => ({
    ...tx,
    cardName: getCardById(tx.cardId)?.name ?? "Unknown card"
  })));
});

app.post("/api/cards", (req, res) => {
  const { name, bank, last4, annualFee, waiverThreshold } = req.body;

  if (!name || !bank || !/^\d{4}$/.test(String(last4))) {
    return res.status(400).json({ error: "Provide card name, bank and last four digits." });
  }

  const card = {
    id: Math.max(0, ...cards.map(c => c.id)) + 1,
    name, bank, last4: String(last4),
    annualFee: Number(annualFee) || 0,
    waiverThreshold: Number(waiverThreshold) || 0,
    rewardRates: { Shopping: 1, Food: 1, Travel: 1, Bills: 1, Others: 1 },
    monthlyRewardCap: 500
  };

  cards.push(card);
  res.status(201).json(card);
});

app.post("/api/transactions", (req, res) => {
  const { merchant, amount, category, cardId, date } = req.body;
  const card = getCardById(cardId);

  if (!merchant || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !card) {
    return res.status(400).json({ error: "Provide a merchant, positive amount and valid card." });
  }

  const transaction = {
    id: Math.max(0, ...transactions.map(t => t.id)) + 1,
    merchant,
    amount: Number(amount),
    category: category || "Others",
    cardId: Number(cardId),
    date: date || new Date().toISOString().slice(0, 10)
  };

  transactions.unshift(transaction);
  res.status(201).json(transaction);
});

app.get("/api/rewards", (req, res) => {
  const results = transactions.map(tx => {
    const card = getCardById(tx.cardId);
    return {
      transactionId: tx.id,
      merchant: tx.merchant,
      card: card?.name,
      estimatedReward: card ? calculateReward(card, tx.amount, tx.category) : 0
    };
  });

  res.json({
    estimatedTotal: results.reduce((sum, item) => sum + item.estimatedReward, 0),
    transactions: results,
    note: "Illustrative estimates only. Actual bank reward terms may differ."
  });
});

// MCP tools: Claude can read and modify the same in-memory data.
function createMcpServer() {
  const server = new McpServer({
    name: "cardpilot",
    version: "1.0.0"
  });

  server.registerTool(
    "get_my_cards",
    {
      title: "Get my credit cards",
      description: "Returns all credit cards saved in CardPilot."
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(cards, null, 2) }]
    })
  );

  server.registerTool(
    "get_transactions",
    {
      title: "Get transactions",
      description: "Returns all CardPilot transactions with their card names."
    },
    async () => ({
      content: [{
        type: "text",
        text: JSON.stringify(transactions.map(tx => ({
          ...tx,
          cardName: getCardById(tx.cardId)?.name
        })), null, 2)
      }]
    })
  );

  server.registerTool(
    "add_transaction",
    {
      title: "Add a transaction",
      description: "Adds a transaction to CardPilot. Requires merchant, amount, category and card ID.",
      inputSchema: {
        merchant: z.string().min(1),
        amount: z.number().positive(),
        category: z.enum(["Shopping", "Food", "Travel", "Bills", "Others"]),
        cardId: z.number().int(),
        date: z.string().optional()
      }
    },
    async ({ merchant, amount, category, cardId, date }) => {
      const card = getCardById(cardId);
      if (!card) {
        return {
          isError: true,
          content: [{ type: "text", text: "Card not found. Check the card ID with get_my_cards." }]
        };
      }

      const transaction = {
        id: Math.max(0, ...transactions.map(t => t.id)) + 1,
        merchant, amount, category, cardId,
        date: date || new Date().toISOString().slice(0, 10)
      };

      transactions.unshift(transaction);

      return {
        content: [{
          type: "text",
          text: `Transaction added successfully:\n${JSON.stringify({
            ...transaction,
            cardName: card.name
          }, null, 2)}`
        }]
      };
    }
  );

  server.registerTool(
    "add_credit_card",
    {
      title: "Add a credit card",
      description: "Adds a credit card using its name, bank, last four digits and fee details. Never provide full card numbers, CVVs, PINs or OTPs.",
      inputSchema: {
        name: z.string().min(1),
        bank: z.string().min(1),
        last4: z.string().regex(/^\d{4}$/),
        annualFee: z.number().nonnegative().default(0),
        waiverThreshold: z.number().nonnegative().default(0)
      }
    },
    async ({ name, bank, last4, annualFee, waiverThreshold }) => {
      const card = {
        id: Math.max(0, ...cards.map(c => c.id)) + 1,
        name, bank, last4, annualFee, waiverThreshold,
        rewardRates: { Shopping: 1, Food: 1, Travel: 1, Bills: 1, Others: 1 },
        monthlyRewardCap: 500
      };

      cards.push(card);

      return {
        content: [{
          type: "text",
          text: `Card added successfully:\n${JSON.stringify(card, null, 2)}`
        }]
      };
    }
  );

  server.registerTool(
    "calculate_rewards",
    {
      title: "Calculate estimated rewards",
      description: "Calculates illustrative reward estimates for all recorded transactions."
    },
    async () => {
      const total = transactions.reduce((sum, tx) => {
        const card = getCardById(tx.cardId);
        return sum + (card ? calculateReward(card, tx.amount, tx.category) : 0);
      }, 0);

      return {
        content: [{
          type: "text",
          text: `Estimated rewards: ₹${total.toFixed(2)}. These are illustrative estimates, not verified bank reward calculations.`
        }]
      };
    }
  );

  return server;
}

// Remote MCP endpoint using stateless Streamable HTTP.
app.post("/mcp", async (req, res) => {
  const mcpServer = createMcpServer();

  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on("close", () => {
      transport.close();
      mcpServer.close();
    });
  } catch (error) {
    console.error("MCP error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "MCP request failed" });
    }
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "CardPilot" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CardPilot running at http://localhost:${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
