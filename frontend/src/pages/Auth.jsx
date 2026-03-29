import { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImg from '../assets/login.jpg'; 
import AppleLogo from '../assets/Apple_logo.png';
import GoogleLogo from '../assets/Google__G__logo.png';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log("Sign in:", {email, password});
        } else {
            console.log("Register:", {name, email, password, confirmPassword});
        }
    };

    return (
        <div className="min-h-screen bg-[#abd1c6] flex items-center justify-center p-4">
            {/*Container Box */}
            <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-[#004643] shadow-2xl overflow-hidden rounded-lg min-h-[600px]">
                
                {/* left thumbnail */}
                <div className="relative w-full md:w-[40%] bg-[#004643]">
                    <img 
                        src={loginImg} 
                        alt="loginImg" 
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Logo (left coner) */}
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <span className="text-[#fffffe] font-bold leading-none text-xl uppercase">TDT<br/>Stadium</span>
                    </div>
                    {/* Slogan */}
                    <div className="absolute bottom-10 left-8">
                        <h2 className="text-[#f9bc60] text-3xl font-extrabold italic uppercase tracking-tighter">
                            Be the Best
                        </h2>
                    </div>
                </div>

                {/* Right thumbnail FORM */}
                <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="max-w-md mx-auto w-full">
                        {/* Header */}
                        <h1 className="text-3xl font-bold text-[#fffffe] mb-1 leading-tight">
                            LOG IN <span className="font-normal text-[#abd1c6]">or</span>
                        </h1>
                        <h1 className="text-3xl font-bold text-[#fffffe] mb-4 uppercase tracking-tighter">
                            Create Your Account
                        </h1>
                        <p className="text-sm text-[#abd1c6] mb-8">
                            Your best self starts here. Come in and get in your prime
                        </p>

                        {/* Social Buttons */}
                        <div className="flex flex-row gap-3 mb-8">
                            <button className="flex-1 border border-[#abd1c6] text-[#abd1c6] py-2.5 px-4 rounded flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#abd1c6] hover:text-[#004643] transition">
                                <img src={GoogleLogo} className="w-4 h-4" alt="G" />
                                Continue with Google
                            </button>
                            <button className="flex-1 border border-[#abd1c6] text-[#abd1c6] py-2.5 px-4 rounded flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#abd1c6] hover:text-[#004643] transition">
                                <img src={AppleLogo} className="w-4 h-4.5" alt="A" />
                                Continue with Apple
                            </button>
                        </div>

                        <hr className="mb-8" />

                        {/* Tabs Login/Register */}
                        <div className="flex flex-row mb-8 border-b border-[#abd1c6]/20">
                            <button 
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 pb-3 font-bold text-xs uppercase tracking-widest transition-all ${isLogin ? "border-b-2 border-[#f9bc60] text-[#fffffe]" : "text-[#abd1c6]"}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 pb-3 font-bold text-xs uppercase tracking-widest transition-all ${!isLogin ? "border-b-2 border-[#f9bc60] text-[#fffffe]" : "text-[#abd1c6]"}`}
                            >
                                Are you a new client?
                            </button>
                        </div>

                        {/* Form Inputs */}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-[#fffffe] mb-2 uppercase tracking-wide">Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-transparent border border-[#abd1c6] text-[#fffffe] p-3 rounded text-sm focus:outline-none focus:border-[#f9bc60] placeholder:text-[#abd1c6]/50"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-[#fffffe] mb-2 uppercase tracking-wide">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent border border-[#abd1c6] text-[#fffffe] p-3 rounded text-sm focus:outline-none focus:border-[#f9bc60] placeholder:text-[#abd1c6]/50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#fffffe] mb-2 uppercase tracking-wide">Password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent border border-[#abd1c6] text-[#fffffe] p-3 rounded text-sm focus:outline-none focus:border-[#f9bc60] placeholder:text-[#abd1c6]/50"
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-[#fffffe] mb-2 uppercase tracking-wide">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        className="w-full bg-transparent border border-[#abd1c6] text-[#fffffe] p-3 rounded text-sm focus:outline-none focus:border-[#f9bc60] placeholder:text-[#abd1c6]/50"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4">
                                <button type='submit' className="bg-[#f9bc60] text-[#001e1d] px-10 py-3 rounded font-bold text-sm hover:bg-[#abd1c6] hover:scale-105 active:scale-95 transition-all">
                                    {isLogin ? "Log in" : "Register"}
                                </button>
                                {isLogin && (
                                    <Link to="/" className="text-sm text-[#abd1c6] hover:underline hover:text-[#e16162] transition-colors">
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;