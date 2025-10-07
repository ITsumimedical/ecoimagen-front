<template>
  <div>
    <v-card>
      <v-alert text dense color="success" border="left" icon="mdi-plus-circle-multiple-outline">
        <b>Agregar nuevo código propio</b>
      </v-alert>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="9" md="9">
            <v-autocomplete dense label="Buscar Servicios" outlined v-model="codigoPropio.codigo_propio_id"
              no-data-text="Digite el nombre o código para iniciar la búsqueda" :search-input.sync="campoBusqueda"
              :items="codigosPropios" item-text="CodigoNombre" :loading="loading" item-value="id" />
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field label="Cantidad" type="number" outlined dense v-model="codigoPropio.cantidad"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field label="Fecha vigencia" type="date" outlined dense v-model="codigoPropio.fecha_vigencia">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="9" md="9">
            <v-text-field label="Observación" outlined dense v-model="codigoPropio.observacion"></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small dark @click="cerrarDialog">Cerrar</v-btn>
          <v-btn color="success" @click="agregarCodigoPropio()" :loading="loading" small>Agregar</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    articulo: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      campoBusqueda: '',
      loading: false,
      codigosPropios: [],
      codigoPropio: {
        codigo_propio_id: '',
        cantidad: '',
        fecha_vigencia: '',
        observacion: ''
      }
    }
  },
  watch: {
    campoBusqueda: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCodigosPropios();
      }
    },
  },
  methods: {
    listarCodigosPropios() {
      this.loading = true;
      this.$axios
        .get(`/codigo-propio/BuscarCodigoPropio/${this.campoBusqueda}`)
        .then((res) => {
          this.codigosPropios = res.data.original;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los códigos propios");
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    agregarCodigoPropio() {
      const data = {
        codigo_propio_id: this.codigoPropio.codigo_propio_id,
        cantidad: this.codigoPropio.cantidad,
        fecha_vigencia: this.codigoPropio.fecha_vigencia,
        observacion: this.codigoPropio.observacion
      };
      this.loading = true;
      this.$axios.post('ordenamiento/agregarCodigoPropio/' + this.articulo.id, data).then(() => {
        this.$toast.success('Agregado con exito');
        this.$emit('codigo-agregado');
        this.loading = false;
      }).catch(error => {
        this.$toast.error(error.response ?.data ?.Error);
        this.loading = false;
      })
    },
    cerrarDialog() {
      // Limpiar los campos
      this.codigoPropio = {
        codigo_propio_id: '',
        cantidad: '',
        fecha_vigencia: '',
        observacion: ''
      };
      this.campoBusqueda = '';
      // Cerrar el diálogo
      this.$emit('close-dialog');
    }
  }
}
</script>
