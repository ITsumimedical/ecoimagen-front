<template>
    <v-carousel height="auto" width="100%" show-arrows-on-hover  cycle>
        <v-carousel-item v-for="(item, i) in filteredItems" :key="i">
            <v-img v-if="item.type === 'image'" :src="item.src" width="100%" height="auto" contain></v-img>
            <component v-else :is="item.component"></component>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
    import vistaManualesVideos from "@/components/inicio/vistaManualesVideos.vue";

    export default {
        components: {
            vistaManualesVideos,
        },
        data() {
            return {
                items: [{
                        type: "component",
                        component: "vistaManualesVideos"
                    }, // Este siempre debe mostrarse
                ],
                loading: {
                    tablaImagenes: false,
                },
                 imagenes: [],
                isMobile: window.innerWidth < 768, // Detectar si es móvil al cargar la página
            };
        },
        computed: {
            filteredItems() {
                const combinedItems = [...this.items, ...this.imagenes];

                return combinedItems.filter((item) => {
                    if (item.type === "component") {
                        return true;
                    }
                    return (
                        (item.mobile && this.isMobile) || (!item.mobile && !this.isMobile)
                    );
                });
            },
        },
        mounted() {
            this.listarImagenes();
            window.addEventListener("resize", this.handleResize);
        },
        beforeDestroy() {
            // Limpiar el listener al evento resize cuando se destruya el componente
            window.removeEventListener("resize", this.handleResize);
        },
        methods: {
            handleResize() {
                // Actualizar el valor de isMobile según el nuevo tamaño de la pantalla
                this.isMobile = window.innerWidth < 768;
            },

            async listarImagenes() {
                this.loading.tablaImagenes = true;
                try {
                    const res = await this.$axios.get("imagenes-inicio/listarActivos");
                    const adjuntos = res.data;

                    for (let adjunto of adjuntos) {

                        await this.consultarAdjunto(adjunto.url);
                    }
                } catch (e) {
                    this.$toast.error("Ocurrió un error al cargar las imágenes");
                } finally {
                    this.loading.tablaImagenes = false;
                }
            },
            async consultarAdjunto(ruta) {
                try {
                    let adj = await this.$adjuntos(ruta);
                    let blob = new Blob([adj[1]], {
                        type: adj[0],
                    });
                    let url = window.URL.createObjectURL(blob);

                    this.imagenes.push({
                        type: "image",
                        src: url,
                        mobile: false,
                    });
                } catch (error) {
                    console.log(error.Response);
                }
            },
        },
    };

</script>
