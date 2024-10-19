import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeSearch from '../views/HomeSearch.vue'
import CaseView from "../views/CaseView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/:id",
      name: "homesearch",
      component: HomeSearch,
    },
    {
      path: "/:id/:case",
      name: "Case",
      component: CaseView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },

  ]
})

export default router
