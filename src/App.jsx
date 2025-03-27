import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/TgAuthContext';
import Home from './Pages/Home';
import AuthPage from './Pages/Auth';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<AuthPage />} />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App