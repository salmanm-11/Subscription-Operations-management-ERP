import React from 'react';
import { Shield, ShieldCheck, UserPlus, Mail, Phone } from 'lucide-react';

export const StaffList: React.FC = () => {
  const staffMembers = [
    { id: '1', name: 'Admin Manager', role: 'Business Owner', email: 'admin@karamamess.ae', phone: '+971 50 123 4567', status: 'Active' },
    { id: '2', name: 'Kitchen Head Chef', role: 'Staff (Kitchen)', email: 'kitchen@karamamess.ae', phone: '+971 50 998 8776', status: 'Active' },
    { id: '3', name: 'Delivery Coordinator', role: 'Staff (Delivery)', email: 'delivery@karamamess.ae', phone: '+971 50 445 5667', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Staff &amp; Permissions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage team access and operational roles for your mess business</p>
        </div>

        <button
          onClick={() => alert('To invite staff, create their Supabase login and assign role under business_members.')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-colors"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          <span>Invite Staff</span>
        </button>
      </div>

      <div className="bg-[#151c2c] border border-[#222f47]/60 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold">Staff Member</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
                <th className="py-3.5 px-4 font-semibold">Contact Email</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {staffMembers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-amber-300 uppercase">
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{s.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{s.phone}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
