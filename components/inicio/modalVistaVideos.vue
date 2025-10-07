<template>
  <v-dialog v-model="mostrarModalVideos" max-width="900px" persistent>
    <v-card>
      <v-alert
        text
        dense
        border="left"
        type="info"
        icon="mdi-movie-open-play-outline"
      >
        <b>Videos</b>
      </v-alert>
      <v-card-text>
        <div v-for="item in videos" :key="item.id">
          <div class="fila_texto">
            <p class="text-body-1">{{ item.nombre }}</p>
            <v-btn
              elevation="0"
              color="primary"
              small
              :href="item.url"
              target="_blank"
              >Visualizar</v-btn
            >
          </div>

          <v-divider></v-divider>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalVideos: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      videos: [],
    };
  },
  watch: {
    mostrarModalVideos(newValue) {
      if (newValue) {
        this.buscarVideos();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$emit("update:mostrarModalVideos", false);
    },

    buscarVideos() {
      this.setPreload(true);
      this.$axios
        .get("/videos/listarActivos")
        .then((response) => {
          this.videos = response.data;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los videos");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
<style scoped>
.fila_texto {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
</style>
