import { Box, ChakraProvider, useToast } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import Sidebar, { SIDEBAR_WIDTH } from './component/generic/sidebar';
import theme from './theme';
import Header from "./component/generic/header.tsx";
import LoginPage from "./page/LoginPage";
import SettingPage from "./page/settingPage.tsx";
import HomePage from "./page/HomePage.tsx";
import PlantsittingPage from "./page/plantSittingPage.tsx";
import LikePage from './page/LikePage.tsx';
import AdvicePage from './page/AdvicePage.tsx';
import AdminPage from './page/AdminPage.tsx';
import DashboardPage from './page/DashboardPage.tsx';
import { useEffect } from 'react';
import { signOut, useMeStore } from './store/me.ts';
import { SESSION_EXPIRED } from './api/client.ts';
import { useT } from './i18n/index.ts';

// bottom-right keeps toasts off the sticky header; on mobile they sit above the bottom tab bar (64px)
const toastOptions = {
    defaultOptions: {
        position: "bottom-right" as const,
        containerStyle: { marginBottom: { base: "4.5rem", md: "1.25rem" }, marginRight: { base: "0.5rem", md: "1.25rem" } },
    },
};

const PLANT_SITTING_TYPES = ["all_plants", "care-requests"];

export function isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return !payload.exp || payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

function ProtectedLayout() {
    const loadMe = useMeStore((state) => state.load);
    const loggedIn = isLoggedIn();
    const navigate = useNavigate();
    const toast = useToast();
    const t = useT();

    useEffect(() => {
        if (loggedIn) loadMe();
    }, [loggedIn, loadMe]);

    // any page whose API call gets a 401 lands here, once
    useEffect(() => {
        const onExpired = () => {
            signOut();
            if (!toast.isActive(SESSION_EXPIRED)) {
                toast({ id: SESSION_EXPIRED, title: t("common.sessionExpired"), description: t("common.pleaseLogInAgain"), status: "warning", duration: 4000, isClosable: true });
            }
            navigate("/login", { replace: true });
        };
        window.addEventListener(SESSION_EXPIRED, onExpired);
        return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
    }, [navigate, toast, t]);

    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box minH="100vh">
            <Sidebar />
            <Box ml={{ base: 0, md: SIDEBAR_WIDTH }} pb={{ base: 16, md: 0 }}>
                <Header />
                <Box as="main" px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }} maxW="7xl" mx="auto">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

function PlantSittingRoute() {
    const { type } = useParams();
    return PLANT_SITTING_TYPES.includes(type ?? "") ? <PlantsittingPage /> : <Navigate to="/login" replace />;
}

function App() {
    return (
        <ChakraProvider theme={theme} toastOptions={toastOptions}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/myplants" element={<HomePage />} />
                        <Route path="/setting" element={<SettingPage />} />
                        <Route path="/like" element={<LikePage />} />
                        <Route path="/advice" element={<AdvicePage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/:type" element={<PlantSittingRoute />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
