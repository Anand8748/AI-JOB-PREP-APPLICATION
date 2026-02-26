import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/generalInfo.slice';

export default function Navbar() {
    const { isAuthenticated, userName } = useSelector((state) => state.generalInfo);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0b0f1a]/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center text-white">

                    {/* Logo */}
                    <NavLink to={'/'} className="flex-shrink-0 flex items-center">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#22c55e] to-[#f97316] flex items-center justify-center text-white mr-3 glow-ring">
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 384 512"
                                fill="currentColor"
                            >
                                <path d="M96 96V256c0 53 43 96 96 96s96-43 96-96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V192H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96S96 43 96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">AI JOP PREP</span>
                    </NavLink>

                    {/* Nav Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-1 hover:text-[#38BDF8] font-semibold text-lg transition ${isActive
                                    ? 'bg-white/10 rounded-full hover:bg-white/20 hover:text-white'
                                    : ''
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        {isAuthenticated ? (
                            <NavLink
                                to="/upload"
                                className={({ isActive }) =>
                                    `px-4 py-1 hover:text-[#38BDF8] font-semibold text-lg transition ${isActive
                                        ? 'bg-white/10 rounded-full hover:bg-white/20 hover:text-white'
                                        : ''
                                    }`
                                }
                            >
                                Start Interview
                            </NavLink>
                        ) : null}
                        {isAuthenticated ? (
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `px-4 py-1 hover:text-[#38BDF8] font-semibold text-lg transition ${isActive
                                        ? 'bg-white/10 rounded-full hover:bg-white/20 hover:text-white'
                                        : ''
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        ) : null}
                        
                        {isAuthenticated ? (
                            <>
                                {userName ? (
                                    <span className="px-4 py-1 text-sm font-semibold bg-white/10 rounded-full border border-white/10">
                                        {userName}
                                    </span>
                                ) : null}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold text-lg rounded-full transition shadow-lg shadow-red-500/30"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="px-5 py-2 bg-[#38BDF8] hover:bg-[#3B82F6] text-white font-semibold text-lg rounded-full transition shadow-lg shadow-[#38BDF8]/30"
                            >
                                Login
                            </NavLink>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}
