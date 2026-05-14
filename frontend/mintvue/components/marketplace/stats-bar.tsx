"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart2, Users, Layers } from "lucide-react";

const STATS = [
  {
    label: "Total Volume",
    value: "$124.5K",
    icon: BarChart2,
    color: "text-violet-400",
  },
  {
    label: "Listed NFTs",
    value: "847",
    icon: Layers,
    color: "text-fuchsia-400",
  },
  {
    label: "Active Traders",
    value: "2,341",
    icon: Users,
    color: "text-blue-400",
  },
  {
    label: "Floor Price",
    value: "0.01 ETH",
    icon: TrendingUp,
    color: "text-green-400",
  },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4"
        >
          <div className={`rounded-lg bg-white/5 p-2 ${stat.color}`}>
            <stat.icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="text-base font-bold text-white">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
