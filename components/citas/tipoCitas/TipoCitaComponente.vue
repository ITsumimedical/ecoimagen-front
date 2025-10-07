<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscarTipoCita" :items="tiposCitas" sort-by="id"
    :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="chipEstado(item.estado)" dark>{{ item.estado == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:[`item.multiples`]="{ item }">
        <v-chip :color="chipMultiple(item.multiples)" small dark>{{ item.multiples == '1' ? 'Múltiple' : 'Individual' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            <b>Nuevo</b>
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarTipoCita" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="black--text text-h5">{{titulo}}</span>
              </v-card-title>
              <form @submit.prevent="guardarTipoCitas">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field dense v-model="tipoCita.nombre" label="Nombre" :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-switch dense v-model="tipoCita.multiples" label="Múltiple">
                        </v-switch>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarTipoCitas()">
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
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarTipoCitas()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    listarTipoCitas,
    guardarTipoCitas,
    actualizarTipoCitas,
  } from '@/api/tiposCitas/tipoCita'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonTipoCita',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarTipoCita: '',
        tiposCitas: [],
        tipoCita: {
          nombre: '',
          multiples: false,
          estado: false
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          multiples: false,
          estado: false
        },
        errors: {
          nombre: '',
          multiples: false,
          estado: false
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'Id',
			sortable: false,
		  	align: 'center',
            value: 'id',
          },
          {
            text: 'Nombre',
			sortable: false,
		  	align: 'center',
            value: 'nombre',
          },
          {
            text: 'Múltiple',
			sortable: false,
		  	align: 'center',
            value: 'multiples',
          },
          {
            text: 'Estado',
			sortable: false,
		  	align: 'center',
            value: 'estado',
          },
          {
            text: 'Acciones',
			sortable: false,
		  	align: 'center',
            value: 'actions',
          },
        ],
      };
    },

    mounted() {
      this.listarTipoCitas();

    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear tipo de cita' : 'Editar tipo de cita'
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
          this.tipoCita = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      async listarTipoCitas() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTipoCitas(this.paginate.page))
          this.tiposCitas = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipEstado(estado) {
        if (estado == '1') return 'success'
        else if (estado == '0') return 'elerta'
        else return 'warning'
      },

      chipMultiple(multiples) {
        if (multiples == '1') return 'info'
        else if (multiples == '0') return 'blue-grey'
        else return 'warning'
      },

      async guardarTipoCitas() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarTipoCitas(this.tipoCita.id), this.tipoCita)
            this.$toast.success(data.mensaje)
            this.listarTipoCitas()
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
            this.tipoCita.estado = 1
            const {
              data
            } = await this.$loadingPostRequest(guardarTipoCitas(), this.tipoCita)
            this.$toast.success(data.mensaje)
            this.listarTipoCitas()
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
        this.editedIndex = this.tiposCitas.indexOf(item)
        this.tipoCita = Object.assign({}, item)
        this.tipoCita.multiples = parseInt(item.multiples)
        this.tipoCita.estado = parseInt(item.estado)
        this.dialog = true
      },

    },
  };

</script>
