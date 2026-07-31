"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/app/lib/data";

export default function CategoryBar() {
  return (
    <section className="border-b border-stone-100 bg-white py-6 sm:pt-20">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide sm:justify-center">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={cat.href}
                className="group flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-3 text-center transition-all hover:bg-grass-50"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-stone-600 group-hover:text-brand-primary whitespace-nowrap">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
