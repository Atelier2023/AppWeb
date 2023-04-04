import { createRouter, createWebHistory } from 'vue-router'
import signupRouter from '@/components/signUp.vue'
import signinRouter from '@/components/signIn.vue'
import logoutRouter from '@/components/logOut.vue'
import createEventRouter from '@/components/createEvent.vue'
import homePageRouter from '@/components/homePage.vue'
import oneEventRouter from '@/components/oneEvent.vue'
import sharedEventRouter from '@/components/sharedEvent.vue'

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
    {
      path: '/logout',
      name: 'logout',
      component: logoutRouter
    },
    {
      path: '/createEvent',
      name: 'createEvent',
      component: createEventRouter
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePageRouter
    }, 
    {
      path: '/oneEvent/:id',
      name: 'oneEvent',
      component: oneEventRouter
    }, 
    {
      path: '/shared/:id',
      name: 'sharedEvent',
      component: sharedEventRouter
    },
  ]
})

export default router
