<template>
  <div>
    <v-alert border="left"  icon="mdi-file-code" color="blue-grey darken-1"  text dense><b>Codigo Servicios</b></v-alert>
    <v-data-table :loading="loading" :disabled="loading" :search="buscar" dense :items="codigos" :headers="headers">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear">
            Nuevo
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn small color="warning" icon @click="abrirDialogoEditar(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.estado_id == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstado(item)">
              {{ item.estado_id == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.estado_id == 1 ? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>

      <template v-slot:item.estadoNombre="{ item }">
        <v-chip :color="item.estadoNombre == 'Activo' ? 'green' : 'red' " dark>
          {{ item.estadoNombre }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog max-width="900px" v-model="codigoServicio" persistent>
      <v-card>
        <v-alert text dense color="info" border="left" icon="mdi-checkbox-marked-circle-plus-outline">
          <b>{{ esEditar ? 'Editar código de servicio' : 'Crear nuevo código de servicios' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Codigo" v-model="codigo.codigo" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Nombre" v-model="codigo.nombre" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Descripcion" v-model="codigo.descripcion" outlined dense></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="red" @click="limpiarDialog()">Cerrar</v-btn>
            <v-btn small :color="esEditar ? 'warning' : 'success'" @click="guardarCodigo">
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
        codigoServicio: false,
        codigos: [],
        esEditar: false,
        loading: false,
        codigo: {
          id: null,
          codigo: '',
          nombre: '',
          descripcion: ''
        },
        headers: [{
            text: 'id',
            value: 'id'
          },
          {
            text: 'Codigo',
            value: 'codigo'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Descripcion',
            value: 'descripcion'
          },
          {
            text: 'Estado',
            value: 'estadoNombre'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ]
      }
    },

    mounted() {
      this.listar()
    },

    methods: {
      abrirDialogoCrear() {
        this.codigo = {
          id: null,
          codigo: '',
          nombre: '',
          descripcion: ''
        };
        this.esEditar = false;
        this.codigoServicio = true;
      },

      abrirDialogoEditar(item) {
        this.codigo = {
          ...item
        };
        this.esEditar = true;
        this.codigoServicio = true;
      },

      guardarCodigo() {
        if (this.esEditar) {
          this.$axios.put(`codigoServicio/actualizar/${this.codigo.id}`, this.codigo)
            .then(() => {
              this.$toast.success('Actualizado con éxito');
              this.codigoServicio = false;
              this.listar();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$axios.post('codigoServicio/crear', this.codigo)
            .then(() => {
              this.$toast.success('Creado con éxito');
              this.codigoServicio = false;
              this.listar();
            })
            .catch(error => {
              console.log(error);
            });
        }
      },

      listar() {
        this.loading = true;
        this.$axios.get('codigoServicio/listar').then(res => {
          this.codigos = res.data;
        }).catch(error => {
          this.$toast.error(error);
        }).finally(res => {
          this.loading = false;
        })
      },

      cambiarEstado(item) {
        this.$axios.post(`codigoServicio/cambiarEstado/${item.id}`)
          .then(() => {
            this.$toast.success('Estado cambiado con éxito');
            this.listar();
          })
          .catch(error => {
            console.log(error);
          });
      },

      limpiarDialog() {
        this. codigo = {
          id: null,
          codigo: '',
          nombre: '',
          descripcion: ''
        },
        this.codigoServicio = false;
      }
    }
  }

</script>
