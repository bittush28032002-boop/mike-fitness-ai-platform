import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const posts = [
  {
    id: 1,
    title: "Mastering Hypertrophy: The Science of Growth",
    category: "Fitness",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Fat Loss Nutrition Blueprint",
    category: "Nutrition",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Why Most LA Fitness Trends are Failing You",
    category: "Lifestyle",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
  }
];

const Blog = () => {
  return (
    <section className="py-24 bg-black" id="blog">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">Latest Intelligence</span>
            <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter uppercase italic text-white">
              The Performance <span className="text-neon">Feed</span>
            </h2>
          </div>
          <Button variant="link" className="text-neon uppercase font-black tracking-widest p-0 flex items-center group">
            View All Intel <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Card className="bg-transparent border-none overflow-hidden h-full flex flex-col">
                <div className="aspect-video overflow-hidden luxury-border mb-6">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
                </div>
                <CardContent className="p-0 flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-neon text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-neon/30 rounded-sm">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-black text-white hover:text-neon transition-colors uppercase italic leading-tight mb-4">
                    {post.title}
                  </h3>
                  <div className="hidden group-hover:flex items-center text-neon text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                    Read Intel <ArrowRight className="ml-2 w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
