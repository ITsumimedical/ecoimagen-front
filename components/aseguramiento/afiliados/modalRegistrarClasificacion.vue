<template>
  <div>
    <v-dialog
      v-model="mostrarModalClasificaciones"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-account-multiple"
        >
          <b>Añadir Clasificación</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formRegistrarClasificacion">
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  :items="opcionesClasificacion"
                  v-model="formClasificaciones.clasificacion_id"
                  label="Clasificación *"
                  dense
                  outlined
                  :rules="[
                    () =>
                      !!formClasificaciones.clasificacion_id ||
                      'Este campo es requerido',
                  ]"
                  item-text="nombre"
                  item-value="id"
                  :loading="loading.opcionesClasificacion"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
          <v-btn color="success" small @click="crearClasificacion">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalClasificaciones: {
      type: Boolean,
      default: false,
    },
    afiliado: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: {
        opcionesClasificacion: false,
      },
      opcionesClasificacion: [],
      formClasificaciones: {
        clasificacion_id: null,
      },
    };
  },
  watch: {
    mostrarModalClasificaciones(newValue) {
      if (newValue) {
        this.listarClasificaciones();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$refs.formRegistrarClasificacion.resetValidation();
      this.$emit("update:mostrarModalClasificaciones", false);
    },

    listarClasificaciones() {
      this.loading.opcionesClasificacion = true;

      this.$axios
        .get("/clasificacion")
        .then((res) => {
          this.opcionesClasificacion = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar las clasificaciones");
        })
        .finally(() => {
          this.loading.opcionesClasificacion = false;
        });
    },

    limpiarFormulario() {
      this.formClasificaciones = {
        clasificacion_id: null,
      };
    },

    crearClasificacion() {
      if (!this.$refs.formRegistrarClasificacion.validate()) {
        return;
      }

      const formData = new FormData();

      formData.append("afiliado_id", this.afiliado.id);
      formData.append(
        "clasificacion_id",
        this.formClasificaciones.clasificacion_id
      );

      this.setPreload(true);

      this.$axios
        .post("afiliacion-clasificacion/crear", formData)
        .then((res) => {
          this.$toast.success("Clasifiación guardada con exito!");
          this.listarClasificaciones();
          this.$emit("buscarClasificacionesAfiliado");
          this.limpiarFormulario();
          this.cerrarModal();
        })
        .catch((error) => {
            console.log(error)
          if (
            error.response.data.mensaje ===
            "El afiliado ya se encuentra con esta clasificación."
          ) {
            this.$toast.error(error.response.data.mensaje);
          } else {
            this.$toast.error("Error al guardar la clasificación");
          }
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
