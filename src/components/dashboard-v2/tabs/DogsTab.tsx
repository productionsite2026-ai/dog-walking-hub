import { Plus, Dog, Weight, Ruler, Syringe } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDogs, useAddDog } from "@/hooks/useNewDogs";
import { mockDogs } from "@/data/demoData";
import { useState } from "react";
import { toast } from "sonner";
import dogGolden from "@/assets/dog-golden.jpg";

const DogsTab = () => {
  const { user } = useAuth();
  const { data: realDogs = [] } = useDogs();
  const addDog = useAddDog();
  const isDemo = !user;
  const dogs = isDemo ? mockDogs : realDogs;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const handleAdd = async () => {
    if (!user) return toast.error("Connectez-vous");
    if (!name.trim()) return toast.error("Nom requis");
    await addDog.mutateAsync({ name, breed: breed || null, age: age ? Number(age) : null, weight: weight ? Number(weight) : null });
    toast.success(`${name} ajouté !`);
    setName(""); setBreed(""); setAge(""); setWeight(""); setShowForm(false);
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dog className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-black text-foreground">Mes Chiens</h2>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full gradient-primary text-white text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="bg-card rounded-2xl shadow-card p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom *"
            className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={breed} onChange={e => setBreed(e.target.value)} placeholder="Race"
            className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="grid grid-cols-2 gap-2">
            <input value={age} onChange={e => setAge(e.target.value)} placeholder="Âge (ans)" type="number"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="Poids (kg)" type="number"
              className="w-full px-3 py-2.5 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold">Annuler</button>
            <button onClick={handleAdd} disabled={addDog.isPending}
              className="flex-1 py-2.5 rounded-xl gradient-primary text-white text-sm font-bold disabled:opacity-50">
              {addDog.isPending ? "..." : "Ajouter"}
            </button>
          </div>
        </motion.div>
      )}

      {dogs.length === 0 ? (
        <div className="text-center py-12">
          <Dog className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Ajoutez votre premier chien</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dogs.map((dog: any, i: number) => (
            <motion.div key={dog.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-2xl shadow-card overflow-hidden flex">
              <img src={dog.photo_url || dogGolden} alt={dog.name}
                className="w-24 h-24 object-cover" loading="lazy" />
              <div className="p-3 flex-1">
                <h3 className="font-bold text-foreground">{dog.name}</h3>
                <p className="text-[11px] text-muted-foreground">{dog.breed || "Race inconnue"}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  {dog.age && <span className="flex items-center gap-0.5"><Ruler className="w-3 h-3" /> {dog.age} ans</span>}
                  {dog.weight && <span className="flex items-center gap-0.5"><Weight className="w-3 h-3" /> {dog.weight} kg</span>}
                  {dog.vaccinations_up_to_date && (
                    <span className="flex items-center gap-0.5 text-primary"><Syringe className="w-3 h-3" /> Vacciné</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DogsTab;
