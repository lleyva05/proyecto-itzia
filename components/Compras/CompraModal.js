function CompraModal({ compra, show, onHide, onSave }) {
    try {
        const [formData, setFormData] = React.useState({
            proveedor: '',
            descripcion: '',
            monto: '',
            fecha: '',
            estado: 'Pendiente'
        });

        React.useEffect(() => {
            if (compra) {
                setFormData(compra);
            } else {
                setFormData({ 
                    proveedor: '', 
                    descripcion: '', 
                    monto: '', 
                    fecha: new Date().toISOString().split('T')[0], 
                    estado: 'Pendiente' 
                });
            }
        }, [compra]);

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
            <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} data-name="compra-modal" data-file="components/Compras/CompraModal.js">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fas fa-shopping-bag me-2"></i>
                                {compra ? 'Editar Compra' : 'Nueva Compra'}
                            </h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Proveedor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="proveedor"
                                        value={formData.proveedor}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        name="descripcion"
                                        rows="3"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
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
                                        <option value="Aprobada">Aprobada</option>
                                        <option value="Rechazada">Rechazada</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onHide}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary-custom">
                                    <i className="fas fa-save me-2"></i>
                                    {compra ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('CompraModal component error:', error);
    }
}