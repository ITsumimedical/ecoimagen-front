<template>
  <div>
    <v-dialog v-model="mostrarModalCambioFecha" persistent max-width="600px">
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-calendar-alert"
          class="text-center"
        >
          <b>Adelantar Dispensación - Orden N° {{ orden?.id }}</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formCambioFechaDispensacion">
            <v-row dense>
              <v-col cols="12" md="12" sm="12">
                <v-alert
                  text
                  dense
                  border="left"
                  color="blue-grey"
                  icon="mdi-calendar-clock"
                  class="text-center"
                >
                  <b>Fecha de Vigencia Actual</b> -
                  {{ orden?.fecha_vigencia }}
                </v-alert>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-menu
                  dense
                  v-model="menuFecha"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formCambio.fecha_vigencia"
                      label="Nueva Fecha *"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                      :rules="fechaRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formCambio.fecha_vigencia"
                    @input="menuFecha = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
          <v-btn color="success" dark small @click="actualizarFechaVigencia()"
            >Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment"; // Asegúrate de tener moment.js instalado

export default {
  props: {
    mostrarModalCambioFecha: {
      type: Boolean,
      required: true,
    },
    orden: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      menuFecha: false,
      formCambio: {
        fecha_vigencia: null,
      },
      fechaRules: [
        (v) => !!v || "Este campo es requerido",
        (v) =>
          this.validarFechaNoMayorActual(v) ||
          "La nueva fecha no puede ser mayor a la Fecha de Vigencia Actual",
      ],
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    validarFechaNoMayorActual(fecha) {
      const fechaActualVigencia = moment(this.orden.fecha_vigencia); // Usamos moment.js para formato
      const fechaSeleccionada = moment(fecha);
      // Validar que la fecha seleccionada no sea mayor a la fecha de vigencia actual
      return (
        fechaSeleccionada.isBefore(fechaActualVigencia) ||
        fechaSeleccionada.isSame(fechaActualVigencia)
      );
    },

    cerrarModal() {
      this.formCambio.fecha_vigencia = null;
      this.$refs.formCambioFechaDispensacion.resetValidation();
      this.$emit("update:mostrarModalCambioFecha", false);
    },

    actualizarFechaVigencia() {
      if (!this.$refs.formCambioFechaDispensacion.validate()) {
        return;
      } else {
        this.setPreload(true);
        this.$axios
          .post(
            `/ordenamiento/actualizarFechaVigencia/${this.orden.id}`,
            this.formCambio
          )
          .then(() => {
            this.$toast.success("Fecha de vigencia actualizada");
            this.recargarOrdenes();
            this.cerrarModal();
          })
          .catch((e) => {
            console.log(e)
            this.$toast.error(
              "Ocurrió un error al actualizar la fecha de vigencia"
            );
          })
          .finally(() => {
            this.setPreload(false);
          });
      }
    },

    recargarOrdenes(){
      this.$emit("listarOrdenesProximas");
    }
  },
};
</script>
