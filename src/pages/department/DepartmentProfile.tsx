import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Lock } from 'lucide-react';
import { getDepartmentProfile } from '../../services/departmentTaskService';

export const DepartmentProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getDepartmentProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const department = profileData?.department || {};
  const officer = profileData?.officer || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg font-bold text-xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                {department.code || 'ROAD'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                ACTIVE OFFICER
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">{department.name || 'Municipal Department'}</h1>
            <p className="text-xs text-slate-500 font-medium">Official Municipal Field Operations Profile</p>
          </div>
        </div>

        {/* OFFICER CREDENTIALS */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Assigned Officer Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Officer Name</span>
              <span className="font-bold text-slate-900 text-sm">{officer.name || 'Department Officer'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Officer Email</span>
              <span className="font-bold text-slate-900 text-sm">{officer.email || 'officer@citymind.com'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Role</span>
              <span className="font-bold text-blue-700">DEPARTMENT_OFFICER</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Authenticated Login</span>
              <span className="font-bold text-slate-800">
                {officer.lastLoginAt ? new Date(officer.lastLoginAt).toLocaleString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* DEPARTMENT METADATA */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Department Operations Metadata</span>
          </h2>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Responsibility Description</span>
              <p className="font-medium text-slate-800 mt-0.5">
                {department.description || 'Handles civic complaint resolution and field operations.'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Handled Issue Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {department.categories && department.categories.length > 0 ? (
                  department.categories.map((cat: string, idx: number) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[11px]">
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">All Categories</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Phone</span>
                <span className="font-semibold text-slate-800">{department.contactPhone || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Headquarters Address</span>
                <span className="font-semibold text-slate-800">{department.address || 'Municipal Headquarters'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="font-medium">
            Officer permissions, role, and department assignment are managed exclusively by the Municipal Administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentProfile;
