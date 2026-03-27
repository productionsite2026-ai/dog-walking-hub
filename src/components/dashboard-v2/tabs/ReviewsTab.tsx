import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "../StarRating";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { DEMO_REVIEWS } from "@/data/demoData";

const ReviewsTab = () => {
  const { user } = useAuth();

  const { data: reviews = [] } = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("reviews").select("*, reviewer:reviewer_id(first_name, avatar_url)").eq("reviewed_id", user.id).order("created_at", { ascending: false });
      return (data || []).map((r: any) => ({
        id: r.id, rating: r.rating, comment: r.comment || "",
        reviewerName: r.reviewer?.first_name || "Client",
        reviewerAvatar: r.reviewer?.avatar_url,
        date: new Date(r.created_at).toLocaleDateString("fr-FR"),
      }));
    },
    enabled: !!user,
  });

  const isDemo = !user;
  const list = isDemo ? DEMO_REVIEWS.map(r => ({ ...r, reviewerName: r.reviewerName, reviewerAvatar: r.reviewerAvatar })) : reviews;

  const avgRating = list.length > 0 ? (list.reduce((a: number, r: any) => a + r.rating, 0) / list.length).toFixed(1) : "0.0";

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-[hsl(var(--star))]" />
        <h2 className="text-lg font-black text-foreground">Avis Clients</h2>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-5 flex items-center gap-5">
        <div className="text-center">
          <span className="text-3xl font-black text-foreground">{avgRating}</span>
          <div className="mt-1"><StarRating rating={Math.round(Number(avgRating))} /></div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{list.length} avis</p>
          <p className="text-[10px] text-muted-foreground">Note moyenne sur l'ensemble des missions</p>
        </div>
      </motion.div>

      {/* Reviews List */}
      {list.map((r: any, i: number) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <img src={r.reviewerAvatar || avatarWalker} alt={r.reviewerName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10" loading="lazy" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{r.reviewerName}</span>
                <span className="text-[9px] text-muted-foreground">{r.date}</span>
              </div>
              <StarRating rating={r.rating} />
            </div>
          </div>
          {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
        </motion.div>
      ))}

      {list.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun avis pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
