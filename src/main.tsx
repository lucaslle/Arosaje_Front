import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import App from "./App";
import theme from "./theme";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
    </React.StrictMode>
);
