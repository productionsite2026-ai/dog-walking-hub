import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useNewBookings";
import { mockBookings } from "@/data/demoData";
import { useState } from "react";

type Filter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: "En attente", icon: AlertCircle, className: "bg-amber-500/12 text-amber-600" },
  confirmed: { label: "Confirmée", icon: CheckCircle, className: "bg-primary/12 text-primary" },
  in_progress: { label: "En cours", icon: Clock, className: "bg-accent/12 text-accent" },
  completed: { label: "Terminée", icon: CheckCircle, className: "bg-primary/12 text-primary" },
  cancelled: { label: "Annulée", icon: XCircle, className: "bg-destructive/12 text-destructive" },
};

const BookingsTab = ({ role }: { role: "owner" | "walker" }) => {
  const { user } = useAuth();
  const { data: realBookings = [] } = useBookings(role);
  const isDemo = !user;
  const bookings = isDemo ? mockBookings : realBookings;
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "En attente" },
    { key: "confirmed", label: "Confirmées" },
    { key: "completed", label: "Terminées" },
    { key: "cancelled", label: "Annulées" },
  ];

  const filtered = filter === "all" ? bookings : bookings.filter((b: any) => b.status === filter);

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">Réservations</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
              filter === f.key ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucune réservation</p>
        </div>
      ) : (
        filtered.map((b: any, i: number) => {
          const st = statusConfig[b.status] || statusConfig.pending;
          const Icon = st.icon;
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl shadow-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground">🐕 {b.dogs?.name || b.dogName || "Chien"}</span>
                    <p className="text-[10px] text-muted-foreground">{b.service_type || b.service || "Promenade"}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${st.className}`}>
                  <Icon className="w-3 h-3" /> {st.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.scheduled_date || b.date}</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.scheduled_time || b.time}</div>
                {(b.price || b.price === 0) && <span className="font-bold text-foreground">{b.price}€</span>}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default BookingsTab;
