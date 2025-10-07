<template>
  <div>
    <v-dialog v-model="mostrarModalNovedades" persistent max-width="800px">
      <v-card>
        <v-alert text dense border="left" type="info" icon="mdi-pen-plus">
          <b>Añadir Novedad</b>
        </v-alert>
        <v-card-text>
          <v-form ref="formRegistroNovedad">
            <v-row dense>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  label="Tipo de Novedad *"
                  :items="opcionesTiposNovedad"
                  item-text="nombre"
                  item-value="id"
                  v-model="formNovedad.tipo_novedad_id"
                  :loading="loading.tiposNovedad"
                  dense
                  outlined
                  :rules="[rules.obligatorio]"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-menu
                  dense
                  v-model="menuFechaNovedad"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formNovedad.fecha_novedad"
                      label="Fecha *"
                      append-icon="mdi-calendar"
                      readonly
                      dense
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.obligatorio]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formNovedad.fecha_novedad"
                    @input="menuFechaNovedad = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="12" md="12"
                ><v-textarea
                  label="Descripción *"
                  v-model="formNovedad.descripcion"
                  dense
                  outlined
                  :rules="[rules.obligatorio, rules.min, rules.max]"
                  auto-grow
                ></v-textarea
              ></v-col>
              <v-col cols="12" sm="12" md="12">
                <v-file-input
                  v-model="formNovedad.adjuntos"
                  counter
                  multiple
                  show-size
                  label="Adjuntar "
                  accept=".jpg, .jpeg, .pdf"
                  dense
                  outlined
                  small-chips
                  clearable
                  prepend-icon=""
                  append-icon="mdi-paperclip"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-alert border="left" colored-border type="error" dense>
                  Los archivos deben tener un tamaño máximo de 10MB -
                  Extensiones permitidas:<b><i>jpg jpeg pdf</i></b>
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
          <v-btn color="success" small @click="crearNovedad"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarModalNovedades: {
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
      opcionesTiposNovedad: [],
      loading: {
        tiposNovedad: false,
      },
      menuFechaNovedad: false,
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        min: (v) =>
          v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
        max: (v) =>
          v.length <= 350 || "Este campo debe tener como máximo 350 caracteres",
      },
      formNovedad: {
        afiliado_id: null,
        tipo_novedad_id: null,
        fecha_novedad: "",
        descripcion: "",
        adjuntos: [],
      },
    };
  },
  watch: {
    mostrarModalNovedades(newValue) {
      if (newValue) {
        this.listarTiposNovedaded();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarTiposNovedaded() {
      this.loading.tiposNovedad = true;
      this.$axios
        .get("/tipo-novedad-afiliado")
        .then((res) => {
          this.opcionesTiposNovedad = res.data.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los tipos de novedades");
        })
        .finally(() => {
          this.loading.tiposNovedad = false;
        });
    },

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit("update:mostrarModalNovedades", false);
    },

    limpiarFormulario() {
      this.formNovedad = {
        afiliado_id: null,
        tipo_novedad_id: null,
        fecha_novedad: "",
        descripcion: "",
        adjuntos: [],
      };

      this.$refs.formRegistroNovedad.resetValidation();
    },

    crearNovedad() {
      if (!this.$refs.formRegistroNovedad.validate()) {
        return;
      }

      const formData = new FormData();

      formData.append("afiliado_id", this.afiliado.id);
      formData.append("fecha_novedad", this.formNovedad.fecha_novedad);
      formData.append("tipo_novedad_id", this.formNovedad.tipo_novedad_id);
      formData.append("motivo", this.formNovedad.descripcion);
      formData.append("actualizacionTotal", 1);

      if (this.formNovedad.adjuntos.length > 0) {
        this.formNovedad.adjuntos.forEach((file) => {
          formData.append("adjuntos[]", file);
        });
      }

      this.setPreload(true);

      this.$axios
        .post(`/novedad-afiliado/crear/${this.afiliado.id}`, formData)
        .then((res) => {
          this.$toast.success("Novedad guardada con éxito!");
          this.$emit("buscarNovedadesAfiliado");
          this.limpiarFormulario();
          this.cerrarModal();
        })
        .catch((error) => {
            console.log(error)
          this.$toast.error("Error al registrar la novedad");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
