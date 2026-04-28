# Product API Testing Guide

This guide provides examples for testing all product API endpoints.

## Prerequisites

1. Start your backend server: `npm start` or `node server.js`
2. Have a valid admin JWT token (get from login endpoint)
3. Base URL: `http://localhost:5000/api/products`

## Authentication

For protected routes (POST, PUT, DELETE, PATCH), include the JWT token in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 1. CREATE PRODUCT (POST /api/products)

### Example 1: Create a Boot Product

**cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Nike Mercurial Vapor 15 Elite FG",
    "description": "Experience explosive speed with the Nike Mercurial Vapor 15 Elite FG. Designed for the fastest players on the pitch.",
    "originalPrice": 275.00,
    "discount": 15,
    "sku": "BOOT-NIKE-MV15-001",
    "category": "BOOTS",
    "brand": "Nike",
    "age": ["Adult"],
    "tags": ["New", "Best Seller"],
    "outsole": "Firm Ground",
    "material": "Synthetic",
    "player": "Kylian Mbappe",
    "colorVariants": [
      {
        "color": "Black",
        "hexCode": "#000000",
        "images": [],
        "sizeStock": [
          { "size": "39", "stock": 5 },
          { "size": "40", "stock": 8 },
          { "size": "41", "stock": 12 },
          { "size": "42", "stock": 10 }
        ]
      }
    ],
    "images": [],
    "isPublished": true,
    "isBestSeller": true,
    "metaTitle": "Nike Mercurial Vapor 15 Elite FG",
    "metaKeywords": ["nike", "mercurial", "football boots"]
  }'
```

### Example 2: Create a Gloves Product

**cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Adidas Predator Pro Goalkeeper Gloves",
    "description": "Professional-grade goalkeeper gloves with superior grip.",
    "originalPrice": 120.00,
    "discount": 20,
    "sku": "GLOVE-ADIDAS-PRED-001",
    "category": "GLOVES",
    "brand": "Adidas",
    "age": ["Adult", "Kids"],
    "tags": ["Deal"],
    "colorVariants": [
      {
        "color": "Red",
        "hexCode": "#FF0000",
        "images": [],
        "sizeStock": [
          { "size": "8", "stock": 6 },
          { "size": "9", "stock": 8 },
          { "size": "10", "stock": 10 }
        ]
      }
    ],
    "images": [],
    "isPublished": true
  }'
```

### Example 3: Create an Accessory (Balls)

**cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Nike Premier League Strike Football",
    "description": "Official Premier League training ball with high-contrast graphics.",
    "originalPrice": 35.00,
    "discount": 10,
    "sku": "ACC-BALL-NIKE-PL-001",
    "category": "ACCESSORIES",
    "accessoryType": "Balls",
    "brand": "Nike",
    "tags": ["New"],
    "accessoryStock": {
      "3": 15,
      "4": 25,
      "5": 30
    },
    "images": [],
    "isPublished": true
  }'
```

### Example 4: Create an Accessory (Tape - No Sizes)

**cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Soka Pro Grip Tape",
    "description": "Professional-grade grip tape for enhanced ball control.",
    "originalPrice": 8.00,
    "discount": 0,
    "sku": "ACC-TAPE-SOKA-PG-001",
    "category": "ACCESSORIES",
    "accessoryType": "Tape",
    "brand": "Soka",
    "tags": ["New"],
    "accessoryStock": {
      "One Size": 100
    },
    "images": [],
    "isPublished": true
  }'
```

---

## 2. GET ALL PRODUCTS (GET /api/products)

### Basic Request
```bash
curl http://localhost:5000/api/products
```

### With Filters
```bash
# Filter by category
curl "http://localhost:5000/api/products?category=BOOTS"

# Filter by brand
curl "http://localhost:5000/api/products?brand=Nike"

# Filter by age
curl "http://localhost:5000/api/products?age=Adult"

# Filter by tags (multiple)
curl "http://localhost:5000/api/products?tags=New,Deal"

# Filter by price range
curl "http://localhost:5000/api/products?minPrice=50&maxPrice=200"

# Filter by color
curl "http://localhost:5000/api/products?color=Black,White"

# Filter by size
curl "http://localhost:5000/api/products?size=41,42"

# Search by name/description
curl "http://localhost:5000/api/products?search=Nike"

# Combined filters
curl "http://localhost:5000/api/products?category=BOOTS&brand=Nike&tags=New&minPrice=100&maxPrice=300"
```

### With Sorting
```bash
# Sort by price ascending
curl "http://localhost:5000/api/products?sort=price-asc"

# Sort by price descending
curl "http://localhost:5000/api/products?sort=price-desc"

# Sort by name
curl "http://localhost:5000/api/products?sort=name-asc"

# Sort by newest
curl "http://localhost:5000/api/products?sort=newest"
```

### With Pagination
```bash
# Page 1, 12 items per page (default)
curl "http://localhost:5000/api/products?page=1&limit=12"

# Page 2, 20 items per page
curl "http://localhost:5000/api/products?page=2&limit=20"
```

---

## 3. GET SINGLE PRODUCT (GET /api/products/:id)

```bash
# Replace PRODUCT_ID with actual MongoDB ObjectId
curl http://localhost:5000/api/products/PRODUCT_ID
```

**Example:**
```bash
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

---

## 4. GET FEATURED PRODUCTS

### Get Deal Products
```bash
curl http://localhost:5000/api/products/featured/deals
```

### Get New Products
```bash
curl http://localhost:5000/api/products/featured/new
```

### Get Best Sellers
```bash
curl http://localhost:5000/api/products/featured/bestsellers
```

---

## 5. UPDATE PRODUCT (PUT /api/products/:id)

### Update Basic Info
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Product Name",
    "description": "Updated description",
    "originalPrice": 299.99,
    "discount": 20
  }'
```

### Update Stock (Color Variant)
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "colorVariants": [
      {
        "color": "Black",
        "hexCode": "#000000",
        "images": [],
        "sizeStock": [
          { "size": "39", "stock": 10 },
          { "size": "40", "stock": 15 }
        ]
      }
    ]
  }'
```

### Update Accessory Stock
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accessoryStock": {
      "3": 20,
      "4": 30,
      "5": 40
    }
  }'
```

### Update Tags
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tags": ["New", "Deal", "Best Seller"]
  }'
```

---

## 6. UPDATE SPECIFIC STOCK (PATCH /api/products/:id/stock)

### Update Boot/Glove Stock (Specific Color & Size)
```bash
curl -X PATCH http://localhost:5000/api/products/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "colorIndex": 0,
    "sizeIndex": 2,
    "stock": 25
  }'
```

### Update Accessory Stock (Specific Size)
```bash
curl -X PATCH http://localhost:5000/api/products/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accessorySize": "4",
    "stock": 50
  }'
```

---

## 7. DELETE PRODUCT (DELETE /api/products/:id)

```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing with Postman

### Setup
1. Create a new collection called "Product API"
2. Add environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: Your JWT token

### Import Examples

Create requests for each endpoint above using:
- Method: GET/POST/PUT/PATCH/DELETE
- URL: `{{base_url}}/api/products`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body: Use the JSON examples above

---

## Expected Responses

### Success Responses

**Create Product (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Nike Mercurial Vapor 15 Elite FG",
  "price": 233.75,
  "countInStock": 35,
  "createdAt": "2024-01-15T10:30:00.000Z",
  ...
}
```

**Get Products (200):**
```json
{
  "products": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 58
}
```

**Update Product (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Product Name",
  ...
}
```

**Delete Product (200):**
```json
{
  "message": "Product deleted successfully"
}
```

### Error Responses

**Validation Error (400):**
```json
{
  "message": "Please provide all required fields: name, description, originalPrice, sku, category"
}
```

**Unauthorized (401):**
```json
{
  "message": "Not authorized, token failed"
}
```

**Forbidden (403):**
```json
{
  "message": "Access denied. Admin only."
}
```

**Not Found (404):**
```json
{
  "message": "Product not found"
}
```

**Server Error (500):**
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## Quick Test Checklist

- [ ] Create a boot product with multiple colors and sizes
- [ ] Create a glove product with adult and kids age groups
- [ ] Create an accessory (balls) with multiple sizes
- [ ] Create an accessory (tape) with "One Size"
- [ ] Get all products (no filters)
- [ ] Filter products by category
- [ ] Filter products by brand
- [ ] Filter products by tags
- [ ] Search products by name
- [ ] Sort products by price
- [ ] Get paginated results
- [ ] Get single product by ID
- [ ] Get featured deals
- [ ] Get featured new products
- [ ] Get featured bestsellers
- [ ] Update product basic info
- [ ] Update product stock
- [ ] Update specific color/size stock
- [ ] Delete a product
- [ ] Test admin authorization (should fail without admin token)
- [ ] Test validation errors (missing required fields)

---

## Notes

1. Replace `YOUR_JWT_TOKEN` with actual token from login
2. Replace `PRODUCT_ID` with actual MongoDB ObjectId
3. All prices are auto-calculated based on originalPrice and discount
4. Stock is auto-calculated from colorVariants or accessoryStock
5. Only published products appear in public GET requests
6. Admin check is enforced on all protected routes
