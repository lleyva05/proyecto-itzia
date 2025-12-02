function NegociosList() {
    try {
        const [negocios, setNegocios] = React.useState([]);
        const [filteredNegocios, setFilteredNegocios] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showModal, setShowModal] = React.useState(false);
        const [selectedNegocio, setSelectedNegocio] = React.useState(null);
        const [searchTerm, setSearchTerm] = React.useState('');

        React.useEffect(() => {
            loadNegocios();
        }, []);

        React.useEffect(() => {
            const filtered = negocios.filter(negocio =>
                negocio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                negocio.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                negocio.estado.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredNegocios(filtered);
        }, [negocios, searchTerm]);

        const loadNegocios = async () => {
            try {
                const data = await ApiService.get('/negocios');
                setNegocios(data);
            } catch (error) {
                console.error('Error loading negocios:', error);
                const savedNegocios = JSON.parse(localStorage.getItem('negocios_data') || '[]');
                if (savedNegocios.length > 0) {
                    setNegocios(savedNegocios);
                } else {
                    const defaultNegocios = [
                        { id: 1, titulo: 'Proyecto Web', cliente: 'Tech Corp', valor: 15000, estado: 'En Progreso' },
                        { id: 2, titulo: 'App Mobile', cliente: 'StartUp Inc', valor: 25000, estado: 'Propuesta' },
                        { id: 3, titulo: 'Sistema ERP', cliente: 'Big Company', valor: 50000, estado: 'Cerrado' }
                    ];
                    setNegocios(defaultNegocios);
                    localStorage.setItem('negocios_data', JSON.stringify(defaultNegocios));
                }
            }
            setLoading(false);
        };

        const getStatusBadge = (estado) => {
            const statusMap = {
                'En Progreso': 'warning',
                'Propuesta': 'info',
                'Cerrado': 'success',
                'Perdido': 'danger'
            };
            return statusMap[estado] || 'secondary';
        };

        const handleAgregar = () => {
            setSelectedNegocio(null);
            setShowModal(true);
        };

        const handleEditar = (negocio) => {
            setSelectedNegocio(negocio);
            setShowModal(true);
        };

        const handleEliminar = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar este negocio?')) {
                const updatedNegocios = negocios.filter(n => n.id !== id);
                setNegocios(updatedNegocios);
                localStorage.setItem('negocios_data', JSON.stringify(updatedNegocios));
            }
        };

        const handleGuardar = (negocioData) => {
            let updatedNegocios;
            if (selectedNegocio) {
                updatedNegocios = negocios.map(n => 
                    n.id === selectedNegocio.id ? { ...negocioData, id: selectedNegocio.id } : n
                );
            } else {
                const newId = Math.max(...negocios.map(n => n.id)) + 1;
                updatedNegocios = [...negocios, { ...negocioData, id: newId }];
            }
            setNegocios(updatedNegocios);
            localStorage.setItem('negocios_data', JSON.stringify(updatedNegocios));
        };

        if (loading) {
            return (
                <div className="d-flex justify-content-center p-5" data-name="loading" data-file="components/Negocios/NegociosList.js">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            );
        }

        return (
            <div className="container-fluid p-4" data-name="negocios-container" data-file="components/Negocios/NegociosList.js">
                <div className="d-flex justify-content-between align-items-center mb-4" data-name="negocios-header" data-file="components/Negocios/NegociosList.js">
                    <div>
                        <h2 className="fw-bold mb-0">Negocios</h2>
                        <p className="text-muted">Gestión de oportunidades de negocio</p>
                    </div>
                    <button 
                        className="btn btn-primary-custom"
                        onClick={handleAgregar}
                        data-name="add-negocio-btn" 
                        data-file="components/Negocios/NegociosList.js"
                    >
                        <i className="fas fa-plus me-2"></i>Nuevo Negocio
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
                                placeholder="Buscar por título, cliente o estado..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row g-4" data-name="negocios-grid" data-file="components/Negocios/NegociosList.js">
                    {filteredNegocios.map(negocio => (
                        <div key={negocio.id} className="col-md-6 col-lg-4" data-name="negocio-col" data-file="components/Negocios/NegociosList.js">
                            <div className="card card-hover h-100" data-name="negocio-card" data-file="components/Negocios/NegociosList.js">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title">{negocio.titulo}</h5>
                                        <span className={`badge bg-${getStatusBadge(negocio.estado)}`}>
                                            {negocio.estado}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-2">
                                        <i className="fas fa-building me-2"></i>
                                        {negocio.cliente}
                                    </p>
                                    <p className="text-success fw-bold mb-3">
                                        <i className="fas fa-dollar-sign me-2"></i>
                                        ${negocio.valor.toLocaleString()}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEditar(negocio)}
                                            title="Editar"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleEliminar(negocio.id)}
                                            title="Eliminar"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {React.createElement(NegocioModal, {
                    negocio: selectedNegocio,
                    show: showModal,
                    onHide: () => setShowModal(false),
                    onSave: handleGuardar
                })}
            </div>
        );
    } catch (error) {
        console.error('NegociosList component error:', error);
        reportError(error);
    }
}
