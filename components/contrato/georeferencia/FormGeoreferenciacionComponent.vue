<template>
  <div>
    <v-container fluid class="pa-0">
      <v-card>
        <v-card-title class="titulo black--text">{{ editar ? "Editar" : "Crear" }} Georeferencia
        </v-card-title>
        <form @submit.prevent="submit">
          <v-card-text>
            <v-row>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="zonas" item-text="nombre" item-value="id" v-model="form.zona_id" label="Zonas *" :error-messages="errors.zona_id">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="entidad" item-text="nombre" item-value="id" v-model="form.entidad_id"
                  label="Entidad *" :error-messages="errors.entidad_id"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="municipios" item-text="nombre" item-value="id" v-model="form.municipio_id"
                  label="Municipio *" :error-messages="errors.municipio_id"></v-autocomplete>
              </v-col>
            </v-row>

            <p>Campos obligatorios *</p>

            <v-card-actions class="justify-end">
              <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar
              </v-btn>
              <v-btn color="boton" dark type="submit">Guardar</v-btn>
            </v-card-actions>
          </v-card-text>
        </form>
        <!-- Preload -->
        <template>
          <div class="text-center">
            <v-dialog v-model="preload" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Tranquilo procesamos tu solicitud !
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  middleware({
    $can,
    redirect
  }) {
    if (!$can("contrato.georreferencia.crear")) {
      return redirect("/");
    }
  },
  name: "FormCup",

  props: {
    editar: Boolean,
    cup_id: Number,
  },

  watch: {
    cup_id() {
      if (this.editar) {
        this.getCup();
      }
    },
  },

  data() {
    return {
      form: {
        zona_id: null,
        entidad_id: null,
        municipio_id: null,
      },
      zonas: [],
      entidad: [],
      municipios: [],
      errors: {
        zona_id: null,
        entidad_id: null,
        municipio_id: null,
      },
      preload: null,
    };
  },

  mounted() {
    if (this.editar) {
      this.getCup();
    }
    this.getZonas();
    this.listarEntidades();
    this.getMunicipios();
  },

  methods: {
    async submit() {
      this.limpiarError();
      const request = {
        zona_id: this.form.zona_id,
        entidad_id: this.form.entidad_id,
        municipio_id: this.form.municipio_id,
      };
      await this.$axios.post("/georreferencia", request).then(res => {
        this.$toast.success("La georreferencia se creo correctamente.");
        this.limpiar();
        this.$emit("cerrar");
      }).catch(error => {
        console.log(error.response)
        this.ErrorEntrada(error.response.data);
        this.$toast.error(error.response.data.mensaje);
      });
    },

    async getMunicipios() {
      try {
        const {
          data
        } = await this.$axios.get("/municipios/listar");
        this.municipios = data;
      } catch (error) {
        this.$toast.error("Problemas al consultar los municipios.");
      }
    },

    async getZonas(){
      try {
        const{
          data
        } = await this.$axios.get("/zonas/listar");
        this.zonas = data.filter(zona => zona.estado !== false);
      } catch (error) {
        this.$toast.error("Error al cargar las Zonas");

      }
    },

    limpiar() {
      for (const key in this.form) {
        this.form[key] = "";
      }
      this.limpiarError();
    },

    /**
     * listar entidades
     * @return objeto entidades
     * @author kobatime
     */
    listarEntidades() {
      this.preload = true;
      this.$axios.post('/entidad/listar').then(
        res => {
          this.entidad = res.data;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
    },

    ErrorEntrada(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(",");
        }
      }
    },

    limpiarError() {
      for (const key in this.errors) {
        this.errors[key] = "";
      }
    },



  },
};

</script>
