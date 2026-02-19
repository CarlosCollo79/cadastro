import { test, expect } from '@playwright/test';

test.describe('Smoke Tests (Public)', () => {
    test('Deve carregar a Home Page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Stallos/); // Adjust based on real title
        await expect(page.getByText('Pré-Cadastro', { exact: false })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('Deve redirecionar /admin para login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*sign-in.*/);
    });

    test('Deve redirecionar /cadastro para login', async ({ page }) => {
        await page.goto('/cadastro');
        await expect(page).toHaveURL(/.*sign-in.*/);
    });

    test('Deve redirecionar /meus-dados para login', async ({ page }) => {
        await page.goto('/meus-dados');
        await expect(page).toHaveURL(/.*sign-in.*/);
    });
});
