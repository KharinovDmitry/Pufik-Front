import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/TgAuthContext';
import Home from './Pages/Home';
import AuthPage from './Pages/Auth';
import Orders from './Pages/Order';
import { ToastProvider } from './context/ToastContext';
import AdminPanel from './Pages/AdminPanel';
function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ToastProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/adminPanel" element={<AdminPanel />} />
                        </Routes>
                    </ToastProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}


export default App