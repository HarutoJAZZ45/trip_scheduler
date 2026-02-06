"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, ShoppingBag, Wallet, Trash2, X, User, ArrowRight, Settings } from "lucide-react";
import { clsx } from "clsx";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// --- Types ---
interface PackingGroup {
    category: string;
    items: { id: string; name: string; checked: boolean }[];
}

interface BudgetItem {
    id: string;
    item: string;
    cost: string;
    paid: boolean;
    amount: number;
}

// --- Walica (Group Expense) Types ---
interface Member {
    id: string;
    name: string;
}

type Currency = 'JPY' | 'EUR';

interface ExpenseItem {
    id: string;
    title: string;
    amount: number;
    currency: Currency;
    paidBy: string; // memberId
    splitWith: string[]; // memberIds
    category: 'food' | 'transport' | 'hotel' | 'shopping' | 'other';
    createdAt: number;
}

// --- Initial Data ---
const INITIAL_PACKING: PackingGroup[] = [
    {
        category: "必需品",
        items: [
            { id: '1', name: "パスポート", checked: false },
            { id: '2', name: "eチケット (Apple Wallet)", checked: false },
            { id: '3', name: "クレジットカード (Wise)", checked: false }
        ]
    },
    {
        category: "ガジェット",
        items: [
            { id: '4', name: "充電器 (Type-C)", checked: false },
            { id: '5', name: "モバイルバッテリー", checked: false },
            { id: '6', name: "AirPods", checked: false },
            { id: '7', name: "変換プラグ (Cタイプ)", checked: false }
        ]
    },
    {
        category: "衣類 (2月/3月)",
        items: [
            { id: '8', name: "薄手のダウン", checked: false },
            { id: '9', name: "歩きやすい靴", checked: false },
            { id: '10', name: "サングラス", checked: false },
            { id: '11', name: "ストール・マフラー", checked: false }
        ]
    },
];

const INITIAL_MEMBERS: Member[] = [
    { id: 'm1', name: '自分' },
    { id: 'm2', name: 'パートナー' }
];

const INITIAL_EXPENSES: ExpenseItem[] = [
    {
        id: 'e1',
        title: '航空券 (TK)',
        amount: 230000,
        currency: 'JPY',
        paidBy: 'm1',
        splitWith: ['m1', 'm2'],
        category: 'transport',
        createdAt: 1709251200000
    },
    {
        id: 'e2',
        title: 'ホテル代 (Deposit)',
        amount: 120000,
        currency: 'JPY',
        paidBy: 'm1',
        splitWith: ['m1', 'm2'],
        category: 'hotel',
        createdAt: 1709337600000
    }
];

export default function PackingPage() {
    const [activeTab, setActiveTab] = useState<"packing" | "budget">("packing");

    // Persistence
    const [packingList, setPackingList] = useLocalStorage<PackingGroup[]>("my-packing-list", INITIAL_PACKING);
    const [members, setMembers] = useLocalStorage<Member[]>("my-trip-members-v2", INITIAL_MEMBERS);
    const [expenses, setExpenses] = useLocalStorage<ExpenseItem[]>("my-trip-expenses-v2", INITIAL_EXPENSES);

    // Packing State
    const [isAddingPacking, setIsAddingPacking] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("Essentials");

    // Budget/Walica State
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<ExpenseItem>>({
        title: "", amount: 0, currency: "JPY", paidBy: "m1", splitWith: []
    });

    // Member State
    const [isManagingMembers, setIsManagingMembers] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");

    // --- Packing Handlers ---
    const toggleCheck = (categoryIdx: number, itemId: string) => {
        const newList = [...packingList];
        const category = newList[categoryIdx];
        const item = category.items.find(i => i.id === itemId);
        if (item) item.checked = !item.checked;
        setPackingList(newList);
    };

    const addPackingItem = () => {
        if (!newItemName) return;
        const newList = [...packingList];
        let categoryIndex = newList.findIndex(g => g.category === newItemCategory);
        if (categoryIndex === -1) categoryIndex = 0;

        newList[categoryIndex].items.push({
            id: Date.now().toString(),
            name: newItemName,
            checked: false
        });

        setPackingList(newList);
        setNewItemName("");
        setIsAddingPacking(false);
    };

    const deletePackingItem = (categoryIdx: number, itemId: string) => {
        const newList = [...packingList];
        newList[categoryIdx].items = newList[categoryIdx].items.filter(i => i.id !== itemId);
        setPackingList(newList);
    };

    // --- Walica Handlers ---
    const addMember = () => {
        if (!newMemberName) return;
        const newMember: Member = { id: `m${Date.now()}`, name: newMemberName };
        setMembers([...members, newMember]);
        setNewMemberName("");
    };

    const deleteMember = (id: string) => {
        if (members.length <= 1) {
            alert("最低1人のメンバーが必要です");
            return;
        }
        if (confirm("メンバーを削除しますか？\n(関連する精算データが不整合になる可能性があります)")) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const addExpense = () => {
        if (!newExpense.title || !newExpense.amount) return;
        const expense: ExpenseItem = {
            id: `e${Date.now()}`,
            title: newExpense.title,
            amount: Number(newExpense.amount),
            currency: newExpense.currency || 'JPY',
            paidBy: newExpense.paidBy || members[0].id,
            splitWith: newExpense.splitWith && newExpense.splitWith.length > 0 ? newExpense.splitWith : members.map(m => m.id),
            category: 'other',
            createdAt: Date.now()
        };
        setExpenses([expense, ...expenses]);
        setIsAddingExpense(false);
        setNewExpense({ title: "", amount: 0, currency: "JPY", paidBy: members[0].id, splitWith: [] });
    };

    const deleteExpense = (id: string) => {
        if (confirm("この項目を削除しますか？")) {
            setExpenses(expenses.filter(e => e.id !== id));
        }
    };


    // --- Calculations ---
    const getBalances = (targetCurrency: Currency) => {
        const stats = members.map(m => ({ ...m, paid: 0, share: 0, balance: 0 }));
        expenses.filter(e => e.currency === targetCurrency).forEach(e => {
            const payer = stats.find(s => s.id === e.paidBy);
            if (payer) payer.paid += e.amount;

            // Split
            const splitCount = e.splitWith.length;
            if (splitCount > 0) {
                const amountPerPerson = e.amount / splitCount;
                e.splitWith.forEach(uid => {
                    const consumer = stats.find(s => s.id === uid);
                    if (consumer) consumer.share += amountPerPerson;
                });
            }
        });
        stats.forEach(s => s.balance = s.paid - s.share);
        return stats;
    };

    const jpyBalances = getBalances('JPY');
    const eurBalances = getBalances('EUR');

    return (
        <div className="min-h-full bg-slate-50 pb-32">
            {/* Tab Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md pt-12 p-6 border-b border-gray-100">
                <h1 className="font-serif text-3xl text-gray-900 mb-6">Preparation</h1>
                <div className="flex p-1 bg-gray-100 rounded-xl relative">
                    <motion.div
                        className="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm"
                        initial={false}
                        animate={{ x: activeTab === "packing" ? 0 : "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setActiveTab("packing")}
                        className={clsx("flex-1 py-2 text-sm font-medium z-10 text-center transition-colors", activeTab === "packing" ? "text-gray-900" : "text-gray-500")}
                    >
                        Packing
                    </button>
                    <button
                        onClick={() => setActiveTab("budget")}
                        className={clsx("flex-1 py-2 text-sm font-medium z-10 text-center transition-colors", activeTab === "budget" ? "text-gray-900" : "text-gray-500")}
                    >
                        Expenses
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === "packing" ? (
                        <motion.div
                            key="packing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {packingList.map((group, gIdx) => (
                                <div key={group.category}>
                                    <h3 className="text-xs uppercase tracking-widest text-muted font-bold mb-3 pl-1">{group.category}</h3>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                        {group.items.map((item) => (
                                            <div key={item.id} className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors group justify-between">
                                                <label className="flex items-center flex-1 cursor-pointer">
                                                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-200 rounded-full group-hover:border-primary transition-colors flex-shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            className="peer appearance-none w-full h-full"
                                                            checked={item.checked}
                                                            onChange={() => toggleCheck(gIdx, item.id)}
                                                        />
                                                        <Check size={12} className="text-white opacity-0 peer-checked:opacity-100 absolute pointer-events-none peer-checked:bg-primary rounded-full w-full h-full p-0.5 transition-opacity" />
                                                        <div className="absolute inset-0 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform -z-10" />
                                                    </div>
                                                    <span className={clsx("ml-3 text-gray-700 font-medium transition-all", item.checked && "text-gray-400 line-through")}>{item.name}</span>
                                                </label>
                                                <button
                                                    onClick={() => deletePackingItem(gIdx, item.id)}
                                                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsAddingPacking(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> アイテムを追加
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="budget"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Settlement Summary */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 opacity-80">
                                        <Wallet size={16} />
                                        <span className="text-xs tracking-wider uppercase">Balances</span>
                                    </div>
                                    <button onClick={() => setIsManagingMembers(true)} className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition">
                                        <Settings size={14} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {/* JPY */}
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                        <span className="text-xs font-bold text-white/60 w-12">JPY</span>
                                        <div className="flex-1 text-right text-sm">
                                            {jpyBalances.filter(b => b.balance > 0).map(b => (
                                                <div key={b.id} className="text-emerald-400">
                                                    {b.name} gets <span className="font-mono">{Math.round(b.balance).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {jpyBalances.filter(b => b.balance < 0).map(b => (
                                                <div key={b.id} className="text-orange-400">
                                                    {b.name} pays <span className="font-mono">{Math.abs(Math.round(b.balance)).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {jpyBalances.every(b => b.balance === 0) && <span className="text-white/40">Settled</span>}
                                        </div>
                                    </div>

                                    {/* EUR */}
                                    {expenses.some(e => e.currency === 'EUR') && (
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                            <span className="text-xs font-bold text-white/60 w-12">EUR</span>
                                            <div className="flex-1 text-right text-sm">
                                                {eurBalances.filter(b => b.balance > 0).map(b => (
                                                    <div key={b.id} className="text-emerald-400">
                                                        {b.name} gets <span className="font-mono">€{b.balance.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                {eurBalances.filter(b => b.balance < 0).map(b => (
                                                    <div key={b.id} className="text-orange-400">
                                                        {b.name} pays <span className="font-mono">€{Math.abs(b.balance).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expenses List */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <h3 className="text-xs uppercase tracking-wider text-muted font-bold">History</h3>
                                </div>
                                {expenses.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
                                        <button
                                            onClick={() => deleteExpense(item.id)}
                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-900">{item.title}</span>
                                            <span className="font-mono text-gray-900 font-bold">
                                                {item.currency === 'JPY' ? '¥' : '€'}
                                                {item.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                                <User size={10} />
                                                <span>{members.find(m => m.id === item.paidBy)?.name || 'Unknown'}</span>
                                            </div>
                                            <span className="text-gray-300">paid for</span>
                                            <span>
                                                {item.splitWith.length === members.length ? 'Everyone' : `${item.splitWith.length} people`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsAddingExpense(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> 支出を追加
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Packing Add Modal */}
            <AnimatePresence>
                {isAddingPacking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-xl">アイテム追加</h2>
                                <button onClick={() => setIsAddingPacking(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">名前</label>
                                    <input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="例: 歯ブラシ"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">カテゴリー</label>
                                    <select
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {packingList.map(g => (
                                            <option key={g.category} value={g.category}>{g.category}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={addPackingItem}
                                    className="w-full py-4 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                >
                                    追加
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Expense Add Modal */}
            <AnimatePresence>
                {isAddingExpense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-xl">記録を追加</h2>
                                <button onClick={() => setIsAddingExpense(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">内容</label>
                                    <input
                                        value={newExpense.title}
                                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                                        placeholder="例: ランチ"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">金額</label>
                                        <input
                                            type="number"
                                            value={newExpense.amount || ''}
                                            onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">通貨</label>
                                        <select
                                            value={newExpense.currency}
                                            onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value as Currency })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="JPY">JPY</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">支払った人</label>
                                        <select
                                            value={newExpense.paidBy}
                                            onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            {members.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={addExpense}
                                    className="w-full py-4 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                >
                                    登録
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Member Management Modal */}
            <AnimatePresence>
                {isManagingMembers && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-xl">メンバー設定</h2>
                                <button onClick={() => setIsManagingMembers(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    {members.map(m => (
                                        <div key={m.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium">{m.name}</span>
                                            {members.length > 1 && (
                                                <button onClick={() => deleteMember(m.id)} className="text-gray-400 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <input
                                        value={newMemberName}
                                        onChange={(e) => setNewMemberName(e.target.value)}
                                        placeholder="新しい名前"
                                        className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100"
                                    />
                                    <button
                                        onClick={addMember}
                                        disabled={!newMemberName}
                                        className="px-4 bg-gray-900 text-white rounded-xl disabled:opacity-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
