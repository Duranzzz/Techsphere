"use client";

import { useState } from "react";
import useAuth from "@/utils/useAuth";
import {
  Package,
  Smartphone,
  Monitor,
  Gamepad2,
  Eye,
  EyeOff,
} from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [setupMessage, setSetupMessage] = useState(null);

  const { signInWithCredentials } = useAuth();

  const setupAdmin = async () => {
    try {
      setSetupMessage("Configurando usuario admin...");
      const response = await fetch("/api/setup-admin", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        setSetupMessage("✅ " + data.message);
        setEmail("admin@techsphere.com");
        setPassword("admin123");
      } else {
        setSetupMessage("❌ Error al configurar admin");
      }
    } catch (err) {
      console.error(err);
      setSetupMessage("❌ Error al configurar admin");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/admin",
        redirect: true,
      });
    } catch (err) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header con logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-4">
            <Package className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TechSphere Admin
          </h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20">
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  className="w-full bg-transparent text-lg outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 flex items-center gap-2">
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-lg outline-none"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {setupMessage && (
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-600">{setupMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-lg font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg"
            >
              {loading ? "Cargando..." : "Ingresar al Admin"}
            </button>
          </div>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Credenciales Demo:
            </h3>
            <p className="text-sm text-gray-600">Email: admin@techsphere.com</p>
            <p className="text-sm text-gray-600">Contraseña: admin123</p>

            <button
              type="button"
              onClick={setupAdmin}
              className="mt-3 w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              🔧 Configurar Usuario Demo
            </button>
            <p className="text-xs text-gray-500 mt-2">
              * Haz clic aquí si no puedes iniciar sesión
            </p>
          </div>
        </form>

        {/* Decorative icons */}
        <div className="flex justify-center space-x-6 mt-8 opacity-60">
          <Smartphone className="h-8 w-8 text-blue-500" />
          <Monitor className="h-8 w-8 text-purple-500" />
          <Gamepad2 className="h-8 w-8 text-blue-500" />
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
