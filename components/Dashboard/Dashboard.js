function Dashboard() {
    try {
        const [stats, setStats] = React.useState({
            contactos: 0,
            negocios: 0,
            compras: 0,
            tickets: 0
        });

        React.useEffect(() => {
            loadStats();
        }, []);

        React.useEffect(() => {
            if (stats.contactos > 0) {
                setTimeout(() => {
                    initCharts();
                }, 200);
            }
        }, [stats]);

        React.useEffect(() => {
            const handleResize = () => {
                if (stats.contactos > 0) {
                    setTimeout(() => {
                        initCharts();
                    }, 100);
                }
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [stats]);

        const loadStats = async () => {
            try {
                const data = await ApiService.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error('Error loading stats:', error);
                // Datos de demostración
                const demoStats = {
                    contactos: 125,
                    negocios: 45,
                    compras: 89,
                    tickets: 23
                };
                setStats(demoStats);
            }
        };

        const initCharts = () => {
            // Limpiar gráficos existentes
            const charts = ['moduleChart', 'trendChart', 'performanceChart'];
            charts.forEach(chartId => {
                const canvas = document.getElementById(chartId);
                if (canvas) {
                    const existingChart = ChartJS.getChart(canvas);
                    if (existingChart) {
                        existingChart.destroy();
                    }
                }
            });

            // 1. Gráfico de distribución general (Doughnut)
            const moduleCtx = document.getElementById('moduleChart');
            if (moduleCtx) {
                new ChartJS(moduleCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Contactos', 'Negocios', 'Compras', 'Tickets'],
                        datasets: [{
                            data: [stats.contactos, stats.negocios, stats.compras, stats.tickets],
                            backgroundColor: ['#667eea', '#48bb78', '#ed8936', '#9f7aea'],
                            borderWidth: 3,
                            borderColor: '#fff',
                            hoverBorderWidth: 4,
                            hoverOffset: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            legend: { 
                                display: true,
                                position: window.innerWidth < 768 ? 'bottom' : 'bottom',
                                labels: {
                                    padding: window.innerWidth < 768 ? 10 : 20,
                                    usePointStyle: true,
                                    font: { size: window.innerWidth < 768 ? 10 : 12 },
                                    boxWidth: window.innerWidth < 768 ? 12 : 15
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 13 },
                                callbacks: {
                                    label: function(context) {
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                                        return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                                    }
                                }
                            }
                        },
                        animation: {
                            animateRotate: true,
                            duration: 1000
                        }
                    }
                });
            }

            // 2. Gráfico de facturación mensual (Line)
            const trendCtx = document.getElementById('trendChart');
            if (trendCtx) {
                const facturasPagadas = Math.round(stats.negocios * 0.6);
                const facturasPendientes = Math.round(stats.negocios * 0.3);
                
                new ChartJS(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                        datasets: [{
                            label: 'Facturas Pagadas',
                            data: [
                                Math.round(facturasPagadas * 0.4), 
                                Math.round(facturasPagadas * 0.55), 
                                Math.round(facturasPagadas * 0.7), 
                                Math.round(facturasPagadas * 0.82), 
                                Math.round(facturasPagadas * 0.91), 
                                facturasPagadas
                            ],
                            borderColor: '#48bb78',
                            backgroundColor: 'rgba(72, 187, 120, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: '#48bb78',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }, {
                            label: 'Facturas Pendientes',
                            data: [
                                Math.round(facturasPendientes * 0.35), 
                                Math.round(facturasPendientes * 0.55), 
                                Math.round(facturasPendientes * 0.68), 
                                Math.round(facturasPendientes * 0.78), 
                                Math.round(facturasPendientes * 0.88), 
                                facturasPendientes
                            ],
                            borderColor: '#ed8936',
                            backgroundColor: 'rgba(237, 137, 54, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: '#ed8936',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            legend: { 
                                display: true,
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    font: { size: window.innerWidth < 768 ? 10 : 12 },
                                    padding: window.innerWidth < 768 ? 10 : 15
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 13 }
                            }
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0,0,0,0.1)'
                                },
                                ticks: {
                                    font: { size: window.innerWidth < 768 ? 9 : 11 }
                                }
                            },
                            x: {
                                grid: {
                                    color: 'rgba(0,0,0,0.05)'
                                },
                                ticks: {
                                    font: { size: window.innerWidth < 768 ? 9 : 11 },
                                    maxRotation: window.innerWidth < 768 ? 45 : 0
                                }
                            }
                        },
                        animation: {
                            duration: 1500
                        }
                    }
                });
            }

            // 3. Gráfico de rendimiento combinado (Bar)
            const performanceCtx = document.getElementById('performanceChart');
            if (performanceCtx) {
                new ChartJS(performanceCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Negocios Activos', 'Compras Aprobadas', 'Tickets Resueltos', 'Contactos Nuevos'],
                        datasets: [{
                            label: 'Cantidad',
                            data: [
                                Math.round(stats.negocios * 0.73), 
                                Math.round(stats.compras * 0.85), 
                                Math.round(stats.tickets * 0.78), 
                                Math.round(stats.contactos * 0.15)
                            ],
                            backgroundColor: [
                                'rgba(72, 187, 120, 0.8)',
                                'rgba(56, 178, 172, 0.8)', 
                                'rgba(159, 122, 234, 0.8)',
                                'rgba(102, 126, 234, 0.8)'
                            ],
                            borderColor: [
                                '#48bb78',
                                '#38b2ac',
                                '#9f7aea', 
                                '#667eea'
                            ],
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false,
                            hoverBackgroundColor: [
                                'rgba(72, 187, 120, 1)',
                                'rgba(56, 178, 172, 1)',
                                'rgba(159, 122, 234, 1)',
                                'rgba(102, 126, 234, 1)'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 13 },
                                callbacks: {
                                    label: function(context) {
                                        return 'Cantidad: ' + context.parsed.y;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0,0,0,0.1)'
                                },
                                ticks: {
                                    font: { size: window.innerWidth < 768 ? 9 : 11 }
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    font: { size: window.innerWidth < 768 ? 8 : 11 },
                                    maxRotation: window.innerWidth < 768 ? 45 : 0
                                }
                            }
                        },
                        animation: {
                            duration: 1200,
                            easing: 'easeOutQuart'
                        }
                    }
                });
            }
        };

        const statsCards = [
            { title: 'Contactos', value: stats.contactos, icon: 'fas fa-users', color: '#667eea' },
            { title: 'Negocios', value: stats.negocios, icon: 'fas fa-handshake', color: '#48bb78' },
            { title: 'Compras', value: stats.compras, icon: 'fas fa-shopping-bag', color: '#ed8936' },
            { title: 'Tickets', value: stats.tickets, icon: 'fas fa-headset', color: '#9f7aea' }
        ];

        return (
            <div className="container-fluid p-4" style={{background: '#f8fafc', minHeight: '100vh'}} data-name="dashboard-container" data-file="components/Dashboard/Dashboard.js">
                <div className="row mb-4" data-name="dashboard-header" data-file="components/Dashboard/Dashboard.js">
                    <div className="col">
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{background: '#667eea', width: '56px', height: '56px'}}>
                                <i className="fas fa-chart-line fa-xl text-white"></i>
                            </div>
                            <div>
                                <h2 className="fw-bold mb-1 text-dark">Dashboard Ejecutivo</h2>
                                <p className="text-muted mb-0">Resumen en tiempo real de tu negocio</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4" data-name="stats-row" data-file="components/Dashboard/Dashboard.js">
                    {statsCards.map((card, index) => (
                        <div key={index} className="col-md-3" data-name="stats-col" data-file="components/Dashboard/Dashboard.js">
                            <div className="stats-card p-4 h-100" data-name="stats-card" data-file="components/Dashboard/Dashboard.js">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h3 className="fw-bold mb-1" style={{fontSize: '2.2rem', color: card.color}}>
                                            {card.value}
                                        </h3>
                                        <p className="text-muted mb-0 fw-medium">{card.title}</p>
                                    </div>
                                    <div 
                                        className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                                        style={{background: `${card.color}15`, width: '60px', height: '60px'}}
                                    >
                                        <i className={`${card.icon} fa-xl`} style={{color: card.color}}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-3 g-md-4" data-name="charts-section" data-file="components/Dashboard/Dashboard.js">
                    <div className="col-12 col-xl-6">
                        <div className="card-hover p-3 p-md-4 h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{background: '#667eea', width: '40px', height: '40px'}}>
                                    <i className="fas fa-chart-pie text-white"></i>
                                </div>
                                <h5 className="fw-bold mb-0 fs-6 fs-md-5">Distribución General</h5>
                            </div>
                            <div style={{position: 'relative', height: 'clamp(250px, 40vh, 400px)', minHeight: '250px'}}>
                                <canvas id="moduleChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-6">
                        <div className="card-hover p-3 p-md-4 h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{background: '#48bb78', width: '40px', height: '40px'}}>
                                    <i className="fas fa-chart-line text-white"></i>
                                </div>
                                <h5 className="fw-bold mb-0 fs-6 fs-md-5">Facturación Mensual</h5>
                            </div>
                            <div style={{position: 'relative', height: 'clamp(250px, 40vh, 400px)', minHeight: '250px'}}>
                                <canvas id="trendChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card-hover p-3 p-md-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{background: '#ed8936', width: '40px', height: '40px'}}>
                                    <i className="fas fa-chart-bar text-white"></i>
                                </div>
                                <h5 className="fw-bold mb-0 fs-6 fs-md-5">Rendimiento por Categoría</h5>
                            </div>
                            <div style={{position: 'relative', height: 'clamp(200px, 30vh, 350px)', minHeight: '200px'}}>
                                <canvas id="performanceChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard component error:', error);
        reportError(error);
    }
}
