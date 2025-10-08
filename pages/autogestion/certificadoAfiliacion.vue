<template>
  <div>
    <v-card>
      <v-alert
        border="left"
        dense
        text
        type="info"
        icon="mdi-note-check"
        class="text-center"
      >
        <b>CERTIFICADO DE AFILIACIÓN</b>
      </v-alert>
      <v-card-text v-if="afiliado">
        <!-- FOMAG -->
        <v-row dense v-if="afiliado.entidad.id === 1">
          <v-col cols="12" sm="12" md="12">
            <p class="text-body-1">
              Señor(a)
              <b>
                {{ $store.state.auth.usuario.datosAfiliado.nombre_completo }}</b
              >
              , aquí podrá descargar su Certificado de Afiliación.
            </p>
            <pre>{{ $store.state.auth.usuario.datosAfiliado.estado }}</pre>
          </v-col>
          <v-col cols="12" sm="12" md="12" class="text-right">
            <v-btn @click="certificadoAfiliacion()" small color="success"
              >Descargar<v-icon right small>mdi-download</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- Ferrocarriles -->
        <v-row dense v-if="afiliado.entidad.id === 3">
          <v-col cols="12" sm="12" md="12">
            <p class="text-body-1">
              Señor(a)
              <b>
                {{ $store.state.auth.usuario.datosAfiliado.nombre_completo }}</b
              >
              , aquí podrá descargar su Certificado de Afiliación.
            </p>
            <pre>{{ $store.state.auth.usuario.datosAfiliado.estado }}</pre>
          </v-col>
          <v-col cols="12" sm="12" md="12" class="text-right">
            <v-btn @click="certificadoAfiliacion()" small color="success"
              >Certificado de Afiliación<v-icon right small
                >mdi-download</v-icon
              >
            </v-btn>
            <v-btn @click="certificadoGrupoFamiliar()" small color="warning"
              >Certificado del Grupo Familiar<v-icon right small
                >mdi-download</v-icon
              >
            </v-btn>
          </v-col>
        </v-row>
        <!-- Los demás -->
        <v-row
          dense
          v-if="afiliado.entidad.id !== 1 && afiliado.entidad.id !== 3"
        >
          <v-col cols="12" sm="12" md="12">
            <v-alert border="left" dense text type="info" icon="mdi-alert">
              Señor usuario, en este momento no se puede imprimir su
              certificado de afiliación.
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      afiliado: null,
    };
  },
  created() {
    this.buscarAfiliado();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    buscarAfiliado() {
      const tipoDocumento =
        this.$store.state.auth.usuario.datosAfiliado.tipo_documento;
      const numeroDocumento =
        this.$store.state.auth.usuario.datosAfiliado.numero_documento;

      this.setPreload(true);
      this.$axios
        .get(`/afiliados/${numeroDocumento}/${tipoDocumento}`)
        .then((res) => {
          this.afiliado = res.data;
        })
        .catch(() => {
          this.$toast.error("Ocurrió un error al obtener sus datos.");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    certificadoAfiliacion() {
      let data = {
        numero_documento: this.afiliado.numero_documento,
        tipo_documento: this.afiliado.tipo_documento.nombre,
        primer_nombre: this.afiliado.primer_nombre,
        primer_apellido: this.afiliado.primer_apellido,
        estado: this.afiliado.estado_afiliado.nombre,
        tipo_afiliado: this.afiliado.tipo_afiliado_id,
        ips: this.afiliado.ips.nombre,
      };

      this.setPreload(true);
      this.$axios
        .post("/certificado/crear", data)
        .then((res) => {
          this.generarPdf();
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al generar el certificado");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    generarPdf() {
      const data = {
        id: this.afiliado.id,
      };

      const ruta =
        this.afiliado.entidad.id === 1
          ? "certificado/pdf"
          : "certificado/certificadoAfiliadoFerro";

      this.setPreload(true);
      this.$axios
        .post(ruta, data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.target = "_blank"; // Abrir en una nueva pestaña
          document.body.appendChild(link); // Añadir el enlace al DOM
          link.click(); // Simular un clic en el enlace
          document.body.removeChild(link); // Eliminar el enlace del DOM
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al generar el certificado");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    certificadoGrupoFamiliar() {
      const data = {
        id: this.afiliado.id,
      };

      this.setPreload(true);
      this.$axios
        .post("certificado/certificadoFamiliarFerro", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.target = "_blank"; // Abrir en una nueva pestaña
          document.body.appendChild(link); // Añadir el enlace al DOM
          link.click(); // Simular un clic en el enlace
          document.body.removeChild(link); // Eliminar el enlace del DOM
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al generar el certificado");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
