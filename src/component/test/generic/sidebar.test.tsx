import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from "../../generic/sidebar.tsx";
import { useMeStore } from "../../../store/me.ts";
import type { Me } from "../../../api/types.ts";

const member = (overrides: Partial<Me> = {}): Me => ({
    id: 1, email: "a@b.c", username: "a", phone: "0", is_botanist: false, botanist_verified: false, is_admin: false, ...overrides,
});

const renderAt = (pathname: string) =>
    render(
        <ChakraProvider>
            <MemoryRouter initialEntries={[pathname]}>
                <Sidebar />
            </MemoryRouter>
        </ChakraProvider>
    );

describe('Sidebar', () => {
    afterEach(() => {
        cleanup();
        useMeStore.setState({ me: null });
    });

    it('links to every section', () => {
        renderAt('/myplants');
        const hrefs = screen.getAllByRole('link', { hidden: true }).map((link) => link.getAttribute('href'));
        expect(hrefs).toEqual(['/myplants', '/all_plants', '/care-requests', '/like', '/setting']);
    });

    it('shows advice to verified botanists and admin to admins only', () => {
        useMeStore.setState({ me: member({ is_botanist: true }) });
        renderAt('/myplants');
        expect(screen.getAllByRole('link', { hidden: true }).map((link) => link.getAttribute('href'))).not.toContain('/advice');
        cleanup();

        useMeStore.setState({ me: member({ is_botanist: true, botanist_verified: true, is_admin: true }) });
        renderAt('/myplants');
        const hrefs = screen.getAllByRole('link', { hidden: true }).map((link) => link.getAttribute('href'));
        expect(hrefs).toContain('/advice');
        expect(hrefs).toContain('/admin');
    });

    it('marks the current page', () => {
        renderAt('/care-requests');
        const current = screen.getAllByRole('link', { hidden: true }).filter((link) => link.getAttribute('aria-current') === 'page');
        expect(current.map((link) => link.getAttribute('href'))).toEqual(['/care-requests']);
    });
});
