import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (!fullName.trim() || !phone.trim()) {
          toast.error('Full name and phone are required.');
          setError('Please fill all required fields.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          name: fullName.trim(),
          phone: phone.trim(),
          email,
          createdAt: new Date().toISOString(),
          emailVerified: false
        });

        await sendEmailVerification(user);
        setVerificationEmail(email);
        setShowVerificationPrompt(true);
        toast.success(' Verification email sent. Please check your inbox.');

        // 🛑 Sign out immediately to block unintended access
        await auth.signOut();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          await auth.signOut();
          setError('Email not verified');
          toast.error('Please verify your email before logging in.');

          const tempUser = await signInWithEmailAndPassword(auth, email, password);
          await sendEmailVerification(tempUser.user);
          await auth.signOut();

          setVerificationEmail(email);
          setShowVerificationPrompt(true);
          setLoading(false);
          return;
        }

        await setDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          lastLogin: new Date().toISOString()
        }, { merge: true });

        toast.success('🎉 Login successful!');
        onAuthSuccess();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errors: Record<string, string> = {
        'auth/email-already-in-use': 'Email already in use.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Try later.'
      };
      toast.error(errors[err.code] || err.message);
      setError(errors[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, verificationEmail, password);
      await sendEmailVerification(userCredential.user);
      await auth.signOut();
      toast.success('📩 Verification email resent!');
    } catch {
      toast.error('Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowVerificationPrompt(false);
    setIsSignup(false);
    setVerificationEmail('');
    setError(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
  };

  if (showVerificationPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Mail className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600">We’ve sent a verification link to:</p>
          <p className="font-medium text-blue-700 mt-1">{verificationEmail}</p>

          <div className="bg-blue-50 rounded-md p-4 mt-6 mb-4 text-sm text-blue-800">
            <CheckCircle className="inline w-5 h-5 mr-1" />
            Click the link in your email to activate your account.
          </div>

          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md mt-2 flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Resending...' : 'Resend Verification Email'}</span>
          </button>

          <button
            onClick={handleBackToLogin}
            className="mt-4 text-sm text-gray-700 hover:underline flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mx-auto flex items-center justify-center mb-3">
            <Mail className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-sm text-gray-600">{isSignup ? 'Sign up to use AutoPolicy' : 'Log in to continue'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? 'Create password (min 6 chars)' : 'Password'}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setFullName('');
              setPhone('');
              setEmail('');
              setPassword('');
            }}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
