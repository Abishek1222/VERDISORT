import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TreePine, Trash2, Recycle } from 'lucide-react';

const mockDistributionData = [
  { name: 'Biodegradable', value: 45 },
  { name: 'Non-biodegradable', value: 30 },
  { name: 'Metal & Glass', value: 25 },
];

const mockTrendsData = [
  { day: 'Mon', CO2: 12 },
  { day: 'Tue', CO2: 15 },
  { day: 'Wed', CO2: 18 },
  { day: 'Thu', CO2: 14 },
  { day: 'Fri', CO2: 22 },
  { day: 'Sat', CO2: 25 },
  { day: 'Sun', CO2: 21 },
];

const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];

export default function Dashboard() {
  return (
    <section className="my-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          Sustainability Dashboard
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Real-time impact metrics from automated AI segregation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* KPI Cards */}
        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <TreePine className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">+12%</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">CO₂ Emissions Saved</p>
            <h4 className="text-3xl font-bold text-white tracking-tight">214 <span className="text-lg text-gray-500 font-normal">kg</span></h4>
          </div>
        </div>

        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Trash2 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">-5.4%</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Landfill Reduction</p>
            <h4 className="text-3xl font-bold text-white tracking-tight">1,024 <span className="text-lg text-gray-500 font-normal">lbs</span></h4>
          </div>
        </div>

        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Recycle className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">+8%</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Recyclable Recovery</p>
            <h4 className="text-3xl font-bold text-white tracking-tight">85 <span className="text-lg text-gray-500 font-normal">%</span></h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Waste Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {mockDistributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">CO₂ Savings Trend (kg)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#262626' }}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="CO2" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </section>
  );
}
