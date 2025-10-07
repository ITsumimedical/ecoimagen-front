<template>
  <v-dialog v-model="mostrarCrearModal" persistent max-width="1200px">
    <v-card>
      <v-alert text dense border="left" type="info" icon="mdi-account-plus">
        <b>Crear nuevo usuario</b>
      </v-alert>
      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  v-model="nuevoUsuario.nombre"
                  label="Nombre(s) *"
                  :rules="rules.nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  v-model="nuevoUsuario.apellido"
                  label="Apellidos *"
                  :rules="rules.apellido"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select
                  v-model="nuevoUsuario.tipo_doc"
                  :items="tiposDocumento"
                  label="Tipo de documento *"
                  :rules="rules.tipo_doc"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  v-model="nuevoUsuario.documento"
                  label="No. Documento *"
                  :rules="rules.documento"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  v-model="nuevoUsuario.email_recuperacion"
                  label="Correo Electrónico Recuperación"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  v-model="nuevoUsuario.telefono_recuperacion"
                  label="Teléfono Recuperación"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="6">
                <v-autocomplete
                  :items="listaCargos"
                  v-model="nuevoUsuario.cargo_id"
                  :loading="loading.cargos"
                  label="Cargo *"
                  :search-input.sync="campoBusquedaCargo"
                  no-data-text="Digite el nombre del cargo para buscar."
                  item-text="nombre"
                  item-value="id"
                  :rules="rules.cargo_id"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="6">
                <v-autocomplete
                  :items="listaReps"
                  v-model="nuevoUsuario.reps_id"
                  label="Nit o Nombre de la sede del Prestador (Institución a la que pertenece el usuario)  *"
                  :search-input.sync="campoBusquedaRep"
                  :loading="loading.reps"
                  no-data-text="Digite el nombre de la sede para buscar."
                  item-text="nombre"
                  item-value="id"
                  :rules="rules.reps_id"
                  required
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="12" md="4">
                <v-checkbox
                  v-model="esPersonalMedico"
                  label="¿El usuario es personal médico?"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="12" md="4" v-if="esPersonalMedico">
                <v-text-field
                  v-model="nuevoUsuario.registro_medico"
                  label="Registro Medico"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4" v-if="esPersonalMedico">
                <v-file-input
                  v-model="nuevoUsuario.firma"
                  placeholder="Adjunte la firma del usuario."
                  label="Firma"
                  accept=".jpg, .jpeg, .png"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="primary">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-alert
                  text
                  dense
                  border="left"
                  type="success"
                  icon="mdi-account-cog"
                >
                  <b>Datos de ingreso a la plataforma</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nuevoUsuario.email"
                  label="Correo Electrônico *"
                  :rules="rules.email"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
        <v-btn color="success" small @click="submitForm">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    mostrarCrearModal: Boolean,
    usuario: Object,
  },
  data() {
    return {
      formValid: false,
      loading: {
        cargos: false,
        reps: false,
      },
      nuevoUsuario: {
        nombre: null,
        apellido: null,
        tipo_doc: null,
        documento: null,
        email_recuperacion: null,
        telefono_recuperacion: null,
        cargo_id: null,
        reps_id: null,
        email: null,
        registro_medico: null,
        firma: null,
      },
      tiposDocumento: ["CC", "CE", "NIT", "PA"],
      listaCargos: [],
      campoBusquedaCargo: null,
      campoBusquedaRep: null,
      listaReps: [],
      rules: {
        nombre: [(v) => !!v || "El nombre es requerido"],
        apellido: [(v) => !!v || "El apellido es requerido"],
        tipo_doc: [(v) => !!v || "El tipo de documento es requerido"],
        documento: [(v) => !!v || "El número de documento es requerido"],
        cargo_id: [(v) => !!v || "El cargo es requerido"],
        reps_id: [(v) => !!v || "La sede del prestador es requerida"],
        email: [
          (v) => !!v || "El correo electrónico es requerido",
          (v) => /.+@.+\..+/.test(v) || "El correo electrónico debe ser válido",
        ],
      },
      esPersonalMedico: false,
    };
  },
  watch: {
    campoBusquedaCargo(newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCargos();
      }
    },

    campoBusquedaRep(newVal) {
      if (newVal && newVal.length === 4) {
        this.listarReps();
      }
    },
  },
  methods: {
    cerrarModal() {
      this.limpiarNuevoUsuario();
      this.$refs.form.reset();
      this.$emit("update:mostrarCrearModal", false);
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        this.crearUsuario();
      }
    },
    crearUsuario() {
      this.$emit("crearUsuario", this.nuevoUsuario);
      this.limpiarNuevoUsuario();
      this.cerrarModal();
    },
    limpiarNuevoUsuario() {
      this.nuevoUsuario = {
        nombre: null,
        apellido: null,
        tipo_doc: null,
        documento: null,
        email_recuperacion: null,
        telefono_recuperacion: null,
        cargo_id: null,
        reps_id: null,
        email: null,
        registro_medico: null,
        firma: null,
      };

      this.esPersonalMedico = false;
    },
    listarCargos() {
      this.loading.cargos = true;
      this.$axios
        .get(`/cargo/listar`, {
          params: {
            campoBusqueda: this.campoBusquedaCargo,
          },
        })
        .then((res) => {
          this.listaCargos = res.data.data;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los cargos");
          console.log(error);
        })
        .finally(() => {
          this.loading.cargos = false;
        });
    },

    listarReps() {
      this.loading.reps = true;
      this.$axios
        .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
        .then((res) => {
          this.listaReps = res.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
            };
          });
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los reps");
          console.log(error);
        })
        .finally(() => {
          this.loading.reps = false;
        });
    },
  },
};
</script>
