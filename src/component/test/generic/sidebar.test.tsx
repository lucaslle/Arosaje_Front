import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from "../../generic/sidebar.tsx";

const renderAt = (pathname: string) =>
    render(
        <ChakraProvider>
            <MemoryRouter initialEntries={[pathname]}>
                <Sidebar />
            </MemoryRouter>
        </ChakraProvider>
    );

describe('Sidebar', () => {
    afterEach(cleanup);

    it('links to every section', () => {
        renderAt('/myplants');
        const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
        expect(hrefs).toEqual(['/myplants', '/all_plants', '/care-requests', '/setting']);
    });

    it('marks the current page', () => {
        renderAt('/care-requests');
        const current = screen.getAllByRole('link').filter((link) => link.getAttribute('aria-current') === 'page');
        expect(current.map((link) => link.getAttribute('href'))).toEqual(['/care-requests']);
    });
});
