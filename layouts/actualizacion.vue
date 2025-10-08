<template>
  <v-app dark>
    <!-- <v-navigation-drawer v-model="drawer" app floating class="elevation-1" :right="$vuetify.rtl" width="260">
      <template v-slot:prepend>
        <div class="d-flex pa-2 align-center">
          <img src="/images/v-logoEcoimagen.png" height="48" alt="logo" class="mr-1" />
          <div>
            <div class="title font-weight-bold text-uppercase primario--text">
              FOMAG
            </div>
            <div class="overline sumimedical--text" style="line-height: 0rem">
              Plataforma salud
            </div>
          </div>
        </div>
        <v-divider class="mb-1"></v-divider>
      </template>
    </v-navigation-drawer> -->
    <v-container grid-list-md fluid class="pa-2">
      <Nuxt />
    </v-container>
    <v-footer app inset>
      <div class="overline">Copyright © {{ new Date().getFullYear() }}</div>
      <v-spacer></v-spacer>
      <div class="overline">
        Hecho con el <v-icon small color="pink">mdi-heart</v-icon> En
        <a href="#">HORUS-HEALTH</a>
      </div>
    </v-footer>

    <!-- preload global-->
    <transition name="fade">
      <PreloadComponent v-if="preload" />
    </transition>
  </v-app>
</template>

<script>
import PreloadComponent from "@/components/helpers/PreloadComponent.vue";
import { mapState } from "vuex";

export default {
  components: {
    PreloadComponent,
  },
  data() {
    return {
      modalChat: false,
      fixed: false,
      drawer: true,
      showSearch: false,
      right: true,
      rightDrawer: false,
      items: this.$menu,
    };
  },
  computed: {
    ...mapState("app", ["preload"]),
  },
  methods: {
    redireccionar(ruta) {
      this.$router.push(ruta);
      this.$refs.miga.reset();
    },
  },
};
</script>
