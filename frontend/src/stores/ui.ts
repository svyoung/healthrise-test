import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    modal: {
      open: false,
  content: null
    },
    sidebarVisible: true,
  notifications: []
  }),
});
