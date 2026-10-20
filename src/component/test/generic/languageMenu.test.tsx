import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { LanguageMenu } from '../../generic/preferences.tsx';

describe('LanguageMenu', () => {
    afterEach(cleanup);

    it('does not render its list until opened, so it cannot widen the page', async () => {
        render(<ChakraProvider><LanguageMenu /></ChakraProvider>);
        expect(screen.queryAllByRole('menuitemradio', { hidden: true })).toHaveLength(0);

        fireEvent.click(screen.getByRole('button'));
        expect(await screen.findAllByRole('menuitemradio', { hidden: true })).toHaveLength(6);
    });
});
