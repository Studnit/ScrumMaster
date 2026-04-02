import { Lead } from './types';

export const INITIAL_DATA: Lead[] = [
  {
    id: 'l-0',
    name: 'Kalyani Raut',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'MPOC/CPOC/HSM Task',
    isAdmin: true,
    resources: [
      { id: 'r-0', name: 'Kalyani Raut', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-1', name: 'Ishita Sakhala', tasks: [], color: 'bg-indigo-950 border-indigo-900 text-white' },
      { id: 'r-2', name: 'Akhila Ravi', tasks: [], color: 'bg-blue-950 border-blue-900 text-white' },
    ]
  },
  {
    id: 'l-2',
    name: 'Pratik Patil',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'FIS Raft ISO, 610 processor, Stargate and Getnet processor',
    isAdmin: true,
    resources: [
      { id: 'r-p1', name: 'Pratik Patil', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-3', name: 'Shivani Saknure', tasks: [], color: 'bg-purple-950 border-purple-900 text-white' },
      { id: 'r-4', name: 'Anusha Kanthed', tasks: [], color: 'bg-emerald-950 border-emerald-900 text-white' },
      { id: 'r-5', name: 'Harshita Bhavanasi', tasks: [], color: 'bg-rose-950 border-rose-900 text-white' },
      { id: 'r-6', name: 'Shubham Gilbile', tasks: [], color: 'bg-amber-950 border-amber-900 text-white' },
    ]
  },
  {
    id: 'l-3',
    name: 'HemantKumar Nikole',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'OTC Processors',
    isAdmin: true,
    resources: [
      { id: 'r-h1', name: 'HemantKumar Nikole', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-11', name: 'Paraj Jain', tasks: [], color: 'bg-cyan-950 border-cyan-900 text-white' },
    ]
  },
  {
    id: 'l-4',
    name: 'Dipak Pawar',
    role: 'Team Lead',
    team: 'Product Manager Team',
    scope: 'Amex and All Gift processor Certifications',
    isAdmin: true,
    resources: [
      { id: 'r-d1', name: 'Dipak Pawar', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-12', name: 'Prathamesh Chitodkar', tasks: [], color: 'bg-teal-950 border-teal-900 text-white' },
    ]
  },
  {
    id: 'l-6',
    name: 'Harshal Chaudhari',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'Chase ISO/UTF/Stratus Processor, BlackHawk Processor, In-Store Wallets, Check Processor and PLCC Processor',
    isAdmin: true,
    resources: [
      { id: 'r-h2', name: 'Harshal Chaudhari', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-13', name: 'Atharva Sharma', tasks: [], color: 'bg-indigo-950 border-indigo-900 text-white' },
      { id: 'r-19', name: 'Vaishnavi Mate', tasks: [], color: 'bg-blue-950 border-blue-900 text-white' },
      { id: 'r-14', name: 'Kartik Macharre', tasks: [], color: 'bg-purple-950 border-purple-900 text-white' },
      { id: 'r-20', name: 'Naga Mani Gatti', tasks: [], color: 'bg-emerald-950 border-emerald-900 text-white' },
      { id: 'r-15', name: 'Swagata Ranagar', tasks: [], color: 'bg-rose-950 border-rose-900 text-white' },
      { id: 'r-21', name: 'Ashrin Shaik', tasks: [], color: 'bg-amber-950 border-amber-900 text-white' },
      { id: 'r-16', name: 'Sumith Venkat Nallabothula', tasks: [], color: 'bg-cyan-950 border-cyan-900 text-white' },
      { id: 'r-22', name: 'Praneetha Chandragiri', tasks: [], color: 'bg-teal-950 border-teal-900 text-white' },
      { id: 'r-17', name: 'Deepti Soni', tasks: [], color: 'bg-fuchsia-950 border-fuchsia-900 text-white' },
      { id: 'r-18', name: 'Lekana Somayajula', tasks: [], color: 'bg-violet-950 border-violet-900 text-white' },
    ]
  },
  {
    id: 'l-7',
    name: 'Gayatri Kelhe',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    isAdmin: true,
    resources: [
      { id: 'r-g1', name: 'Gayatri Kelhe', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-23', name: 'Vaka Yuva Sai Reddy', tasks: [], color: 'bg-indigo-950 border-indigo-900 text-white' },
      { id: 'r-24', name: 'Vishnu Vardhan Lekkala', tasks: [], color: 'bg-blue-950 border-blue-900 text-white' },
      { id: 'r-25', name: 'Mani Teja Chittabattina', tasks: [], color: 'bg-purple-950 border-purple-900 text-white' },
    ]
  },
  {
    id: 'l-8',
    name: 'Amol Datal',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'FD Bypass/Nashville/Ecompass and Elavon processor',
    isAdmin: true,
    resources: [
      { id: 'r-a1', name: 'Amol Datal', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-26', name: 'Pravallika Saladi', tasks: [], color: 'bg-emerald-950 border-emerald-900 text-white' },
      { id: 'r-27', name: 'Devi Sri Lakshmi Gudimetla', tasks: [], color: 'bg-rose-950 border-rose-900 text-white' },
      { id: 'r-28', name: 'Venkata Lakshmi Siva Swetha Edara', tasks: [], color: 'bg-amber-950 border-amber-900 text-white' },
    ]
  },
  {
    id: 'l-9',
    name: 'Prakash Borude',
    role: 'Team Lead',
    team: 'Java Team',
    scope: 'Settlement & File Processing',
    isAdmin: true,
    resources: [
      { id: 'r-p2', name: 'Prakash Borude', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-29', name: 'Nilesh Dhongade', tasks: [{ id: 't-1', name: 'File Processing Logic', date: '2024-03-20', status: 'in progress' }], color: 'bg-indigo-950 border-indigo-900 text-white' },
      { id: 'r-30', name: 'Kalyani Wable', tasks: [{ id: 't-2', name: 'Settlement Reports', date: '2024-03-21', status: 'done' }], color: 'bg-blue-950 border-blue-900 text-white' },
      { id: 'r-31', name: 'Raghav Naulakha', tasks: [{ id: 't-3', name: 'Error Handling', date: '2024-03-22', status: 'stuck' }], color: 'bg-purple-950 border-purple-900 text-white' },
    ]
  },
  {
    id: 'l-13',
    name: 'Krunal Doshi',
    role: 'Team Lead',
    team: 'EMV Team',
    scope: 'Production Issues POC',
    isAdmin: true,
    resources: [
      { id: 'r-k1', name: 'Krunal Doshi', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-40', name: 'Manish Mahajan', tasks: [{ id: 't-4', name: 'Issue Triaging', date: '2024-03-23', status: 'in progress' }], color: 'bg-indigo-950 border-indigo-900 text-white' },
    ]
  },
  {
    id: 'l-14',
    name: 'Rohit Sonawane',
    role: 'Team Lead',
    team: 'EMV Team',
    scope: 'Certification AI Team',
    isAdmin: true,
    resources: [
      { id: 'r-r1', name: 'Rohit Sonawane', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-41', name: 'Mahidhar Karnati', tasks: [{ id: 't-5', name: 'AI Model Training', date: '2024-03-24', status: 'done' }], color: 'bg-blue-950 border-blue-900 text-white' },
      { id: 'r-42', name: 'Karthika Priya Sivapuram', tasks: [{ id: 't-6', name: 'Data Labeling', date: '2024-03-25', status: 'in progress' }], color: 'bg-purple-950 border-purple-900 text-white' },
    ]
  },
  {
    id: 'l-15',
    name: 'Nitesh Kharose',
    role: 'Scrum Master',
    team: 'EMV Team',
    scope: 'Project Management',
    isAdmin: true,
    resources: [
      { id: 'r-n1', name: 'Nitesh Kharose', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
      { id: 'r-43', name: 'Anash Raj', tasks: [], color: 'bg-indigo-950 border-indigo-900 text-white' },
      { id: 'r-44', name: 'Vijayakumar Reddy Ronda', tasks: [], color: 'bg-blue-950 border-blue-900 text-white' },
      { id: 'r-45', name: 'Lokeswari Bellamkonda', tasks: [], color: 'bg-purple-950 border-purple-900 text-white' },
      { id: 'r-46', name: 'Kritika Singh', tasks: [], color: 'bg-emerald-950 border-emerald-900 text-white' },
      { id: 'r-32', name: 'Akash Deshmukh', tasks: [], color: 'bg-rose-950 border-rose-900 text-white' },
      { id: 'r-33', name: 'Arjav Jain', tasks: [], color: 'bg-amber-950 border-amber-900 text-white' },
      { id: 'r-34', name: 'Tushar Pathak', tasks: [], color: 'bg-cyan-950 border-cyan-900 text-white' },
      { id: 'r-35', name: 'Shivam Sonawane', tasks: [], color: 'bg-teal-950 border-teal-900 text-white' },
      { id: 'r-36', name: 'Kunal Shinde', tasks: [], color: 'bg-fuchsia-950 border-fuchsia-900 text-white' },
      { id: 'r-37', name: 'Nityananda Reddy Thalla', tasks: [], color: 'bg-violet-950 border-violet-900 text-white' },
      { id: 'r-38', name: 'Prabhat Kashyap', tasks: [], color: 'bg-sky-950 border-sky-900 text-white' },
      { id: 'r-39', name: 'Shivam Vishwakarma', tasks: [], color: 'bg-slate-950 border-slate-900 text-white' },
    ]
  }
];
