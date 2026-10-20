import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
    test: {
        reporters: ['default'],
        environment: 'jsdom',
        deps: {
            inline: ['@chakra-ui/react']
        }
    },
}))