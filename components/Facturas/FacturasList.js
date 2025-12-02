function FacturasList() {
    try {
        const [facturas, setFacturas] = React.useState([]);
        const [filteredFacturas, setFilteredFacturas] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showModal, setShowModal] = React.useState(false);
        const [selectedFactura, setSelectedFactura] = React.useState(null);
        const [searchTerm, setSearchTerm] = React.useState('');

        React.useEffect(() => {
            loadFacturas();
        }, []);

        React.useEffect(() => {
            const filtered = facturas.filter(factura =>
                factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                factura.estado.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFacturas(filtered);
        }, [facturas, searchTerm]);

        const loadFacturas = async () => {
            try {
                const data = await ApiService.get('/facturas');
                setFacturas(data);
            } catch (error) {
                console.error('Error loading facturas:', error);
                const savedFacturas = JSON.parse(localStorage.getItem('facturas_data') || '[]');
                if (savedFacturas.length > 0) {
                    setFacturas(savedFacturas);
                } else {
                    const defaultFacturas = [
                        { id: 1, numero: 'F-001', cliente: 'Tech Corp', monto: 5000, fecha: '2024-01-15', estado: 'Pagada' },
                        { id: 2, numero: 'F-002', cliente: 'StartUp Inc', monto: 3200, fecha: '2024-01-10', estado: 'Pendiente' },
                        { id: 3, numero: 'F-003', cliente: 'Big Company', monto: 8500, fecha: '2024-01-08', estado: 'Vencida' }
                    ];
                    setFacturas(defaultFacturas);
                    localStorage.setItem('facturas_data', JSON.stringify(defaultFacturas));
                }
            }
            setLoading(false);
        };

        const getStatusColor = (estado) => {
            const colors = {
                'Pagada': 'success',
                'Pendiente': 'warning',
                'Vencida': 'danger'
            };
            return colors[estado] || 'secondary';
        };

        const handleAgregar = () => {
            setSelectedFactura(null);
            setShowModal(true);
        };

        const handleEditar = (factura) => {
            setSelectedFactura(factura);
            setShowModal(true);
        };

        const handleEliminar = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
                const updatedFacturas = facturas.filter(f => f.id !== id);
                setFacturas(updatedFacturas);
                localStorage.setItem('facturas_data', JSON.stringify(updatedFacturas));
            }
        };

        const handleGuardar = (facturaData) => {
            let updatedFacturas;
            if (selectedFactura) {
                updatedFacturas = facturas.map(f => 
                    f.id === selectedFactura.id ? { ...facturaData, id: selectedFactura.id } : f
                );
            } else {
                const newId = Math.max(...facturas.map(f => f.id)) + 1;
                updatedFacturas = [...facturas, { ...facturaData, id: newId }];
            }
            setFacturas(updatedFacturas);
            localStorage.setItem('facturas_data', JSON.stringify(updatedFacturas));
        };

        if (loading) {
            return (
                <div className="d-flex justify-content-center p-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            );
        }

        return (
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0">Facturas</h2>
                        <p className="text-muted">Gestión de facturación</p>
                    </div>
                    <button className="btn btn-primary-custom" onClick={handleAgregar}>
                        <i className="fas fa-plus me-2"></i>Nueva Factura
                    </button>
                </div>

                <div className="card card-hover mb-4">
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por cliente, número o estado..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card card-hover">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Número</th>
                                        <th>Cliente</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFacturas.map(factura => (
                                        <tr key={factura.id}>
                                            <td className="fw-bold">{factura.numero}</td>
                                            <td>{factura.cliente}</td>
                                            <td className="fw-bold text-success">${factura.monto.toLocaleString()}</td>
                                            <td>{factura.fecha}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusColor(factura.estado)}`}>
                                                    {factura.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditar(factura)}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(factura.id)}
                                                    title="Eliminar"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {React.createElement(FacturaModal, {
                    factura: selectedFactura,
                    show: showModal,
                    onHide: () => setShowModal(false),
                    onSave: handleGuardar
                })}
            </div>
        );
    } catch (error) {
        console.error('FacturasList component error:', error);
    }
}