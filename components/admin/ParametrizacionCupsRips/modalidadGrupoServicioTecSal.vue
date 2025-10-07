<template>
  <div>
    <v-alert color="blue-grey darken-1"  icon="mdi-file-code" text dense border="left"><b>Modalidades grupo tec sal</b></v-alert>
    <v-data-table :loading="loading" :disabled="loading" :items="modalidadDatos" :headers="headers" :search="buscar"
      dense>
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear()">
            Nuevo
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="warning" icon small @click="abrirDialogoEditar(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog max-width="900px" v-model="crearNuevaModalidad" persistent>
      <v-card>
        <v-alert text dense color="info" border="left" icon="mdi-checkbox-marked-circle-plus-outline">
          <b>{{ esEditar ? 'Editar modalidad' : 'Crear nueva modalidad' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Código" v-model="modalidad.codigo" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Nombre" v-model="modalidad.nombre" outlined dense></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="red" @click="cerrarDialog" dark>Cerrar</v-btn>
            <v-btn :loading="cargando" :disabled="cargando" small @click="guardarModalidad"
              :color="esEditar ? 'warning' : 'success'">
              {{ esEditar ? 'Actualizar' : 'Guardar' }}</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        buscar: '',
        modalidadDatos: [],
        loading: false,
        crearNuevaModalidad: false,
        esEditar: false,
        cargando: false,
        modalidad: {
          id: null,
          codigo: '',
          nombre: ''
        },
        headers: [{
            text: 'id',
            value: 'id'
          },
          {
            text: 'Código',
            value: 'codigo'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          }
        ]
      }
    },

    mounted() {
      this.listar();
    },

    methods: {
      abrirDialogoCrear() {
        this.esEditar = false;
        this.modalidad = {
          id: null,
          codigo: '',
          nombre: ''
        };
        this.crearNuevaModalidad = true;
      },

      abrirDialogoEditar(item) {
        this.esEditar = true;
        this.modalidad = {
          ...item
        };
        this.crearNuevaModalidad = true;
      },

      guardarModalidad() {
        if (this.esEditar) {
          this.actualizarModalidad();
        } else {
          this.crearModalidad();
        }
      },

      crearModalidad() {
        this.cargando = true;
        this.$axios.post('modalidadgrupoTec/crear', this.modalidad)
          .then(() => {
            this.$toast.success('Creado con éxito');
            this.crearNuevaModalidad = false;
            this.listar();
          })
          .catch(error => {
            console.log(error);
            this.$toast.error('Error al crear la modalidad');
          }).finally(res => {
            this.cargando = false;
          })
      },

      actualizarModalidad() {
        this.$axios.put(`modalidadgrupoTec/actualizar/${this.modalidad.id}`, this.modalidad)
          .then(() => {
            this.$toast.success('Actualizado con éxito');
            this.crearNuevaModalidad = false;
            this.listar();
          })
          .catch(error => {
            console.log(error);
            this.$toast.error('Error al actualizar la modalidad');
          });
      },

      listar() {
        this.loading = true;
        this.$axios.get('modalidadgrupoTec/listar')
          .then(res => {
            this.modalidadDatos = res.data;
          })
          .catch(error => {
            console.log(error);
            this.$toast.error('Error al listar modalidades');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      cerrarDialog( dark) {
        this.crearNuevaModalidad = false;
        this.modalidad = {
          id: null,
          codigo: '',
          nombre: ''
        }
       }
    }
  }

</script>
