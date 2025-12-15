import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { login, loading, state } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (state.currentUser) {
      navigate("/customer/dashboard", { replace: true });
    }
  }, [state.currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      return;
    }

    try {
      await login(form.email, form.password);
    } catch (error) {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Co-working Space</h2>
          <p className="mt-2 text-center text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@workspace.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Demo Accounts:</p>
          <p>john@workspace.com</p>
          <p>sara@workspace.com</p>
          <p>ahmed@workspace.com</p>
          <p className="mt-1">Password: password123</p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;