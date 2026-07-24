const fs = require('fs');

async function testUpload() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@roymallscents.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.data.accessToken) {
      console.error('Login failed', loginData);
      return;
    }
    const token = loginData.data.accessToken;

    // 2. Get products
    console.log('Fetching products...');
    const prodRes = await fetch('http://localhost:4001/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const prodData = await prodRes.json();
    if (!prodData.data || prodData.data.length === 0) {
      console.error('No products found', prodData);
      return;
    }
    const productId = prodData.data[0].id;
    console.log(`Found product ${productId}`);

    // 3. Upload image
    console.log('Uploading image...');
    
    // Create a dummy file
    fs.writeFileSync('dummy.jpg', 'fake image data');
    const fileBlob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('images', fileBlob, 'dummy.jpg');
    formData.append('isPrimary', 'true');

    const uploadRes = await fetch(`http://localhost:4001/api/products/${productId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const uploadText = await uploadRes.text();
    console.log(`Upload status: ${uploadRes.status}`);
    console.log(`Upload response: ${uploadText}`);
    
  } catch (e) {
    console.error(e);
  }
}

testUpload();
