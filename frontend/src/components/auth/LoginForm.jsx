import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Alert, AlertDescription } from '../ui/Alert';
import { Fingerprint, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Determine role based on email
      const role = email === 'admin@rd.com' ? 'admin' : 'student';
      
      console.log('Attempting login...', { email, role }); // Debug log
      
      const result = await login(email, password, role);
      
      console.log('Login result:', result); // Debug log

      if (result.success) {
        toast.success('Login successful!');
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        const errorMessage = result.message || 'Invalid credentials. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      const errorMessage = err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Fingerprint className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Fingerprint Attendance</CardTitle>
          <CardDescription className="text-base">Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New student?</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-11"
              onClick={() => navigate('/register')}
            >
              Create Student Account
            </Button>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-3">Quick Login:</p>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="font-medium">Admin:</span>
                  <span className="text-xs">admin@rd.com / admin123</span>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Students: Use your registered email and password
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}