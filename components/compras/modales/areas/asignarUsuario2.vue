<template>
    <div>
      <v-card :loading="loadingReps">
        <v-alert icon="mdi-home-group" text dense color="info" border="left">
          <b>Agregar usuarios al area {{ area.id }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete label="Usuarios" dense outlined v-model="user.rep" :search-input.sync="busquedaRep"
                :items="reps" item-text="nombre_completo" item-value="id"
                no-data-text="Ingresa 4 dígitos para realizar la búsqueda" @input="agregarRepArray" :loading="loading" />
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-alert text dense color="blue-grey" border="bottom"><b>Usuarios Asociados</b></v-alert>

          <v-chip-group column>
            <v-chip v-for="rep in repSeleccionado" :key="rep.id" close @click:close="eliminarRep(rep.id)">
              {{ rep.nombre }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="cerrarDialog">Cerrar</v-btn>
          <v-btn color="success" small dark @click="guardarReps" :loading="loadingGuardar">Guardar</v-btn>
        </v-card-actions>

      </v-card>
    </div>
  </template>

  <script>
  export default {
    props: {
      area: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        user: {
          rep: ''
        },
        reps: [],
        repSeleccionado: [],
        busquedaRep: null,
        loading: false,
        loadingReps: false,
        loadingGuardar: false
      };
    },
    watch: {
      busquedaRep(val) {
        if (val) {
          if (val.length === 4) {
            this.buscarReps();
          } else if (val.length < 4) {
            this.reps = null;
          }
        } else {
          this.reps = null;
        }
      }
    },

    methods: {
      buscarReps() {
        this.loading = true;
        this.$axios.get(`/operador/listar`).then(res => {
          this.reps = res.data;
        }).catch(err => {
          this.$toast.error('Error al buscar los reps');
          console.error(err);
        }).finally(() => {
          this.loading = false;
        });
      },

      agregarRepArray() {
        const rep = this.reps.find(item => item.id === this.user.rep);
        if (rep && !this.repSeleccionado.some(r => r.id === rep.id)) {
          this.repSeleccionado.push(rep);
          this.user.rep = '';
        }
      },

      eliminarRep(repId) {
        this.repSeleccionado = this.repSeleccionado.filter(rep => rep.id !== repId);
      },

      guardarReps() {
        const repIds = this.repSeleccionado.map(rep => rep.id);
        this.loadingGuardar = true;
        this.$axios.post(`/proveedores-compras/proveedores-lineas`, this.area.id).then(res => {
          this.$toast.success('Reps agregados correctamente');
          this.cerrarDialog()
        }).catch(err => {
          this.$toast.error('Error al guardar los reps');
          console.error(err);
        }).finally(() => {
          this.loadingGuardar = false;
        })
      },

      cargarReps() {
        this.loadingReps = true;
        this.$axios.get(`/usuarios/obtenerReps/${this.usuarios}`).then(res => {
          this.repSeleccionado = res.data;
        }).catch(err => {
          this.$toast.error('Error al cargar los reps');
          console.error(err);
        }).finally(() => {
          this.loadingReps = false
        })
      },

      cerrarDialog() {
        this.$emit('cerrar')
      }
    }
  }
  </script>
