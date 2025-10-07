<template>
  <div>

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

    <v-card flat>
      <v-data-table key="id" dense :headers="headers" :search="buscar" :items="viasAdministracion" sort-by="id"
        class="elevation-1" :loading="loading" loading-text="Cargando..."
        no-data-text="Sin datos para mostrar">
        <template v-slot:top>
          <v-card-title>
            <v-btn small color="boton" class="mb-2 white--text" @click="nuevo = true">
              Nuevo
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details
              single-line></v-text-field>
          </v-card-title>
        </template>


      <template v-slot:[`item.codigo`]="{ item }">
        <v-chip small label  :color="item.codigo ? 'warning' : ''">
            {{ item.codigo || 'Codigo no registrado' }}
        </v-chip>
      </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" dark v-bind="attrs" v-on="on" @click="eliminar(item.id)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>
        </template>
      </v-data-table>
    </v-card>


    <v-dialog v-model="nuevo" max-width="600" persistent>
      <v-card>
            <v-alert dense text border="bottom" color="info" icon="mdi-pill-multiple"><b>Crear Via de Administracion</b>
            </v-alert>
          <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" dense outlined v-model="via_administracion.nombre">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Código" v-model="via_administracion.codigo" dense outlined>
            </v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarNuevo" dark>
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearViaAdministracion()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editarDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon="mdi-pill-multiple"><b>Editar Via de Administracion</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="viaEditar.nombre">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Código" v-model="viaEditar.codigo">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="editarDialog = false" dark>
            Cerrar
          </v-btn>
          <v-btn color="orange" small dark @click="actualizarViaAdministracion()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

export default {
  data() {
    return {
      preload: false,
      buscar: '',
      nuevo: false,
      loading: false,
      editarDialog: false,
      viasAdministracion: [],
      pagina: 1,
      total: 0,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      via_administracion: {
        id: '',
        nombre: '',
        codigo: ''
      },
      viaEditar: {
        nombre: '',
        codigo: ''
      },
      headers: [
        {
          text: 'Id',
		  sortable: false,
          value: 'id'
        },
        {
          text: 'Nombre',
		  sortable: false,
          value: 'nombre'
        },
        {
            text:'Código',
            value: 'codigo'
        },
        {
          text: 'Acciones',
		  sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  mounted() {
    this.listarVias()
  },

  methods: {

    cerrarNuevo() {
      this.nuevo = false,
        this.via_administracion = {
          nombre: '',
          codigo: ''
        }
    },

    listarVias() {
      this.preload = true;
      this.$axios.get('/vias-administracion/listar')
        .then(res => {
          this.viasAdministracion = res.data;
          this.preload = false;
        })
        .catch(error => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    crearViaAdministracion() {
      this.preload = true;
      this.$axios.post('/vias-administracion/crear', this.via_administracion)
        .then(() => {
          this.preload = false;
          this.nuevo = false;
          this.$toast.success('La vía de administración se ha creado correctamente.');
          this.via_administracion.nombre = '';
          this.listarVias();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    actualizarViaAdministracion() {
      this.preload = true;
      this.$axios.put(`/vias-administracion/actualizar/${this.viaEditar.id}`, this.viaEditar)
        .then(() => {
          this.preload = false;
          this.editarDialog = false;
          this.viaEditar.nombre = '';
          this.$toast.success('La vía de administración se ha actualizado correctamente.');
          this.listarVias();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    editar(item) {
      this.viaEditar = { ...item };
      this.editarDialog = true;
    },

    eliminar(item) {
            return this.$swal({
                title: "Atención!",
                text: "¿Está seguro de eliminar esta forma farmacéutica?",
                type: "warning",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
            }).then((res) => {
                if (res.value) {
                    this.$axios.delete(`vias-administracion/eliminar/${item}`).then(() => {
                        this.$toast.success('Forma Farmaceutica eliminada correctamente');
                        this.listarVias();
                    })
                }
            }).catch((error) => {
                this.$toast.error('Error al eliminar la forma farmaceutica');
                console.log(error.response.data.error)
            })
        }

  }
}


</script>
