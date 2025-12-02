function ComprasList() {
    try {
        const [compras, setCompras] = React.useState([]);
        const [filteredCompras, setFilteredCompras] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [selectedProveedor, setSelectedProveedor] = React.useState(null);
        const [selectedCompra, setSelectedCompra] = React.useState(null);
        const [showModal, setShowModal] = React.useState(false);
        const [showCompraModal, setShowCompraModal] = React.useState(false);
        const [searchTerm, setSearchTerm] = React.useState('');

        React.useEffect(() => {
            loadCompras();
        }, []);

        React.useEffect(() => {
            const filtered = compras.filter(compra =>
                compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                compra.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                compra.estado.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCompras(filtered);
        }, [compras, searchTerm]);

        const loadCompras = async () => {
            try {
                const data = await ApiService.get('/compras');
                setCompras(data);
            } catch (error) {
                console.error('Error loading compras:', error);
                const savedCompras = JSON.parse(localStorage.getItem('compras_data') || '[]');
                if (savedCompras.length > 0) {
                    setCompras(savedCompras);
                } else {
                    const defaultCompras = [
                        { 
                            id: 1, 
                            proveedor: 'Tech Solutions', 
                            descripcion: 'Licencias Software', 
                            monto: 2500, 
                            fecha: '2024-01-15', 
                            estado: 'Aprobada',
                            proveedorInfo: {
                                nombre: 'Tech Solutions',
                                ruc: '20123456789',
                                email: 'ventas@techsolutions.com',
                                telefono: '+51 999 888 777',
                                sitioWeb: 'https://techsolutions.com',
                                direccion: 'Av. Tecnología 123',
                                ciudad: 'Lima',
                                pais: 'Perú',
                                contacto: 'Carlos Mendoza',
                                estado: 'Activo',
                                totalCompras: 15,
                                montoTotal: 45000,
                                ultimaCompra: '2024-01-15'
                            }
                        },
                        { 
                            id: 2, 
                            proveedor: 'Office Supplies', 
                            descripcion: 'Material de Oficina', 
                            monto: 450, 
                            fecha: '2024-01-10', 
                            estado: 'Pendiente',
                            proveedorInfo: {
                                nombre: 'Office Supplies',
                                ruc: '20987654321',
                                email: 'info@officesupplies.com',
                                telefono: '+51 888 777 666',
                                sitioWeb: 'https://officesupplies.com',
                                direccion: 'Jr. Comercio 456',
                                ciudad: 'Lima',
                                pais: 'Perú',
                                contacto: 'Ana García',
                                estado: 'Activo',
                                totalCompras: 8,
                                montoTotal: 12500,
                                ultimaCompra: '2024-01-10'
                            }
                        }
                    ];
                    setCompras(defaultCompras);
                    localStorage.setItem('compras_data', JSON.stringify(defaultCompras));
                }
            }
            setLoading(false);
        };

        const handleAgregarCompra = () => {
            setSelectedCompra(null);
            setShowCompraModal(true);
        };

        const handleEditarCompra = (compra) => {
            setSelectedCompra(compra);
            setShowCompraModal(true);
        };

        const handleGuardarCompra = (compraData) => {
            let updatedCompras;
            if (selectedCompra) {
                updatedCompras = compras.map(c => 
                    c.id === selectedCompra.id ? { ...compraData, id: selectedCompra.id } : c
                );
            } else {
                const newId = Math.max(...compras.map(c => c.id)) + 1;
                updatedCompras = [...compras, { ...compraData, id: newId }];
            }
            setCompras(updatedCompras);
            localStorage.setItem('compras_data', JSON.stringify(updatedCompras));
        };

        const handleEliminarCompra = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar esta compra?')) {
                const updatedCompras = compras.filter(compra => compra.id !== id);
                setCompras(updatedCompras);
                localStorage.setItem('compras_data', JSON.stringify(updatedCompras));
            }
        };

        const getStatusColor = (estado) => {
            const colors = {
                'Aprobada': 'success',
                'Pendiente': 'warning',
                'Rechazada': 'danger'
            };
            return colors[estado] || 'secondary';
        };

        const handleVerProveedor = (compra) => {
            setSelectedProveedor(compra.proveedorInfo);
            setShowModal(true);
        };

        if (loading) {
            return (
                <div className="d-flex justify-content-center p-5" data-name="loading" data-file="components/Compras/ComprasList.js">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            );
        }

        return (
            <div className="container-fluid p-4" data-name="compras-container" data-file="components/Compras/ComprasList.js">
                <div className="d-flex justify-content-between align-items-center mb-4" data-name="compras-header" data-file="components/Compras/ComprasList.js">
                    <div>
                        <h2 className="fw-bold mb-0">Compras </h2>
                        <p className="text-muted">Gestión de órdenes de compra</p>
                    </div>
                    <button 
                        className="btn btn-primary-custom" 
                        onClick={handleAgregarCompra}
                        data-name="add-compra-btn" 
                        data-file="components/Compras/ComprasList.js"
                    >
                        <i className="fas fa-plus me-2"></i>Nueva Compra
                    </button>
                </div>

                <div className="card card-hover mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="fas fa-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por proveedor, descripción o estado..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card card-hover" data-name="compras-card" data-file="components/Compras/ComprasList.js">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Proveedor</th>
                                        <th>Descripción</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCompras.map(compra => (
                                        <tr key={compra.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                                                        <i className="fas fa-store text-warning"></i>
                                                    </div>
                                                    {compra.proveedor}
                                                </div>
                                            </td>
                                            <td>{compra.descripcion}</td>
                                            <td className="fw-bold text-success">${compra.monto.toLocaleString()}</td>
                                            <td>{compra.fecha}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusColor(compra.estado)}`}>
                                                    {compra.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminarCompra(compra.id)}
                                                    title="Eliminar Compra"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditarCompra(compra)}
                                                    title="Editar Compra"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {React.createElement(ProveedorModal, {
                    proveedor: selectedProveedor,
                    show: showModal,
                    onHide: () => setShowModal(false)
                })}

                {React.createElement(CompraModal, {
                    compra: selectedCompra,
                    show: showCompraModal,
                    onHide: () => setShowCompraModal(false),
                    onSave: handleGuardarCompra
                })}
            </div>
        );
    } catch (error) {
        console.error('ComprasList component error:', error);
        reportError(error);
    }
}
