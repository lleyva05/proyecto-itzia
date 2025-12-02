function Header({ user, onLogout }) {
    const [showDropdown, setShowDropdown] = React.useState(false);

    const handleLogout = () => {
        setShowDropdown(false);
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            onLogout();
        }
    };

    const handleNavigation = (route) => {
        setShowDropdown(false);
        console.log(`Navegar a: ${route}`);
    };

    const handleCreateNew = () => {
        console.log("Crear nuevo documento");
        // Aquí puedes abrir un modal o redirigir
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {/* Logo */}
                <span className="navbar-brand fw-bold text-dark">
                    <div className="rounded-circle me-2 d-inline-flex align-items-center justify-content-center" style={{ background: '#667eea', width: '32px', height: '32px' }}>
                        <i className="fas fa-rocket text-white" style={{ fontSize: '14px' }}></i>
                    </div>
                    TechSolutions CRM
                </span>

                {/* Iconos + usuario */}
                <div className="d-flex align-items-center gap-4 position-relative ms-3">
                    {/* Mensajes recibidos */}
                    <i className="fas fa-envelope fa-lg text-muted" title="Mensajes" style={{ cursor: 'pointer' }}></i>

                    {/* Chat */}
                    <i className="fas fa-comments fa-lg text-muted" title="Chat" style={{ cursor: 'pointer' }}></i>
                    
                    {/* Notificaciones */}
                    <i className="fas fa-bell fa-lg text-muted" title="Notificaciones" style={{ cursor: 'pointer' }}></i>

                    {/* Usuario */}
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                    >
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt="Perfil" className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                        ) : (
                            <i className="fas fa-user-circle fa-2x text-secondary"></i>
                        )}
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="position-absolute end-0 mt-5 bg-white border rounded-3 shadow-lg p-3" style={{ minWidth: '240px', zIndex: 1000 }}>
                            <div className="text-center mb-3">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Perfil" className="rounded-circle mb-2" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                ) : (
                                    <div className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ background: '#f8fafc', width: '60px', height: '60px' }}>
                                        <i className="fas fa-user fa-2x text-muted"></i>
                                    </div>
                                )}
                                <h6 className="fw-bold mb-1">{user?.name}</h6>
                                <small className="text-muted">{user?.email}</small>
                                <div className="mt-1">
                                    <span className="badge bg-secondary">{user?.role || 'Invitado'}</span>
                                </div>
                            </div>

                            {/* Opciones */}
                            <div className="d-grid gap-2">
                                <button className="btn btn-light text-start" onClick={() => handleNavigation('/perfil')}>
                                    <i className="fas fa-user me-2"></i> Perfil
                                </button>
                                <button className="btn btn-light text-start" onClick={() => handleNavigation('/configuracion')}>
                                    <i className="fas fa-cog me-2"></i> Configuración
                                </button>
                                <button className="btn btn-light text-start" onClick={() => handleNavigation('/calendario')}>
                                    <i className="fas fa-calendar-alt me-2"></i> Calendario
                                </button>
                                <button className="btn btn-danger text-start" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click afuera para cerrar */}
            {showDropdown && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 999 }}
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </nav>
    );
}
