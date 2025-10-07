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
    <v-data-table dense :headers="headers" :search="buscar" :items="areas" sort-by="id" disable-pagination
      loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">

      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="750px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert dense type="info" border="left" text>{{titulo}}</v-alert>
              <form @submit.prevent="guardarArea">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field dense v-model="area.nombre" label="Nombre">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea auto-grow dense v-model="area.descripcion" label="Descripción">
                      </v-textarea>
                    </v-col>
                    <v-col cols="12" sm="4" md="2">
                      <v-checkbox label="Visible" v-model="area.visible"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarArea()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>

      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small :color="item.activo ? 'green' : 'red'" dark>{{ item.activo ? 'Activo' : 'Inactivo' }}</v-chip>
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
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.activo ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
              @click="cambiarEstadoArea(item)">
              {{ item.activo ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
            </v-icon>
          </template>
          <span>{{ item.activo ? 'Desactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.valor_visible`]="{ item }">
        <v-chip small :color="item.visible ? 'green' : 'red'" dark>{{ item.visible ? 'Si' : 'No' }}</v-chip>
      </template>
    </v-data-table>
    <v-row no-gutters style="background-color: white;">
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarArea">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarArea()">
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.pqrsf.menu')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonAreaMesaAyuda',

    data() {
      return {
        preload: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscar: '',
        areas: [],
        area: {
          nombre: '',
          descripcion: '',
          visible: false,
          activo: false // Asegúrate de tener este campo
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          descripcion: '',
          visible: false,
          activo: false // Asegúrate de tener este campo
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'ID',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Estado',
            value: 'activo'
          },
          {
            text: 'Descripción',
            value: 'descripcion'
          },
          {
            text: 'Visible',
            value: 'valor_visible'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        areas: [],
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
      };
    },

    mounted() {
      this.listarArea();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Creación de área' : 'Actualización de área'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      }
    },

    methods: {
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.area = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
      },

      listarArea() {
        this.preload = true
        this.$axios.post('/area-mesa-ayuda/listar?page=' + this.pagina + '&cant=' + this.opcionActual).then(res => {
          this.areas = res.data.data
          this.total = res.data.last_page;
          this.preload = false
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
          this.preload = false
        })
      },

      guardarArea() {
        if (this.editedIndex > -1) {
          this.preload = true
          this.$axios.put('/area-mesa-ayuda/actualizar/' + this.area.id, this.area).then(res => {
            this.$toast.success('Se ha actualizado el área exitosamente!.')
            this.listarArea()
            this.close()
            this.preload = false
          }).catch(error => {
            this.preload = false
          })
        } else {
          this.preload = true
          this.$axios.post('/area-mesa-ayuda/crear', this.area).then(res => {
            this.$toast.success('Se ha creado el área exitosamente!.')
            this.listarArea()
            this.close()
            this.preload = false
          }).catch(error => {
            this.preload = false
            if (error.response.data.mensaje) {
              this.$toast.error('No se ha podido crear el área')
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
      },

      cambiarEstadoArea(item) {
        this.preload = true
        this.$axios.post(`/area-mesa-ayuda/cambiarEstado/${item.id}`).then(res => {
          this.$toast.success('Estado del área actualizado exitosamente.')
          this.listarArea()
          this.preload = false
        }).catch(error => {
          this.$toast.error('Error al cambiar el estado del área.')
          this.preload = false
        })
      },

      editar(item) {
        this.editedIndex = this.areas.indexOf(item)
        this.area = Object.assign({}, item)
        this.dialog = true
      },
    },
  };
</script>
