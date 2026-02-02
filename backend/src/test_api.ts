
import axios from 'axios';

async function testApi() {
    try {
        const divisiId = 1;
        console.log(`Testing /api/hr/departments/by-divisi/${divisiId}...`);
        const response = await axios.get(`http://localhost:3000/api/hr/departments/by-divisi/${divisiId}`);
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);
        } else {
            console.error(err);
        }
    }
}

testApi();
