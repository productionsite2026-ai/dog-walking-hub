import { Euro, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useEarnings } from "@/hooks/useEarnings";
import { mockEarnings } from "@/data/demoData";

const EarningsTab = () => {
  const { user } = useAuth();
  const { data: realEarnings } = useEarnings();
  const isDemo = !user;
  const earnings = isDemo ? mockEarnings : (realEarnings || { today: 0, week: 0, month: 0, trend: 0 });

  const stats = [
    { label: "Aujourd'hui", value: earnings.today, icon: Euro, color: "text-primary", bg: "bg-primary/10" },
    { label: "Cette semaine", value: earnings.week, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Ce mois", value: earnings.month, icon: Calendar, color: "text-[hsl(var(--passion))]", bg: "bg-[hsl(var(--passion))]/10" },
  ];

  const demoTransactions = [
    { id: "1", dogName: "Max", date: "24 mars", amount: 18, type: "credit" },
    { id: "2", dogName: "Bella", date: "23 mars", amount: 15, type: "credit" },
    { id: "3", dogName: "Commission", date: "22 mars", amount: -3.3, type: "debit" },
    { id: "4", dogName: "Rex", date: "21 mars", amount: 20, type: "credit" },
    { id: "5", dogName: "Charlie", date: "20 mars", amount: 22, type: "credit" },
  ];

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Euro className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">Mes Revenus</h2>
      </div>

      {/* Total + Trend */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-5 text-white">
        <p className="text-xs font-semibold opacity-80">Revenu total ce mois</p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-3xl font-black">{earnings.month}€</span>
          <span className="flex items-center gap-0.5 text-xs font-bold opacity-90 mb-1">
            <TrendingUp className="w-3 h-3" /> +{earnings.trend}%
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl shadow-card p-3 flex flex-col items-center gap-1">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <span className="text-lg font-black text-foreground">{s.value}€</span>
            <span className="text-[9px] text-muted-foreground font-semibold text-center">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Transactions */}
      <h3 className="font-bold text-foreground text-sm mt-2">Dernières transactions</h3>
      <div className="space-y-2">
        {demoTransactions.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card rounded-xl shadow-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === "credit" ? "bg-primary/10" : "bg-destructive/10"}`}>
                {t.type === "credit" ? <ArrowUpRight className="w-4 h-4 text-primary" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t.dogName}</p>
                <p className="text-[10px] text-muted-foreground">{t.date}</p>
              </div>
            </div>
            <span className={`font-bold text-sm ${t.type === "credit" ? "text-primary" : "text-destructive"}`}>
              {t.type === "credit" ? "+" : ""}{t.amount}€
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTab;
