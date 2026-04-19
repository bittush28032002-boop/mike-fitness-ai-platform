import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  Target, 
  CreditCard, 
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TRAINING_PLANS } from '@/constants';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { toast } from 'sonner';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, 'list', 'leads');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status: newStatus });
      toast.success(`Lead status: ${newStatus}`);
    } catch (error: any) {
      handleFirestoreError(error, 'update', `leads/${id}`);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
      toast.success("Lead Removed");
    } catch (error: any) {
      handleFirestoreError(error, 'delete', `leads/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-neon text-[10px] uppercase tracking-[0.4em] font-bold">Internal Mastery</span>
          <h1 className="text-5xl font-display font-black uppercase italic italic text-white leading-none mt-2">Empire Command</h1>
        </div>
        <div className="flex bg-luxury-gray p-1 luxury-border rounded-lg">
          <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest px-6 h-10 hover:bg-white/5">Export Data</Button>
          <Button className="bg-neon text-black text-[10px] font-bold uppercase tracking-widest px-6 h-10 hover:bg-white transition-all">Add Goal</Button>
        </div>
      </header>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="bg-black border-b border-white/5 w-full justify-start rounded-none h-auto p-0 mb-8 gap-8">
          {[
            { id: 'leads', icon: Target, label: 'Incoming Leads' },
            { id: 'users', icon: Users, label: 'Active Members' },
            { id: 'plans', icon: Package, label: 'Training Protocols' },
            { id: 'payments', icon: CreditCard, label: 'Financials' },
          ].map((item) => (
            <TabsTrigger 
              key={item.id} 
              value={item.id}
              className="px-0 py-4 bg-transparent border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:bg-transparent data-[state=active]:text-neon rounded-none text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="leads">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input placeholder="Search Leads by Name, Email or Goal..." className="bg-luxury-gray border-white/5 h-14 pl-12 text-sm text-white placeholder:text-white/20 focus:border-neon focus:ring-0" />
            </div>

            <div className="bg-luxury-gray luxury-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-white/40 italic">Lead Details</th>
                      <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-white/40 italic">Desired Protocol</th>
                      <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-white/40 italic">Status</th>
                      <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-white/40 italic">Received</th>
                      <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-white/40 italic">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">Scanning Frequency...</td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No incoming signals detected.</td></tr>
                    ) : leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white uppercase italic">{lead.name}</span>
                            <span className="text-[10px] text-white/30 lowercase mt-1 tracking-tight">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-neon border border-neon/30 px-2 py-1 rounded-sm">
                            {lead.goal}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'converted' ? 'bg-green-500' : lead.status === 'contacted' ? 'bg-blue-500' : 'bg-neon animate-pulse'}`} />
                             <span className="text-[10px] font-bold uppercase text-white tracking-widest">{lead.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-[10px] font-bold uppercase text-white/30 tracking-widest">
                          {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Pending'}
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2">
                              <Button 
                                onClick={() => updateStatus(lead.id, 'contacted')}
                                variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-neon hover:text-black"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                onClick={() => deleteLead(lead.id)}
                                variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-red-500/20 hover:text-red-500"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/10">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_PLANS.map((plan) => (
              <Card key={plan.id} className="bg-luxury-gray border-white/5 overflow-hidden group">
                <div className="h-2 bg-neon animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-display font-black uppercase italic text-white italic">{plan.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-white/20 hover:text-white">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-4xl font-display font-black text-neon mt-2 italic">${plan.price}</div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40">
                      <span>Features Count</span>
                      <span>{plan.features.length}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                       <div className="bg-neon h-full w-[80%]" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-8 luxury-border text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Edit Protocol
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
