<template>
  <div>
    <v-data-table :headers="headers" :search="buscarTipoEvento" :items="tiposEventos" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarTipoEvento" dense label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text outlined type="info" icon="mdi-download-lock" class="text-center"><b>
          {{titulo}}</b></v-alert>
              <form @submit.prevent="guardarTipoEvento">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field dense v-model="tipoEvento.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete dense :items="areas" v-model="tipoEvento.clasificacion_area_id"
                          :error-messages="errors.clasificacion_area_id" item-text="nombre" item-value="id"
                          label="Clasificación de área">
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" small @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn color="boton" small dark @click="guardarTipoEvento()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
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
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarTiposEventos()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarTiposEventos,
    guardarTipoEvento,
    actualizarTipoEvento,
  } from '@/api/tipoEventos/tipoEvento'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonTipoEventoComponente',

    data() {
      return {
        time: null,
        menu2: false,
        menu1: false,
        modal2: false,
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarTipoEvento: '',
        tiposEventos: [],
        areas: [],
        tipoEvento: {
          nombre: '',
          clasificacion_area_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          clasificacion_area_id: '',
        },
        errors: {
          nombre: '',
          clasificacion_area_id: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'Id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Clasificación de área',
            value: 'nombreArea'
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
      this.listarTiposEventos()
      this.listarAreas()
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'CREAR TIPO DE EVENTOS' : 'EDITAR TIPOS DE EVENTOS'
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
          this.tipoEvento = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarTiposEventos() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTiposEventos(this.paginate.page))
          this.tiposEventos = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      listarAreas() {
        this.$axios.get('/clasificaciones-areas/listar').then(res => {
          this.areas = res.data.data;
        })
      },

      async guardarTipoEvento() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarTipoEvento(this.tipoEvento.id), this.tipoEvento)
            this.$toast.success(data.mensaje)
            this.listarTiposEventos()
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
            } = await this.$loadingPostRequest(guardarTipoEvento(), this.tipoEvento)
            this.$toast.success(data.mensaje)
            this.listarTiposEventos()
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
        this.editedIndex = this.tiposEventos.indexOf(item)
        this.tipoEvento = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
