<template>
  <div>
    <v-container fluid class="pa-0">
      <v-card>
        <v-card-title class="titulo black--text">Editar Georeferencia {{ georeferenciaSeleccionada?.geo_id }}
        </v-card-title>
        <form @submit.prevent="submit">
          <v-card-text>
            <v-row>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="zonas" item-text="nombre" item-value="id"
                  v-model="georeferenciaSeleccionada.zona_id" label="Zonas *" :error-messages="errors.zona_id">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="entidad" item-text="nombre" item-value="id"
                  v-model="georeferenciaSeleccionada.entidad_id" label="Entidad *"
                  :error-messages="errors.entidad_id"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="municipios" item-text="nombre" item-value="id"
                  v-model="georeferenciaSeleccionada.municipio_id" label="Municipio *"
                  :error-messages="errors.municipio_id"></v-autocomplete>
              </v-col>
            </v-row>

            <p>Campos obligatorios *</p>

            <v-card-actions class="justify-end">
              <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar
              </v-btn>
              <v-btn color="boton" dark @click="editarGeorreferencia()">Editar</v-btn>
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
    if (!$can("contrato.georreferencia.editar")) {
      return redirect("/");
    }
  },

  props: {
    editar: Boolean,
    cup_id: Number,

    georeferenciaSeleccionada: {
      type: Object,
      default: () => { },
    },
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

    async getZonas() {
      try {
        const {
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


    async editarGeorreferencia() {
      try {
        this.limpiarError();
        const request = {
          zona_id: this.georeferenciaSeleccionada.zona_id,
          entidad_id: this.georeferenciaSeleccionada.entidad_id,
          municipio_id: this.georeferenciaSeleccionada.municipio_id,
        };
        this.preload = true;
        await this.$axios.put(`/georreferencia/actualizar/${this.georeferenciaSeleccionada.geo_id}`, this.georeferenciaSeleccionada);
        this.$toast.success("Se ha actualizado la Georreferencia Correctamente");
        this.cerrarModal();
        this.$emit('recargarDatos');
      } catch (error) {
        console.error(error);
        this.$toast.error( 'Ha ocurrido un Error al Editar la Georreferencia');
      }finally {
        this.preload = false;
      }
    },

    cerrarModal() {
      this.$emit('cerrar')
    }

  },
};

</script>
