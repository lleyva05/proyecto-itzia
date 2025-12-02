function Login({ onLogin }) {
    const [formData, setFormData] = React.useState({ email: '', password: '' });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await AuthService.login(formData.email, formData.password);
        result.success ? onLogin(result.user) : setError(result.message);
        setLoading(false);
    };

    const fillDemoCredentials = (email, password) => setFormData({ email, password });

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0 bg-[url('/fondo-login.jpg')] bg-cover bg-center opacity-60"></div>

            {/* Capa azul oscura translúcida */}
            <div className="absolute inset-0 z-0 bg-blue-900/40 backdrop-blur-sm"></div>

            {/* Contenedor principal */}
            <div className="relative z-10 w-full max-w-6xl mx-4 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 grid md:grid-cols-2 overflow-hidden">
                
                {/* Imagen lateral sin fondo */}
                <div className="hidden md:flex items-center justify-center p-6 bg-transparent">
                    <img
                        src="/components/img/imagen2.png"
                        alt="Ilustración login"
                        className="max-w-full h-auto object-contain"
                    />
                </div>

                {/* Formulario */}
                <div className="p-6 sm:p-8 text-white">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-5">
                                <i className="fas fa-rocket text-white text-3xl"></i>
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            TechSolutions CRM
                        </h2>
                        <p className="text-sm text-white/80 mt-1">Bienvenida de vuelta</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-600 rounded-xl p-3 mb-4 text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                            <i className="fas fa-exclamation-circle"></i>{error}
                        </div>
                    )}

                    <div className="text-xs text-white/80 bg-cyan-500/10 rounded-xl p-3 mb-4 backdrop-blur-sm">
                        <strong><i className="fas fa-info-circle me-2"></i>Credenciales:</strong>
                        <div className="flex gap-2 mt-2">
                            <button className="btn btn-sm btn-outline-light" onClick={() => fillDemoCredentials('admin@crm.com', 'admin123')}>
                                <i className="fas fa-user-shield me-1"></i>Admin
                            </button>
                            <button className="btn btn-sm btn-outline-light" onClick={() => fillDemoCredentials('usuario@crm.com', 'usuario123')}>
                                <i className="fas fa-user me-1"></i>Usuario
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white/80 font-medium flex items-center mb-1">
                                <i className="fas fa-envelope mr-2 text-indigo-400"></i>Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl px-4 py-3 bg-white/80 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                                placeholder="Correo electrónico"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-white/80 font-medium flex items-center mb-1">
                                <i className="fas fa-lock mr-2 text-indigo-400"></i>Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full rounded-xl px-4 py-3 bg-white/80 text-sm text-black pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                                    placeholder="Contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-1"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <span className="spinner-border spinner-border-sm me-2"></span>Conectando...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <i className="fas fa-sign-in-alt mr-2"></i>Ingresar al Sistema
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
