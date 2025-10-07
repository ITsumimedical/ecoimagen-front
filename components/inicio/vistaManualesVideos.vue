<template>
  <div class="container">
    <div class="columna1">
      <img src="@/static/images/hola_hapi.png" alt="Sumi" class="persona" />
    </div>
    <div class="columna2">
      <img
        src="@/static/images/texto.png"
        alt="Texto"
        class="texto"
      />
      <div class="contenedor_botones">
        <img
          @click="abrirBoletinModal()"
          src="@/static/images/BotonBoletinSumi.png"
          alt="Boletin"
          class="botonSumi"
        />
        <img
          @click="abrirVideosModal()"
          src="@/static/images/BotonVideosSumi.png"
          alt="Videos"
          class="botonSumi"
        />
        <img
          @click="abrirManualesModal()"
          src="@/static/images/BotonManualesSumi.png"
          alt="Manuales"
          class="botonSumi"
        />
      </div>
      <img
        src="@/static/images/LogoHorusSumiColor.png"
        alt="Logo"
        class="logo_sumi"
      />
    </div>

    <modal-vista-boletines
      :mostrarModalBoletines.sync="mostrarModalBoletines"
    />

    <modal-vista-videos :mostrarModalVideos.sync="mostrarModalVideos" />

    <modal-vista-manuales :mostrarModalManuales.sync="mostrarModalManuales" />

  </div>
</template>

<script>
import modalVistaBoletines from "@/components/inicio/modalVistaBoletines.vue";
import modalVistaVideos from "@/components/inicio/modalVistaVideos.vue";
import modalVistaManuales from "@/components/inicio/modalVistaManuales.vue";

export default {
  data() {
    return {
      mostrarModalBoletines: false,
      mostrarModalVideos: false,
      mostrarModalManuales: false,
    };
  },
  components: {
    modalVistaBoletines,
    modalVistaVideos,
    modalVistaManuales,
  },
  methods: {
    abrirBoletinModal() {
      this.mostrarModalBoletines = true;
    },
    abrirVideosModal() {
      this.mostrarModalVideos = true;
    },
    abrirManualesModal() {
      this.mostrarModalManuales = true;
    },
  },
};
</script>

<style scoped>
.container {
  width: 100vw; /* Ancho completo de la ventana */
  height: 90vh; /* Alto completo de la ventana */

  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-image: url('/images/fondo-horus.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.columna1 {
  width: 50rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
}

.columna2 {
  width: 50rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

@media (max-width: 819px) {
  .columna1 {
    display: none;
  }

  .columna2 {
    width: 100vw;
    height: auto;
    padding: 0;
    flex-direction: column;
    justify-content: flex-start;;
    gap: 1rem;
    align-items: center;
  }
  .persona {
    width: 100%;
    height: auto;
	margin-bottom: 14px;
  }

  .texto {
    width: 100vw;
    height: auto;
  }

  .logo_sumi {
    width: 35%;
    height: auto;
  }
}

.persona {
  width: 75%;
  height: 90%;
  margin-bottom: 14px;

}

.texto {
  width: 90%;
  margin-bottom: 0.5rem;
  height: auto;
}

.logo_sumi {
  width: 25%;
  height: auto;
}

.contenedor_botones {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: transparent !important;
  margin-top: 0.5rem;
}

.botonSumi {
  width: 80%;
  height: auto;
  background-color: transparent !important;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.botonSumi:hover {
  transform: scale(1.05);
}

.botonSumi:active {
  transform: scale(0.95);
}
</style>
