import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { loginUser, sendOTP, verifyOTP } from "../utils/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Mail, Lock, ArrowLeft, ShieldCheck } from "lucide-react";

function TwoFactorLogin() {
  const [step, setStep] = useState(1); // Step 1: Email/Password, Step 2: OTP
  const [method, setMethod] = useState("password"); // 'password' or 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { user, login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSendingOTP(true);
    setError("");

    try {
      await sendOTP(email);
      setSuccess("OTP sent to your email!");
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);

      if (!result?.user?.token) {
        throw new Error("Server response missing user token");
      }

      login(result.user);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyOTP(email, otp);

      if (!result?.user?.token) {
        throw new Error("Server response missing user token");
      }

      login(result.user);
      navigate("/");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsSendingOTP(true);
    setError("");

    try {
      await sendOTP(email);
      setSuccess("New OTP sent to your email!");
      startCountdown();
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Sign in to your account" : "Verify your identity"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
              {success}
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Method Selection */}
              <div className="flex gap-2 mb-6">
                <Button
                  type="button"
                  variant={method === "password" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMethod("password")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Button>
                <Button
                  type="button"
                  variant={method === "otp" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMethod("otp")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  OTP
                </Button>
              </div>

              <form onSubmit={method === "password" ? handlePasswordLogin : handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {method === "password" && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isSendingOTP}
                >
                  {isLoading || isSendingOTP
                    ? "Processing..."
                    : method === "password"
                    ? "Sign In"
                    : "Send OTP"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                For demo, use: admin@example.com / password
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {email}
                  </span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || isSendingOTP}
                    className="text-sm"
                  >
                    {isSendingOTP
                      ? "Sending..."
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Resend OTP"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TwoFactorLogin;
