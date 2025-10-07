<template>
  <div>
    <v-alert color="blue-grey darken-1" icon="mdi-note-check" text dense border="left">
      <b>Finalidad Consulta</b>
    </v-alert>
    <v-data-table :loading="loading" :disabled="loading" :items="finalidades" :headers="headers" :search="buscar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogo()">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
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
        <v-icon color="warning" @click="abrirDialogo(item)">
          mdi-pencil
        </v-icon>
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

    <!-- Diálogo para Crear/Editar Finalidad -->
    <v-dialog v-model="dialogoAbierto" max-width="900px" persistent>
      <v-card>
        <v-alert text dense :color="editando ? 'warning' : 'success'">
          <b>{{ editando ? 'Editar Finalidad' : 'Crear Finalidad' }}</b>
        </v-alert>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Codigo" v-model="finalidad.codigo" outlined dense />
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="Nombre" v-model="finalidad.nombre" outlined dense />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="red" @click="limpiarDialog()">Cerrar</v-btn>
            <v-btn :color="editando ? 'warning' : 'success'" small dark @click="guardarFinalidad">
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
        buscar: '',
        dialogoAbierto: false,
        editando: false,
        loading: false,
        finalidad: {
          codigo: '',
          nombre: '',
        },
        finalidadOriginal: null,
        finalidades: [],
        headers: [{
            text: 'ID',
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
            text: 'Estado',
            value: 'estado'
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false
          }
        ]
      };
    },

    mounted() {
      this.listar();
    },

    methods: {
      abrirDialogo(finalidad = null) {
        if (finalidad) {
          this.editando = true;
          this.finalidad = {
            ...finalidad
          };
          this.finalidadOriginal = finalidad;
        } else {
          this.editando = false;
          this.finalidad = {
            codigo: '',
            nombre: ''
          };
        }
        this.dialogoAbierto = true;
      },

      guardarFinalidad() {
        const data = {
          codigo: this.finalidad.codigo,
          nombre: this.finalidad.nombre,
          estado_id: 1
        };

        if (this.editando) {
          this.$axios.put(`finalidadConsulta/actualizar/${this.finalidadOriginal.id}`, data)
            .then(res => {
              this.$toast.success('Finalidad actualizada con éxito');
              this.listar();
              this.dialogoAbierto = false;
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$axios.post('finalidadConsulta/crear', data)
            .then(res => {
              this.$toast.success('Finalidad creada con éxito');
              this.listar();
              this.dialogoAbierto = false;
            })
            .catch(error => {
              console.log(error);
            });
        }
      },

      listar() {
        this.loading = true;
        this.$axios.get('finalidadConsulta/listar').then(res => {
          this.finalidades = res.data;
        }).catch(error => {
          console.log(error);
        }).finally(res => {
          this.loading = false;
        })
      },

      cambiarEstado(item) {
        this.$axios.put(`finalidadConsulta/cambiarEstado/${item.id}`)
          .then(() => {
            this.$toast.success('Estado cambiado con éxito');
            this.listar();
          })
          .catch(error => {
            console.log(error);
          });
      },
      limpiarDialog() {
        this.finalidad = {
            codigo: '',
            nombre: '',
          },
          this.dialogoAbierto = false;
      }
    }
  };

</script>
