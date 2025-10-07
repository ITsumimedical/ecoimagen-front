<template>
  <div>
    <v-dialog v-model="mostrarModalEspecialidad" persistent max-width="700px">
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-account-star-outline"
          class="text-center"
        >
          <b>Cambiar Especialidad</b>
        </v-alert>
        <v-card-text>
          <v-alert text dense border="left" type="success">
            <b>Especialidad Actual</b>
            <br />
            {{ telesalud?.especialidad?.nombre }}
          </v-alert>
          <v-form ref="formCambioEspecialidad">
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="formEspecialidad.especialidad_id"
                  :items="opcionesEspecialidades"
                  :loading="loading.especialidades"
                  :rules="[(v) => !!v || 'Este campo es requerido']"
                  item-text="nombre"
                  item-value="id"
                  dense
                  label="Especialidad"
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
          <v-btn color="success" dark small @click="cambiarEspecialidad()">
            Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalEspecialidad: {
      type: Boolean,
      default: false,
    },
    telesalud: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      opcionesEspecialidades: [],
      loading: {
        especialidades: false,
      },
      formEspecialidad: {
        especialidad_id: null,
      },
    };
  },

  watch: {
    mostrarModalEspecialidad(newVal) {
      if (newVal) {
        this.listarEspecialidades();
      }
    },
  },

  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarModalEspecialidad", false);
    },

    limpiarFormulario() {
      this.formEspecialidad = {
        especialidad_id: null,
      };
      this.$refs.formCambioEspecialidad.resetValidation();
    },

    listarEspecialidades() {
      this.loading.especialidades = true;
      this.$axios
        .post("/especialidades/listar")
        .then((res) => {
          // Filtrar las especialidades por IDs específicos y excluir la especialidad actual
          const idsPermitidos = [34, 11, 15, 19, 8, 25];
          this.opcionesEspecialidades = res.data.filter((especialidad) => {
            return (
              idsPermitidos.includes(especialidad.id) &&
              especialidad.id !== this.telesalud?.especialidad?.id
            );
          });
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al cargar las especialidades");
        })
        .finally(() => {
          this.loading.especialidades = false;
        });
    },

    cambiarEspecialidad() {
      if (!this.$refs.formCambioEspecialidad.validate()) {
        return;
      }

      this.setPreload(true);
      this.$axios
        .post(`/telesalud/actualizarEspecialidad/${this.telesalud.id}`, {
          especialidad_id: this.formEspecialidad.especialidad_id,
        })
        .then((res) => {
          this.$toast.success("Especialidad actualizada exitosamente");
          this.limpiarFormulario();
          this.$emit("recargarTelesalud", this.telesalud);
          this.cerrarModal();
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al cambiar la especialidad");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
