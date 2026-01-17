import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { authService } from '@/services/auth/authService';

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const token = searchParams.get('token');
  const email = (location.state as { email?: string })?.email;

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus('verifying');
    try {
      const response = await authService.verifyEmail(verificationToken);
      if (response.success) {
        setStatus('success');
      } else {
        throw new Error(response.error || 'Verification failed');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!email || resendLoading) return;

    setResendLoading(true);
    setResendSuccess(false);
    try {
      const response = await authService.resendVerification(email);
      if (response.success) {
        setResendSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  // Waiting for verification (no token in URL)
  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-purple-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Check your email</h2>
        <p className="text-white/60 mb-8 max-w-sm mx-auto">
          We've sent a verification link to{' '}
          {email ? (
            <span className="text-white font-medium">{email}</span>
          ) : (
            'your email address'
          )}
          . Click the link to verify your account.
        </p>

        {email && (
          <div className="space-y-4">
            {resendSuccess ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-sm"
              >
                Verification email sent successfully!
              </motion.p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Resend verification email
              </button>
            )}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Wrong email?{' '}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300">
              Sign up again
            </Link>
          </p>
        </div>
      </motion.div>
    );
  }

  // Verifying
  if (status === 'verifying') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">Verifying your email</h2>
        <p className="text-white/60">Please wait while we verify your email address...</p>
      </motion.div>
    );
  }

  // Success
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">Email verified!</h2>
        <p className="text-white/60 mb-8">
          Your email has been verified successfully. You can now sign in to your account.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200 group"
        >
          Sign in to your account
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    );
  }

  // Error
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center"
      >
        <XCircle className="w-10 h-10 text-red-400" />
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-4">Verification failed</h2>
      <p className="text-white/60 mb-8">
        {error || 'The verification link is invalid or has expired.'}
      </p>

      <div className="space-y-4">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-200"
        >
          Sign up again
        </Link>
        <p className="text-white/40 text-sm">
          Already verified?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default VerifyEmailPage;
