import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('@/views/Shop.vue')
        },
        {
          path: 'product/:id',
          name: 'product',
          component: () => import('@/views/ProductDetail.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/Cart.vue')
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/Checkout.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue')
        },
        {
          path: 'google/callback',
          name: 'google-callback',
          component: () => import('@/views/auth/GoogleCallback.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'admin',
          name: 'admin-dashboard',
          component: () => import('@/views/dashboard/admin/AdminDashboard.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'admin/users',
          name: 'admin-users',
          component: () => import('@/views/dashboard/admin/Users.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'admin/products',
          name: 'admin-products',
          component: () => import('@/views/dashboard/admin/Products.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'admin/orders',
          name: 'admin-orders',
          component: () => import('@/views/dashboard/admin/Orders.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'admin/categories',
          name: 'admin-categories',
          component: () => import('@/views/dashboard/admin/Categories.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'admin/settings',
          name: 'admin-settings',
          component: () => import('@/views/dashboard/admin/Settings.vue'),
          meta: { role: 'admin' }
        },
        {
          path: 'merchant',
          name: 'merchant-dashboard',
          component: () => import('@/views/dashboard/merchant/MerchantDashboard.vue'),
          meta: { role: 'merchant' }
        },
        {
          path: 'merchant/products',
          name: 'merchant-products',
          component: () => import('@/views/dashboard/merchant/Products.vue'),
          meta: { role: 'merchant' }
        },
        {
          path: 'merchant/orders',
          name: 'merchant-orders',
          component: () => import('@/views/dashboard/merchant/Orders.vue'),
          meta: { role: 'merchant' }
        },
        {
          path: 'user',
          name: 'user-dashboard',
          component: () => import('@/views/dashboard/user/UserDashboard.vue')
        },
        {
          path: 'user/orders',
          name: 'user-orders',
          component: () => import('@/views/dashboard/user/Orders.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/Profile.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  // Check if route requires specific role
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect to appropriate dashboard based on user's actual role
    if (authStore.isAdmin) {
      next({ path: '/dashboard/admin' })
    } else if (authStore.isMerchant) {
      next({ path: '/dashboard/merchant' })
    } else if (authStore.user) {
      next({ path: '/dashboard/user' })
    } else {
      next({ name: 'home' })
    }
    return
  }
  
  // Prevent users from accessing other role dashboards
  const path = to.path
  if (authStore.user) {
    if (path.startsWith('/dashboard/admin') && !authStore.isAdmin) {
      next({ path: authStore.isMerchant ? '/dashboard/merchant' : '/dashboard/user' })
      return
    }
    if (path.startsWith('/dashboard/merchant') && !authStore.isMerchant) {
      next({ path: authStore.isAdmin ? '/dashboard/admin' : '/dashboard/user' })
      return
    }
    if (path.startsWith('/dashboard/user') && (authStore.isAdmin || authStore.isMerchant)) {
      next({ path: authStore.isAdmin ? '/dashboard/admin' : '/dashboard/merchant' })
      return
    }
  }
  
  next()
})

export default router
