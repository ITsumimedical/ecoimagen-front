<template>
    <div class="contenedor-principal">
        <a class="link-completo" href="https://wa.me/573165590970" target="_blank" rel="noopener noreferrer">
            <v-img class="fondo-imagen" src="/images/menu_inicio/large-MANUALES-Y-VIDEOS-.png"
                alt="Imagen de manuales y videos" cover />
        </a>

        <div class="contenedor-novedades" aria-hidden="false">
            <v-btn class="boton-novedades" elevation="0" tile @click="mostrarModal = true">
                <v-img src="/images/menu_inicio/large-BOTON-CONOCE-LAS-NOVEDADES.png" alt="Botón novedades" width="360"
                    contain />
            </v-btn>
        </div>

        <v-dialog v-model="mostrarModal" fullscreen persistent>
            <v-card>
                <v-toolbar flat color="white">
                    <v-toolbar-title class="text-h6 font-weight-bold">
                        <v-icon color="primary" class="mr-2">mdi-book-information-variant</v-icon>
                        Manuales y Videos
                    </v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="mostrarModal = false">
                        <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-container fluid>
                        <v-row>
                            <!-- Manuales -->
                            <v-col cols="12" md="6">
                                <v-card flat>
                                    <v-card-title>
                                        <v-icon color="primary" class="mr-2">mdi-book-open-page-variant-outline</v-icon>
                                        <span class="text-h6 font-weight-medium">Manuales</span>
                                    </v-card-title>

                                    <p class="mb-4">Aquí encontrarás guías detalladas para cada funcionalidad</p>
                                    <v-divider class="mb-3" />
                                    <div v-for="item in manuales" :key="'m-' + item.id" class="mb-4">
                                        <p class="text-body-1 font-weight-regular mb-1">{{ item.nombre }}</p>
                                        <div class="d-flex justify-end">
                                            <v-btn elevation="0" color="primary" small class="text-none"
                                                @click="descargarManual(item.url)">
                                                <v-icon left size="18">mdi-file-eye</v-icon>
                                                Visualizar manual
                                            </v-btn>
                                        </div>
                                        <v-divider class="my-3" />
                                    </div>
                                </v-card>
                            </v-col>

                            <!-- Videos -->
                            <v-col cols="12" md="6">
                                <v-card flat>
                                    <v-card-title>
                                        <v-icon color="primary" class="mr-2">mdi-movie-open-play-outline</v-icon>
                                        <span class="text-h6 font-weight-medium">Videos</span>
                                    </v-card-title>

                                    <p class="mb-4">Aquí encontrarás videos explicativos sobre el uso de la plataforma
                                    </p>
                                    <v-divider class="mb-3" />
                                    <div v-for="item in videos" :key="'v-' + item.id" class="mb-4">
                                        <p class="text-body-1 font-weight-regular mb-1">{{ item.nombre }}</p>
                                        <div class="d-flex justify-end">
                                            <v-btn elevation="0" color="primary" small :href="item.url" target="_blank"
                                                class="text-none">
                                                <v-icon left size="18">mdi-play-circle</v-icon>
                                                Reproducir video
                                            </v-btn>
                                        </div>
                                        <v-divider class="my-3" />
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data() {
        return {
            mostrarModal: false,
            videos: [],
            manuales: [],
        };
    },
    watch: {
        mostrarModal(val) {
            if (val) this.cargarContenido();
        },
    },
    mounted() {
        window.addEventListener("resize", this.handleResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        handleResize() {
            this.$forceUpdate();
        },
        async cargarContenido() {
            this.setPreload(true);
            try {
                const [videosRes, manualesRes] = await Promise.all([
                    this.$axios.get("/videos/listarActivos"),
                    this.$axios.get("/manuales/listarActivos"),
                ]);
                this.videos = videosRes.data;
                this.manuales = manualesRes.data;
            } catch (error) {
                this.$toast.error("Error al cargar manuales y videos");
            } finally {
                this.setPreload(false);
            }
        },
        async descargarManual(ruta) {
            try {
                this.setPreload(true);
                const adj = await this.$adjuntos(ruta);
                const blob = new Blob([adj[1]], { type: adj[0] });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error("Ocurrió un error al descargar el manual");
            } finally {
                this.setPreload(false);
            }
        },
    },
};
</script>

<style scoped>
:root {
    --topbar-height: 64px;
}

.contenedor-principal {
    position: relative;
    width: 100%;
    height: calc(100vh - var(--topbar-height));
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.link-completo {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
    text-decoration: none;
    color: inherit;
}

.fondo-imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    max-width: 100%;
    max-height: 100%;
    background-color: #fff;
}

.contenedor-novedades {
   position: absolute;
    top: 82%;
    left: 70%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    justify-content: center;
}

.boton-novedades {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    min-width: 0;
}

@media (max-width: 600px) {
    .contenedor-principal {
        height: calc(100vh - var(--topbar-height));
    }

    .fondo-imagen {
        object-fit: contain;
        max-height: 100%;
    }

    .contenedor-novedades {
        right: 5%;
        bottom: 1.2rem;
    }
}
</style>
