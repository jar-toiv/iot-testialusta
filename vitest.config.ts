import { configDefaults, defineConfig } from 'vitest/config'

// dist/ holds compiled copies of the tests; without this they run a second time.
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'dist/**'],
  },
})
