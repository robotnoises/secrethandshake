'use strict';

const filesComponent = { template: '<div>files!</div>' };
const settingsComponent = { template: '<div>settings!</div>' };

const router = new VueRouter({
  routes: [
    { 
      path: '/files',
      name: 'files',
      components: {
        default: filesComponent
      }
    },
    {
      path: '/settings',
      name: 'settings',
      components: {
        default: settingsComponent
      }
    },
    { path: '*', component: filesComponent }
  ]
});

const sh = new Vue({
	router
}).$mount('#sh');
