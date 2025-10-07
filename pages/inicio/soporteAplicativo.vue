<template>
    <v-carousel height="100vh" hide-delimiters show-arrows-on-hover class="carousel-full">

        <!-- Imagen inicial -->
        <v-carousel-item>
            <div class="contenedor-principal">
                <div class="imagen-wrapper">
                    <v-img src="/images/menu_inicio/large-ESTAMOS-AQUI-PARA-AYUDARTE.png"
                        alt="Imagen de soporte técnico"
                        class="imagen-full" contain>
                    </v-img>

                    <a href="https://wa.me/573165590970?text=Hola" target="_blank" rel="noopener">
                        <img src="/images/menu_inicio/botonChatW.png" alt="WhatsApp" class="btn-chat-imagen" />
                    </a>
                </div>
            </div>
        </v-carousel-item>

        <!-- Carrusel de boletines -->
        <v-carousel-item v-for="(item, index) in boletines" :key="'boletin-' + index">
            <v-img :src="item.url" :alt="item.nombre" class="imagen-full" contain />
        </v-carousel-item>
    </v-carousel>
</template>

<script>
export default {
    data() {
        return {
            boletines: [],
        };
    },
    mounted() {
        this.buscarBoletines();
    },
    methods: {
        buscarBoletines() {
            this.$axios
                .get('imagenes-soporte/listarActivos')
                .then((response) => {
                    this.boletines = response.data;
                })
                .catch(() => {
                    this.$toast.error('Ocurrió un error al cargar los boletines');
                });
        },
    },
};
</script>

<style scoped>
.carousel-full {
    height: 100vh !important;
}

.contenedor-principal {
    position: relative;
    width: 100%;
    height: 100%;
}

.imagen-full {
 width: 100%;
    height: auto;
}

.btn-chat-imagen {
     position: absolute;
    top: 70%;           /* ajusta según quieras que esté sobre la imagen */
    left: 15%;             /* ajusta según diseño */
    max-width: 25%;
    height: auto;
    z-index: 5;
    cursor: pointer;
}

.btn-chat-imagen:hover {
    transform: translateY(-50%) scale(1.05);
}

.imagen-wrapper {
    position: relative;
    width: 100%;
    height: auto;         /* se ajusta al tamaño real de la imagen */
    display: inline-block;
}
@media (min-width: 1200px) {
    .imagen-full {
        width: 100%;
        height: auto;
        max-width: none;
    }
}


@media (min-width: 768px) and (max-width: 1199px) {
    .imagen-full {
        width: 110%;
        height: auto;
    }
}
</style>
