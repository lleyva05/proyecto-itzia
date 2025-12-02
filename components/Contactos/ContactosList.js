function ContactosList() {
    try {
        const [contactos, setContactos] = React.useState([]);
        const [filteredContactos, setFilteredContactos] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showModal, setShowModal] = React.useState(false);
        const [selectedContacto, setSelectedContacto] = React.useState(null);
        const [searchTerm, setSearchTerm] = React.useState('');

        React.useEffect(() => {
            loadContactos();
        }, []);

        React.useEffect(() => {
            const filtered = contactos.filter(contacto =>
                contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contacto.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contacto.empresa.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredContactos(filtered);
        }, [contactos, searchTerm]);

        const loadContactos = async () => {
            try {
                const data = await ApiService.get('/contactos');
                setContactos(data);
            } catch (error) {
                console.error('Error loading contactos:', error);
                const savedContactos = JSON.parse(localStorage.getItem('contactos_data') || '[]');
                if (savedContactos.length > 0) {
                    setContactos(savedContactos);
                } else {
                    const defaultContactos = [
                        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123-456-7890', empresa: 'Tech Corp' },
                        { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '098-765-4321', empresa: 'Design Studio' },
                        { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555-123-4567', empresa: 'Innovation Lab' }
                    ];
                    setContactos(defaultContactos);
                    localStorage.setItem('contactos_data', JSON.stringify(defaultContactos));
                }
            }
            setLoading(false);
        };

        const handleAgregar = () => {
            setSelectedContacto(null);
            setShowModal(true);
        };

        const handleEditar = (contacto) => {
            setSelectedContacto(contacto);
            setShowModal(true);
        };

        const handleEliminar = (id) => {
            if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
                const updatedContactos = contactos.filter(c => c.id !== id);
                setContactos(updatedContactos);
                localStorage.setItem('contactos_data', JSON.stringify(updatedContactos));
            }
        };

        const handleGuardar = (contactoData) => {
            let updatedContactos;
            if (selectedContacto) {
                updatedContactos = contactos.map(c => 
                    c.id === selectedContacto.id ? { ...contactoData, id: selectedContacto.id } : c
                );
            } else {
                const newId = Math.max(...contactos.map(c => c.id)) + 1;
                updatedContactos = [...contactos, { ...contactoData, id: newId }];
            }
            setContactos(updatedContactos);
            localStorage.setItem('contactos_data', JSON.stringify(updatedContactos));
        };

        if (loading) {
            return (
                <div className="d-flex justify-content-center p-5" data-name="loading" data-file="components/Contactos/ContactosList.js">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            );
        }

        return (
            <div className="container-fluid p-4" data-name="contactos-container" data-file="components/Contactos/ContactosList.js">
                <div className="d-flex justify-content-between align-items-center mb-4" data-name="contactos-header" data-file="components/Contactos/ContactosList.js">
                    <div>
                        <h2 className="fw-bold mb-0">Contactos</h2>
                        <p className="text-muted">Gestión de contactos del sistema</p>
                    </div>
                    <button 
                        className="btn btn-primary-custom"
                        onClick={handleAgregar}
                        data-name="add-contact-btn"
                        data-file="components/Contactos/ContactosList.js"
                    >
                        <i className="fas fa-plus me-2"></i>Nuevo Contacto
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
                                placeholder="Buscar por nombre, email o empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card card-hover" data-name="contactos-card" data-file="components/Contactos/ContactosList.js">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Empresa</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContactos.map(contacto => (
                                        <tr key={contacto.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                                        <i className="fas fa-user text-primary"></i>
                                                    </div>
                                                    {contacto.nombre}
                                                </div>
                                            </td>
                                            <td>{contacto.email}</td>
                                            <td>{contacto.telefono}</td>
                                            <td>{contacto.empresa}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditar(contacto)}
                                                    title="Editar"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(contacto.id)}
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

                {React.createElement(ContactoModal, {
                    contacto: selectedContacto,
                    show: showModal,
                    onHide: () => setShowModal(false),
                    onSave: handleGuardar
                })}
            </div>
        );
    } catch (error) {
        console.error('ContactosList component error:', error);
        reportError(error);
    }
}
