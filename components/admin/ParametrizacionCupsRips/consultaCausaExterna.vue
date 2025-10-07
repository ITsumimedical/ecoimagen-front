<template>
  <div>
    <v-alert text dense icon="mdi-note-check" color="blue-grey darken-1" border="left"><b>Consulta Causa Externa</b>
    </v-alert>

    <v-data-table :loading="loading" :disabled="loading" :search="buscar" :items="consultas" :headers="headers">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogo()">
            Nuevo
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line />
        </v-card-title>
      </template>

      <template v-slot:item.estado="{ item }">
        <v-chip :color="item.estado == 'Activo' ? 'green' : 'red'" dark>
          {{ item.estado }}
        </v-chip>
      </template>
      <template v-slot:item.acciones="{ item }">
        <v-btn color="warning" icon small @click="abrirDialogo(item)">
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
    </v-data-table>

    <v-dialog v-model="consultaExterna" max-width="900px" persistent>
      <v-card>
        <v-alert text dense :color="editando ? 'warning' : 'success'">
          <b>{{ editando ? 'Editar Consulta Causa Externa' : 'Crear Consulta Causa Externa' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Codigo" v-model="consulta.codigo" dense outlined></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Nombre" v-model="consulta.nombre" dense outlined></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="red" @click="limpiarDialog()">Cerrar</v-btn>
            <v-btn :color="editando ? 'warning' : 'success'" small @click="guardarConsulta()">
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </v-btn>
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
        consultaExterna: false,
        consultas: [],
        loading: false,
        consulta: {
          codigo: '',
          nombre: ''
        },
        buscar: '',
        editando: false,
        headers: [{
            text: 'Id',
            value: 'id'
          }, {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Codigo',
            value: 'codigo'
          },
          {
            text: 'Estado',
            value: 'estado'
          },
          {
            text: 'Acciones',
            value: 'acciones'
          }
        ]
      };
    },

    mounted() {
      this.listar();
    },

    methods: {
      abrirDialogo(item = null) {
        if (item) {
          this.editando = true;
          this.consulta = {
            ...item
          };
        } else {
          this.editando = false;
          this.consulta = {
            codigo: '',
            nombre: ''
          };
        }
        this.consultaExterna = true;
      },

      guardarConsulta() {
        const data = {
          codigo: this.consulta.codigo,
          nombre: this.consulta.nombre,
          estado_id: 1
        };

        if (this.editando) {
          this.$axios.put(`consultaCausaExterna/actualizar/${this.consulta.id}`, data)
            .then(res => {
              this.$toast.success('Actualizada con éxito');
              this.listar();
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$axios.post('consultaCausaExterna/crear', data)
            .then(res => {
              this.$toast.success('Creada con éxito');
              this.listar();
            })
            .catch(error => {
              console.log(error);
            });
        }
        this.consultaExterna = false;
      },

      listar() {
        this.loading = true;
        this.$axios.get('consultaCausaExterna/listarConsulta')
          .then(res => {
            this.consultas = res.data;
          })
          .catch(error => {
            console.log(error);
          }).finally(res => {
            this.loading = false;
          })
      },

      limpiarDialog() {
        this.consultaExterna = false;
        this.consulta = {
          codigo: '',
          nombre: ''
        }
      },

      cambiarEstado(item) {
        this.$axios.put(`consultaCausaExterna/cambiarEstado/${item.id}`)
          .then(() => {
            this.$toast.success('Estado cambiado con éxito');
            this.listar();
          })
          .catch(error => {
            console.log(error);
          });
      },
    }
  }

</script>
