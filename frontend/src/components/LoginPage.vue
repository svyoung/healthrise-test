<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Login</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="flex items-center">
          <label class="w-24 text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Login
        </button>
      </form>

      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  
  const username = ref('')
  const password = ref('')
  const errorMessage = ref('')
  
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth/login', {
        username: username.value,
        password: password.value,
      })
  
      localStorage.setItem('token', res.data.token)
  
      router.push('/')
    } catch (err) {
      errorMessage.value = 'Invalid username or password'
    }
  }
  </script>