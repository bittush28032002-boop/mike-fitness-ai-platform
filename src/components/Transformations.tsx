import React from 'react';
import { motion } from 'motion/react';

const Transformations = () => {
  const transformations = [
    {
      id: 1,
      name: "Mark R.",
      before: "https://picsum.photos/seed/before1/600/800",
      after: "https://picsum.photos/seed/after1/600/800",
      result: "Lost 15kg in 12 Weeks",
      focus: "Fat Loss"
    },
    {
      id: 2,
      name: "Sarah L.",
      before: "https://picsum.photos/seed/before2/600/800",
      after: "https://picsum.photos/seed/after2/600/800",
      result: "Professional Peak Form",
      focus: "Muscle Definition"
    },
    {
      id: 3,
      name: "John K.",
      before: "https://picsum.photos/seed/before3/600/800",
      after: "https://picsum.photos/seed/after3/600/800",
      result: "Gained 8kg Lean Muscle",
      focus: "Hypertrophy"
    }
  ];

  return (
    <section className="py-24 bg-luxury-gray" id="transformations">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">
              Proven Results
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter uppercase italic">
              Real Impact, <br />
              <span className="text-white">Real Stories</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-white/50 font-medium italic">
              "Transformation isn't just about the body; it's about the discipline required to change your entire life."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {transformations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-black border border-white/5 group-hover:border-neon/30 transition-all duration-500">
                <div className="grid grid-cols-2 h-full gap-px">
                  <div className="relative group/before overflow-hidden">
                    <img src={item.before} alt="Before" className="w-full h-full object-cover grayscale brightness-50 contrast-125" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] font-black uppercase text-white tracking-widest">
                      Before
                    </div>
                  </div>
                  <div className="relative group/after overflow-hidden">
                    <img src={item.after} alt="After" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 bg-neon px-2 py-1 text-[8px] font-black uppercase text-black tracking-widest">
                      After
                    </div>
                  </div>
                </div>
                
                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent pt-20">
                  <h3 className="text-2xl font-display font-black text-white uppercase italic leading-none">
                    {item.name}
                  </h3>
                  <p className="text-neon text-lg font-bold uppercase tracking-tighter mt-2">
                    {item.result}
                  </p>
                  <div className="w-12 h-1 bg-neon mt-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transformations;
