<template>
    <v-container fluid class="pa-0 fill-height">
        <v-carousel v-if="imagenes.length" :show-arrows="true" cycle hide-delimiters height="100vh">
            <v-carousel-item v-for="(item, index) in imagenes" :key="'imagen-' + index">
                <v-img :src="item.url" :alt="item.nombre || `Imagen ${index + 1}`" class="imagen-carrusel" contain>
                    <template #placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="primary" />
                        </v-row>
                    </template>
                </v-img>
            </v-carousel-item>
        </v-carousel>

        <v-alert v-else type="info" dense border="left" icon="mdi-information-outline" class="ma-4">
            No hay imágenes informativas disponibles por el momento.
        </v-alert>
    </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "CarruselInformativo",
    data() {
        return {
            imagenes: [],
            loading: {
                tablaImagenes: false,
            },
        };
    },
    mounted() {
        this.listarImagenes();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarImagenes() {
            this.loading.tablaImagenes = true;
            this.$axios
                .get("imagenes-inicio/listarActivos")
                .then((res) => {
                    this.imagenes = res.data;
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al cargar las imágenes");
                })
                .finally(() => {
                    this.loading.tablaImagenes = false;
                });
        },
    },
};
</script>

<style scoped>
.v-carousel {
    height: 100vh;
}

.v-carousel .v-window-item {
    height: 100%;
}

.imagen-carrusel {
    width: 100%;
    height: 100%;
    object-fit: contain !important;
    object-position: center center;
}
</style>
