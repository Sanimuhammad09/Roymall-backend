# Roymall Scents API Documentation

Welcome to the API documentation for the **Roymall Scents** backend, a premium perfume e-commerce platform.

## API Servers
*   **Production Server:** `https://roymall-backend-production.up.railway.app`
*   **Local Development Server:** `http://localhost:4000` (or your local environment port)

---

## Authentication

Most write operations and user-specific endpoints require authentication using JSON Web Tokens (JWT).

### How to Authenticate
1.  Obtain an access token by sending a request to the **Register** or **Login** endpoints.
2.  Include the token in the headers of subsequent requests:
    ```http
    Authorization: Bearer <your_jwt_access_token>
    ```

---

## Endpoint Index

1.  [Authentication](#1-authentication)
2.  [Users](#2-users)
3.  [Products](#3-products)
4.  [Categories](#4-categories)
5.  [Orders](#5-orders)
6.  [Payments](#6-payments)
7.  [Wishlist](#7-wishlist)
8.  [Coupons](#8-coupons)
9.  [Waitlist](#9-waitlist)
10. [Fit Profile](#10-fit-profile)
11. [Dashboard](#11-dashboard)
12. [Store Settings](#12-store-settings)

---

## 1. Authentication

Endpoints related to user registration, login, token refresh, and password recovery.

### `POST /api/auth/register`
*   **Summary:** Register a new user.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "email": "jane@example.com",
      "password": "SecurePass123!",
      "firstName": "Jane",
      "lastName": "Doe"
    }
    ```
*   **Response:** `201 Created`

### `POST /api/auth/login`
*   **Summary:** Login with email and password.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "email": "jane@example.com",
      "password": "SecurePass123!"
    }
    ```
*   **Response:** `200 OK`

### `POST /api/auth/refresh`
*   **Summary:** Refresh access token.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "refreshToken": "your_refresh_token_here"
    }
    ```
*   **Response:** `200 OK`

### `POST /api/auth/forgot-password`
*   **Summary:** Request password reset email.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "email": "jane@example.com"
    }
    ```
*   **Response:** `200 OK`

### `POST /api/auth/reset-password`
*   **Summary:** Reset password with token.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "token": "reset_token_from_email",
      "newPassword": "NewSecurePass123!"
    }
    ```
*   **Response:** `200 OK`

### `GET /api/auth/profile`
*   **Summary:** Get current authenticated user profile.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

---

## 2. Users

Endpoints to manage user profiles and user lists.

### `GET /api/users/me`
*   **Summary:** Get current user profile.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `PUT /api/users/me`
*   **Summary:** Update current user profile.
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "firstName": "Jane (Updated)",
      "lastName": "Doe (Updated)",
      "avatar": "https://example.com/avatar.jpg"
    }
    ```
*   **Response:** `200 OK`

### `GET /api/users`
*   **Summary:** List all users (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `PUT /api/users/admin/{id}/status`
*   **Summary:** Block or unblock a user (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): User ID.
*   **Response:** `200 OK`

---

## 3. Products

Endpoints for catalog browsing and product management.

### `GET /api/products`
*   **Summary:** List products with filters and pagination.
*   **Authentication:** None.
*   **Query Parameters:**
    *   `category` (string, optional): Filter by category slug.
    *   `collection` (string, optional): Filter by collection.
    *   `color` (string, optional): Filter by color.
    *   `size` (string, optional): Filter by size.
    *   `minPrice` (number, optional): Minimum price filter.
    *   `maxPrice` (number, optional): Maximum price filter.
    *   `search` (string, optional): Search keyword.
    *   `sortBy` (string, optional): Sort sorting option. Enums: `price_asc`, `price_desc`, `newest`, `name_asc`, `name_desc`, `bestselling`.
    *   `isFeatured` (boolean, optional): Filter featured products.
    *   `page` (number, optional, default: `1`): Page number.
    *   `limit` (number, optional, default: `12`): Number of products per page.
*   **Response:** `200 OK`

### `POST /api/products`
*   **Summary:** Create a product (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "name": "Luxury Oud Perfume",
      "slug": "luxury-oud-perfume",
      "description": "An exquisite premium oud scent...",
      "fabricDetails": "N/A",
      "careInstructions": "Keep in a cool dry place.",
      "basePrice": 120,
      "isFeatured": true,
      "categoryId": "category-uuid",
      "collectionId": "collection-uuid",
      "variants": [
        {
          "sku": "OUD-50ML",
          "barcode": "123456789012",
          "color": "Amber",
          "colorHex": "#D27D2D",
          "size": "50ml",
          "priceOffset": 0,
          "inventory": 100
        }
      ],
      "images": [
        {
          "url": "https://example.com/images/oud.jpg",
          "alt": "Luxury Oud Bottle",
          "order": 1,
          "isMain": true
        }
      ]
    }
    ```
*   **Response:** `201 Created`

### `GET /api/products/featured`
*   **Summary:** Get featured products.
*   **Authentication:** None.
*   **Query Parameters:**
    *   `limit` (number, required): Number of products to return.
*   **Response:** `200 OK`

### `GET /api/products/{slug}`
*   **Summary:** Get product by slug.
*   **Authentication:** None.
*   **Path Parameters:**
    *   `slug` (string, required): Product slug.
*   **Response:** `200 OK`

### `GET /api/products/{id}/related`
*   **Summary:** Get related products.
*   **Authentication:** None.
*   **Path Parameters:**
    *   `id` (string, required): Product ID.
*   **Query Parameters:**
    *   `limit` (number, required): Limit of related products.
*   **Response:** `200 OK`

### `PUT /api/products/{id}`
*   **Summary:** Update a product (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Product ID.
*   **Request Body (JSON):**
    ```json
    {
      "name": "Updated Perfume Name",
      "slug": "updated-perfume-name",
      "description": "Updated description details...",
      "fabricDetails": "N/A",
      "careInstructions": "Keep away from heat.",
      "basePrice": 130,
      "isFeatured": true,
      "isActive": true,
      "categoryId": "category-uuid",
      "collectionId": "collection-uuid"
    }
    ```
*   **Response:** `200 OK`

### `DELETE /api/products/{id}`
*   **Summary:** Delete a product (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Product ID.
*   **Response:** `200 OK`

### `PUT /api/products/variants/{id}`
*   **Summary:** Update product variant details (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Variant ID.
*   **Response:** `200 OK`

---

## 4. Categories

Endpoints to manage categories.

### `GET /api/categories`
*   **Summary:** Get all categories hierarchically.
*   **Authentication:** None.
*   **Response:** `200 OK`

### `POST /api/categories`
*   **Summary:** Create a category (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "name": "Oud Fragrances",
      "slug": "oud-fragrances",
      "description": "Sultry, rich, and woodsy scents.",
      "image": "https://example.com/categories/oud.jpg",
      "parentId": "optional-parent-category-uuid"
    }
    ```
*   **Response:** `201 Created`

### `GET /api/categories/{slug}`
*   **Summary:** Get category by slug.
*   **Authentication:** None.
*   **Path Parameters:**
    *   `slug` (string, required): Category slug.
*   **Response:** `200 OK`

### `PUT /api/categories/{id}`
*   **Summary:** Update a category (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Category ID.
*   **Request Body (JSON):**
    ```json
    {
      "name": "Updated Oud Fragrances",
      "slug": "updated-oud-fragrances",
      "description": "Updated description...",
      "image": "https://example.com/categories/oud.jpg",
      "parentId": "optional-parent-category-uuid"
    }
    ```
*   **Response:** `200 OK`

### `DELETE /api/categories/{id}`
*   **Summary:** Delete a category (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Category ID.
*   **Response:** `200 OK`

---

## 5. Orders

Endpoints to place and manage orders.

### `POST /api/orders`
*   **Summary:** Create a new order from checkout.
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "items": [
        {
          "variantId": "variant-uuid",
          "quantity": 2,
          "price": 120
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "USA"
      },
      "subtotal": 240,
      "tax": 18,
      "shippingCost": 10,
      "total": 268,
      "couponCode": "WELCOME10",
      "discountAmount": 24
    }
    ```
*   **Response:** `201 Created`

### `GET /api/orders`
*   **Summary:** Get all orders for the current user.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `GET /api/orders/admin/all`
*   **Summary:** Get all orders (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `GET /api/orders/{id}`
*   **Summary:** Get a specific order by ID.
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Order ID.
*   **Response:** `200 OK`

### `POST /api/orders/admin/{id}/status`
*   **Summary:** Update order status (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Order ID.
*   **Response:** `201 Created`

---

## 6. Payments

Endpoints relating to payment processor integrations (Stripe).

### `POST /api/payments/create-intent`
*   **Summary:** Create Stripe payment intent for an order.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `201 Created`

### `POST /api/payments/webhook`
*   **Summary:** Stripe webhook endpoint.
*   **Authentication:** None (Signature validation).
*   **Headers:**
    *   `stripe-signature` (string, required): Webhook signature header.
*   **Response:** `201 Created`

---

## 7. Wishlist

Endpoints for managing the user's wishlist.

### `GET /api/wishlist`
*   **Summary:** Get current user's wishlist.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `POST /api/wishlist`
*   **Summary:** Add an item to the wishlist.
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "variantId": "variant-uuid-to-add"
    }
    ```
*   **Response:** `201 Created`

### `DELETE /api/wishlist/{variantId}`
*   **Summary:** Remove an item from the wishlist.
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `variantId` (string, required): Variant ID to remove.
*   **Response:** `200 OK`

---

## 8. Coupons

Endpoints for creating, managing, and validating discount coupons.

### `POST /api/coupons/validate`
*   **Summary:** Validate a coupon code against an order value.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "code": "SUMMER20",
      "orderValue": 150
    }
    ```
*   **Response:** `201 Created`

### `POST /api/coupons`
*   **Summary:** Create a new coupon (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "code": "SAVE50",
      "type": "percentage", 
      "value": 50,
      "minOrderValue": 100,
      "maxDiscount": 75,
      "startDate": "2026-07-20T12:00:00Z",
      "endDate": "2026-08-20T12:00:00Z",
      "usageLimit": 200,
      "isActive": true
    }
    ```
    *Note: `type` must be one of `percentage`, `fixed`, `free_shipping`.*
*   **Response:** `201 Created`

### `GET /api/coupons`
*   **Summary:** Get all coupons (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `DELETE /api/coupons/{id}`
*   **Summary:** Delete a coupon (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Path Parameters:**
    *   `id` (string, required): Coupon ID.
*   **Response:** `200 OK`

---

## 9. Waitlist

Endpoints for inventory restock notifications.

### `POST /api/waitlist/join`
*   **Summary:** Join a product's restock waitlist.
*   **Authentication:** None.
*   **Request Body (JSON):**
    ```json
    {
      "productId": "product-uuid",
      "email": "customer@example.com",
      "userId": "optional-user-uuid"
    }
    ```
*   **Response:** `201 Created`

---

## 10. Fit Profile

Endpoints to store user physical profiles for personalization/fit suggestions.

### `GET /api/fit-profile`
*   **Summary:** Get user fit profile and recommended selections.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `POST /api/fit-profile`
*   **Summary:** Save or update user fit profile.
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "gender": "female",
      "heightCm": 165,
      "weightKg": 58,
      "bodyShape": "hourglass",
      "preferredFit": "regular",
      "brandSizeRef": "M",
      "ageRange": "25-34"
    }
    ```
*   **Response:** `201 Created`

---

## 11. Dashboard

Endpoints for admin metrics and reporting analytics.

### `GET /api/dashboard/stats`
*   **Summary:** Get high-level dashboard metrics (sales, inventory status, etc.).
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `GET /api/dashboard/revenue`
*   **Summary:** Get revenue data plotted over time.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `GET /api/dashboard/recent-orders`
*   **Summary:** Get list of most recent orders.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

### `GET /api/dashboard/analytics`
*   **Summary:** Get comprehensive analytical reports.
*   **Authentication:** Required (Bearer Token).
*   **Response:** `200 OK`

---

## 12. Store Settings

Endpoints to fetch and edit shop configuration.

### `GET /api/store-settings`
*   **Summary:** Get global store settings.
*   **Authentication:** None.
*   **Response:** `200 OK`

### `PUT /api/store-settings/admin`
*   **Summary:** Update global store settings (Admin only).
*   **Authentication:** Required (Bearer Token).
*   **Request Body (JSON):**
    ```json
    {
      "freeShippingThreshold": 75,
      "flatShippingRate": 7.99,
      "taxRate": 8.25,
      "currency": "USD",
      "contactEmail": "support@roymallscents.com",
      "contactPhone": "+1-800-555-0199"
    }
    ```
*   **Response:** `200 OK`
