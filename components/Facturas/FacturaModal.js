function FacturaModal({ factura, show, onHide, onSave }) {
    try {
        const [formData, setFormData] = React.useState({
            numero: '',
            cliente: '',
            monto: '',
            fecha: '',
            estado: 'Pendiente'
        });

        React.useEffect(() => {
            if (factura) {
                setFormData(factura);
            } else {
                const today = new Date().toISOString().split('T')[0];
                // Generar número progresivo basado en facturas existentes
                const existingFacturas = JSON.parse(localStorage.getItem('facturas_data') || '[]');
                const maxNumber = existingFacturas.reduce((max, f) => {
                    const num = parseInt(f.numero.split('-')[1]) || 0;
                    return num > max ? num : max;
                }, 0);
                const newNumber = `F-${String(maxNumber + 1).padStart(3, '0')}`;
                setFormData({ 
                    numero: newNumber, 
                    cliente: '', 
                    monto: '', 
                    fecha: today, 
                    estado: 'Pendiente' 
                });
            }
        }, [factura]);

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave({
                ...formData,
                monto: parseFloat(formData.monto)
            });
            onHide();
        };

        if (!show) return null;

        return (
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fas fa-file-invoice me-2"></i>
                                {factura ? 'Editar Factura' : 'Nueva Factura'}
                            </h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Número</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cliente</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="cliente"
                                        value={formData.cliente}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Monto ($)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="monto"
                                                value={formData.monto}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha"
                                                value={formData.fecha}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Pagada">Pagada</option>
                                        <option value="Vencida">Vencida</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onHide}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary-custom">
                                    <i className="fas fa-save me-2"></i>
                                    {factura ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('FacturaModal component error:', error);
    }
}