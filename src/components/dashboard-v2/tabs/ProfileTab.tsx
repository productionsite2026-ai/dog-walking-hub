import { User, Mail, Phone, MapPin, Camera, LogOut, FileText, Settings, Shield, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import avatarWalker from "@/assets/avatar-walker.jpg";
import { mockProfile } from "@/data/demoData";

const ProfileTab = ({ role }: { role: "owner" | "walker" }) => {
  const { user } = useAuth();
  const { data: realProfile } = useProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDemo = !user;
  const profile = isDemo ? mockProfile : realProfile;

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");
  const [bio, setBio] = useState(profile?.bio || "");

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      first_name: firstName, last_name: lastName, phone, city, bio
    }).eq("id", user.id);
    if (error) { toast.error("Erreur de sauvegarde"); return; }
    toast.success("Profil mis à jour !");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: FileText, label: "Mes documents", desc: "CNI, justificatifs", path: role === "walker" ? "/walker/dashboard?tab=documents" : undefined },
    { icon: Bell, label: "Notifications", desc: "Gérer les alertes" },
    { icon: Shield, label: "Sécurité", desc: "Mot de passe, 2FA" },
    { icon: Settings, label: "Paramètres", desc: "Langue, thème" },
  ];

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-5 text-center">
        <div className="relative inline-block mb-3">
          <img src={profile?.avatar_url || avatarWalker} alt="Avatar"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 mx-auto" />
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-card">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <h2 className="text-lg font-black text-foreground">{profile?.first_name || "Utilisateur"} {profile?.last_name || ""}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{profile?.email}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {role === "walker" ? "🏃 Promeneur" : "🐕 Propriétaire"}
        </span>
      </motion.div>

      {/* Edit Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl shadow-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm">Informations</h3>
          <button onClick={() => editing ? handleSave() : setEditing(true)}
            className="text-xs font-bold text-primary">
            {editing ? "Sauvegarder" : "Modifier"}
          </button>
        </div>
        {[
          { icon: User, label: "Prénom", value: firstName, set: setFirstName },
          { icon: User, label: "Nom", value: lastName, set: setLastName },
          { icon: Phone, label: "Téléphone", value: phone, set: setPhone },
          { icon: MapPin, label: "Ville", value: city, set: setCity },
        ].map((field) => (
          <div key={field.label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
              <field.icon className="w-4 h-4 text-primary" />
            </div>
            {editing ? (
              <input value={field.value} onChange={e => field.set(e.target.value)}
                placeholder={field.label}
                className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{field.label}</p>
                <p className="text-sm font-semibold text-foreground">{field.value || "—"}</p>
              </div>
            )}
          </div>
        ))}
        {editing && (
          <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio"
            className="w-full px-3 py-2 rounded-xl bg-muted text-sm text-foreground min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
        )}
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <motion.button key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            onClick={() => item.path && navigate(item.path)}
            className="w-full bg-card rounded-2xl shadow-card p-3.5 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <item.icon className="w-4 h-4 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border border-destructive/20 text-destructive font-bold text-sm flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" /> Se déconnecter
      </motion.button>
    </div>
  );
};

export default ProfileTab;
