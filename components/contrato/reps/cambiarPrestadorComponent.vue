<template>
  <div>
    <v-card>
      <v-alert icon="mdi-swap-horizontal" color="info" text dense border="left"><b>Cambiar Prestador</b></v-alert>
      <v-card-text>
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete label="Prestadores" v-model="prestador_id" dense outlined :items="prestadores"
            :search-input.sync="buscarPrestadores" :loading="loading" item-text="nombre_prestador"
            no-data-text="Ingresa 4 digitos para realizar la búsqueda" item-value="id"></v-autocomplete>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarDialogo()">Cerrar</v-btn>
          <v-btn color="success" small @click="actualizarPrestador()" :loading="loading" :disabled="loading">Guardar</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      rep_id: {
        type: Number,
        required: true
      },
      getReps: {
        type: Function,
        required: true
      },
      cerrar: {
        type: Function,
        required: true
      },
    },
    data() {
      return {
        prestador_id: '',
        buscarPrestadores: '',
        prestadores: [],
        loading: false
      }
    },

    watch: {
      buscarPrestadores(val) {
        if (val) {
          if (val.length === 4) {
            this.loading = true;
            this.listarPrestadores(val);
          } else if (val.length <= 4) {
            this.prestadores = [];
            this.loading = false;
          }
        } else {
          this.prestadores = [];
          this.loading = false;
        }
      }
    },

    methods: {
      listarPrestadores(nombre) {
        this.$axios.post('prestador/listar', {
            nombre: nombre
          })
          .then(response => {
            if (response.data && response.data.data) {
              this.prestadores = response.data.data;
            } else {
              this.prestadores = [];
            }
            this.loading = false;
          })
          .catch(error => {
            this.$toast.error(error.response ? error.response.data.message : error.message);
            this.loading = false;
          })
      },

      actualizarPrestador() {
        if(this.prestador_id === '') {
          return this.$toast.error('Completa todos los campos requeridos por favor')
        }
        this.loading = true;
        this.$axios.put(`reps/actualizar/${this.rep_id}/${this.prestador_id}`)
          .then(res => {
            this.$toast.success(res.data.message);
            this.getReps();
            this.cerrarDialogo();
          })
          .catch(error => {
            this.$toast.error(error.response ? error.response.data.message : error.message);
          }).finally(res => {
            this.loading = false;
          })
      },

      cerrarDialogo() {
        this.prestador_id = '';
        this.buscarPrestadores = '';
        this.prestadores = [];
        this.cerrar();
      }
    }
  }

</script>
