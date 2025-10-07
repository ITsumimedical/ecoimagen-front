<template>
  <div>
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="abrirEnlace" v-bind="attrs" v-on="on" icon class="elevation-0">
          <v-img :src="imagenFinal" :max-width="anchoMaximo" :max-height="altoMaximo" contain />
        </v-btn>
      </template>
      <span class="text-center">
        ¿Necesitas ayuda?
        <br>
        Contacta a nuestro equipo de Soporte
      </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    imagenSrc: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: [Number, String],
      default: 40
    },
    maxHeight: {
      type: [Number, String],
      default: 40
    }
  },
  data() {
    return {
      isMobile: false,
      enlace:
        'https://wa.me/573165590970?text=%C2%A1Hola%21%2C%20te%20est%C3%A1s%20comunicando%20con%20el%20%C3%81rea%20de%20Soporte%20de%20Sumimedical.%0APor%20favor%2C%20cu%C3%A9ntame%20m%C3%A1s%20sobre%20el%20inconveniente%20que%20est%C3%A1s%20experimentando%20con%20la%20aplicaci%C3%B3n%2E'
    };
  },
  computed: {
    imagenFinal() {
      if (this.imagenSrc) return this.imagenSrc;

      return this.isMobile
        ? '/images/Hapi.png'
        : '/images/menu_inicio/botonChatW.png';
    },
    anchoMaximo() {
      return this.isMobile ? 80 : this.maxWidth;
    },
    altoMaximo() {
      return this.isMobile ? 80 : this.maxHeight;
    }
  },
  mounted() {
    this.actualizarEsMobile();
    window.addEventListener('resize', this.actualizarEsMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.actualizarEsMobile);
  },
  methods: {
    abrirEnlace() {
      window.open(this.enlace, '_blank');
    },
    actualizarEsMobile() {
      this.isMobile = window.innerWidth <= 600;
    }
  }
};
</script>
