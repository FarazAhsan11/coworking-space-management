import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const OFFICE_EMAIL = "officeboy@workspace.com";
const OFFICE_PASSWORD = "password123";

const OfficeLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isOfficeLoggedIn = sessionStorage.getItem("officeAuth");
    if (isOfficeLoggedIn === "true") {
      navigate("/office/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (form.email === OFFICE_EMAIL && form.password === OFFICE_PASSWORD) {
        sessionStorage.setItem("officeAuth", "true");
        toast.success("Office Boy logged in successfully!");
        navigate("/office/dashboard");
      } else {
        toast.error("Invalid credentials!");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-3xl font-bold text-gray-900">Office Boy Portal</h2>
          <p className="mt-2 text-gray-600">Sign in to manage the workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="officeboy@workspace.com"
              disabled={loading}
              required
              className="mt-1"
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
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">Office Credentials:</p>
          <p className="text-sm text-blue-800">Email: officeboy@workspace.com</p>
          <p className="text-sm text-blue-800">Password: password123</p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Back to Customer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficeLogin;