<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarArea" :items="areas" sort-by="id"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.estado_id`]="{ item }">
        <v-chip small :color="chipEstado(item.estado_id)" dark>{{ item.estado_id == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('areaTh.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="excel" color="success" dark v-bind="attrs" v-on="on">
                mdi-file-excel
              </v-icon>
            </template>
            <span>Exportar áreas</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <!-- <v-text-field v-model="buscarArea" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field> -->
        </v-card-title>
        <v-dialog v-model="dialog" max-width="500px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-grey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarAreasTh">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field dense v-model="area.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarAreasTh()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('areaTh.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarAreasTh()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarAreasTh,
    guardarAreasTh,
    actualizarAreasTh,
  } from '@/api/areasTh/areaTh'
  import {
    descargarFile
  } from '@/api/descargar'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('areaTh.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonAreasTh',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarArea: '',
        areas: [],
        area: {
          nombre: '',
          estado_id: ''
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
        },
        errors: {
          nombre: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Estado',
            value: 'estado_id'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarAreasTh();

    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear área talento humano' : 'Editar área talento humano'
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
        this.limpiarError()
      },

      excel() {
        this.$axios({
          method: 'get',
          url: '/areasTh/exportar',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'areasTh.xlsx';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
            this.dialog = false
          this.clear();
        }).catch(err => {
            console.log(err)
        })
      },

      async listarAreasTh() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarAreasTh(this.paginate.page))
          this.areas = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipEstado(estado_id) {
        if (estado_id == '1') return 'info'
        else if (estado_id == '0') return 'elerta'
        else return 'warning'
      },

      async guardarAreasTh() {
        this.limpiarError()
        this.area.estado_id = 1
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarAreasTh(this.area.id), this.area)
            this.$toast.success(data.mensaje)
            this.listarAreasTh()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        } else {
          try {
            const {
              data
            } = await this.$loadingPostRequest(guardarAreasTh(), this.area)
            this.$toast.success(data.mensaje)
            this.listarAreasTh()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        }

      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      editar(item) {
        this.editedIndex = this.areas.indexOf(item)
        this.area = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
