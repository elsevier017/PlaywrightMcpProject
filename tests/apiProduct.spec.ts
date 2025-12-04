import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const endpoint = 'https://fakestoreapi.com/products/1';

const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    price: { type: 'number' },
    category: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['id', 'title', 'price', 'category', 'description']
};

test('GET product and validate response', async ({ request }) => {
  const response = await request.get(endpoint);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('title');
  expect(data).toHaveProperty('price');
  expect(data).toHaveProperty('category');
  expect(data).toHaveProperty('description');

  // Optionally validate with AJV
  const ajv = new Ajv();
  const validate = ajv.compile(productSchema);
  const valid = validate(data);
  expect(valid).toBeTruthy();

  // Log product list and price
  console.log('Product:', data.title);
  console.log('Price:', data.price);
});
