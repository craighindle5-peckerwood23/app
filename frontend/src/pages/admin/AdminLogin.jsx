import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/admin/login`, {
        email,
        password
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminName", response.data.name);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FileSolved Admin</h1>
          <p className="text-slate-600 mt-1">Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card-base p-8 space-y-6" data-testid="admin-login-form">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@filesolved.com"
              required
              className="mt-1"
              data-testid="admin-email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
              data-testid="admin-password"
            />
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full"
            disabled={loading}
            data-testid="admin-login-submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Default: admin@filesolved.com / Admin123!
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
