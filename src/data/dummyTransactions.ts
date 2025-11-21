import { Transaction } from "@/components/TransactionList";

export const dummyTransactions: Transaction[] = [
    // Today
    {
        id: "1",
        title: "Grocery Shopping",
        description: "Big Bazaar",
        amount: -2500,
        type: "debit",
        date: new Date().toISOString(),
        category: "Shopping",
    },
    {
        id: "2",
        title: "Salary Credited",
        description: "Monthly salary",
        amount: 50000,
        type: "credit",
        date: new Date().toISOString(),
        category: "Income",
    },
    {
        id: "3",
        title: "Coffee",
        description: "Starbucks",
        amount: -350,
        type: "debit",
        date: new Date().toISOString(),
        category: "Food",
    },
    // Yesterday
    {
        id: "4",
        title: "Restaurant",
        description: "Domino's Pizza",
        amount: -850,
        type: "debit",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "Food",
    },
    {
        id: "5",
        title: "Fuel",
        description: "Indian Oil",
        amount: -2000,
        type: "debit",
        date: new Date(Date.now() - 86400000).toISOString(),
        category: "Transport",
    },
    // 2 days ago
    {
        id: "6",
        title: "Amazon Order",
        description: "Electronics",
        amount: -3999,
        type: "debit",
        date: new Date(Date.now() - 172800000).toISOString(),
        category: "Shopping",
    },
    {
        id: "7",
        title: "Netflix",
        description: "Subscription",
        amount: -649,
        type: "debit",
        date: new Date(Date.now() - 172800000).toISOString(),
        category: "Entertainment",
    },
];
