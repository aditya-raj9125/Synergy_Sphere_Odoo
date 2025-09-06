const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing SynergySphere API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration Success:', registerResponse.data);
    console.log('');

    // Test 3: User Login
    console.log('3. Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Login Success:', loginResponse.data);
    const token = loginResponse.data.token;
    console.log('');

    // Test 4: Create Project
    console.log('4. Testing Project Creation...');
    const projectData = {
      title: 'Test Project',
      description: 'This is a test project'
    };
    
    const projectResponse = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Project Created:', projectResponse.data);
    const projectId = projectResponse.data.id;
    console.log('');

    // Test 5: Create Task
    console.log('5. Testing Task Creation...');
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      projectId: projectId,
      priority: 'high'
    };
    
    const taskResponse = await axios.post(`${BASE_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Task Created:', taskResponse.data);
    console.log('');

    // Test 6: Get All Projects
    console.log('6. Testing Get Projects...');
    const projectsResponse = await axios.get(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Projects Retrieved:', projectsResponse.data.length, 'projects');
    console.log('');

    // Test 7: Get All Tasks
    console.log('7. Testing Get Tasks...');
    const tasksResponse = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Tasks Retrieved:', tasksResponse.data.length, 'tasks');
    console.log('');

    console.log('🎉 All API tests passed successfully!');
    console.log('Your backend is working perfectly! 🚀');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\nMake sure:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database migration is complete');
    console.log('3. Server is running on port 5000');
  }
}

testAPI();
