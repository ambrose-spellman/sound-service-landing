import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        contacts: "contacts.html",
        modal1: "modal1.html",
        modal2: "modal2.html",
      },
    },
  },
});
