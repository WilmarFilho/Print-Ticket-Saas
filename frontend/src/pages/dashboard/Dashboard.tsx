import {
    Ticket,
    Printer,
    Users,
    TrendingUp,
    TrendingDown
} from 'lucide-react';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

import styles from './Dashboard.module.css';

// --- MOCK DATA ---
const DATA_TICKETS = [
    { name: 'Seg', tickets: 4 },
    { name: 'Ter', tickets: 7 },
    { name: 'Qua', tickets: 5 },
    { name: 'Qui', tickets: 12 },
    { name: 'Sex', tickets: 9 },
    { name: 'Sáb', tickets: 3 },
    { name: 'Dom', tickets: 2 },
];

const DATA_STATUS = [
    { name: 'Online', value: 45, color: '#22c55e' },
    { name: 'Offline', value: 5, color: '#ef4444' },
    { name: 'Alerta', value: 8, color: '#f59e0b' },
];

export function Dashboard() {
    const userName = 'Gabriel';
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.welcomeText}>
                    Olá, {userName} <span style={{ fontSize: '1.5rem' }}>👋</span>
                </h1>
                <p className={styles.subText}>
                    Aqui está o resumo do seu parque de impressão hoje,&nbsp;
                    <span style={{ textTransform: 'capitalize' }}>{today}</span>.
                </p>
            </header>

            {/* KPIs */}
            <div className={styles.kpiGrid}>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div>
                            <span className={styles.kpiLabel}>Novos Tickets</span>
                            <div className={styles.kpiValue}>12</div>
                        </div>
                        <div
                            className={styles.kpiIcon}
                            style={{ background: '#eff6ff', color: '#3b82f6' }}
                        >
                            <Ticket size={20} />
                        </div>
                    </div>
                    <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
                        <TrendingUp size={14} /> +15% essa semana
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div>
                            <span className={styles.kpiLabel}>Impressoras Online</span>
                            <div className={styles.kpiValue}>
                                45
                                <span style={{ fontSize: '1rem', color: '#94a3b8' }}>
                                    /58
                                </span>
                            </div>
                        </div>
                        <div
                            className={styles.kpiIcon}
                            style={{ background: '#dcfce7', color: '#16a34a' }}
                        >
                            <Printer size={20} />
                        </div>
                    </div>
                    <div className={`${styles.kpiTrend} ${styles.trendNegative}`}>
                        <TrendingDown size={14} /> -2 conexões hoje
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div>
                            <span className={styles.kpiLabel}>Total Clientes</span>
                            <div className={styles.kpiValue}>24</div>
                        </div>
                        <div
                            className={styles.kpiIcon}
                            style={{ background: '#fef3c7', color: '#d97706' }}
                        >
                            <Users size={20} />
                        </div>
                    </div>
                    <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
                        <TrendingUp size={14} /> +2 novos esse mês
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className={styles.chartsGrid}>
                {/* Area Chart */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Volume de Chamados (7 Dias)</h3>
                    <div className={styles.chartWrapper}>
                        {/* SOLUÇÃO: Usamos height={300} fixo para garantir que nunca seja -1, 
                           mas mantemos width="100%" para a responsividade horizontal.
                        */}
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={DATA_TICKETS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="tickets" stroke="#8884d8" strokeWidth={3} fill="url(#colorTickets)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Status do Parque</h3>
                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={DATA_STATUS}
                                    dataKey="value"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {DATA_STATUS.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}