import { createRouter, createWebHistory } from 'vue-router'
import signupRouter from '@/components/signUp.vue'
import signinRouter from '@/components/signIn.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/signup',
      name: 'signup',
      component: signupRouter
    },
    {
      path: '/signin',
      name: 'signin',
      component: signinRouter
    },
  ]
})

export default router
