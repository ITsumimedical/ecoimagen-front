<template>
  <div>
    <v-dialog
      v-model="mostarServicioSolicitaModal"
      persistent
      max-width="1200px"
    >
      <v-card>
        <v-alert text dense border="left" type="info" icon="mdi-medical-bag">
          <b>Servicio para el cual se solicita la referencia</b>
        </v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                dense
                v-model="formServicio.servicio"
                :items="listaServicios"
                label="Seleccione un servicio"
                outlined
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
          <v-btn color="success" small @click="actualizarServicioSolicita"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    mostarServicioSolicitaModal: Boolean,
    consulta: Object,
  },
  data() {
    return {
      loading: {
        selectorServicios: false,
      },
      formServicio: {
        servicio: null,
      },
      listaServicios: [
        "ALERGOLOGIA",
        "ANESTESIOLOGIA",
        "AUDIOLOGIA",
        "BIOENERGETICA",
        "CARDIOLOGIA",
        "CIRUGIA BARIATRICA",
        "CIRUGIA CARDIOVASCULAR",
        "CIRUGIA GENERAL",
        "CIRUGIA MAXILOFACIAL",
        "CIRUGIA PLASTICA",
        "COLOPROCTOLOGIA",
        "COORDINACION MEDICA",
        "DERMATOLOGIA",
        "ENDOCRINOLOGIA",
        "GINECOLOGIA Y OBSTETRICIA",
        "HEMATOLOGIA",
        "INFECTOLOGIA",
        "MASTOLOGIA",
        "MEDICINA DEL DEPORTE",
        "MEDICINA DEL DOLOR",
        "MEDICINA DEL TRABAJO",
        "MEDICINA FAMILIAR",
        "MEDICINA FISICA Y REHABILITACION",
        "MEDICINA GENERAL",
        "MEDICINA INTERNA",
        "NEFROLOGIA",
        "NEUMOLOGIA",
        "NEUROCIRUGIA",
        "NEUROLOGIA",
        "ODONTOLOGIA",
        "OFTALMOLOGIA",
        "ONCOLOGIA CLINICA",
        "ORTOPEDIA Y TRAUMATOLOGIA",
        "OTORRINOLARINGOLOGIA",
        "PEDIATRIA",
        "PSIQUIATRIA",
        "REUMATOLOGIA",
        "SALUD FAMILIAR",
        "TOXICOLOGIA CLINICA",
        "UROLOGIA",
      ],
    };
  },
    computed: {
        servicioAsignado() {
            if (this.consulta && this.consulta.especialidad) {
            return this.consulta.especialidad;
            }
            return null;
        },
        },
        watch: {
        servicioAsignado(newVal) {
            this.formServicio.servicio = newVal;
        },
    },

  methods: {
    limpiarFormServicios() {
      this.formServicio = {
        servicio: null,
      };
    },

    cerrarModal() {
      this.limpiarFormServicios();
      this.$emit("update:mostarServicioSolicitaModal", false);
    },

    actualizarServicioSolicita() {
      if (this.formServicio.servicio == null) {
        return this.$toast.error("Debe seleccionar un Servicio");
      }

      const data = {
        consulta_id: this.consulta.id,
        servicio_solicita_referencia: this.formServicio.servicio,
      };

      this.$emit("actualizarServicioSolicita", data);
      this.cerrarModal();
    },
  },
};
</script>