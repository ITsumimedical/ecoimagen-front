<template>
  <div>
    <v-data-table dense v-if="$can('hijoEmpleado.listar')" :headers="headers" :search="buscarHijo" :items="hijos"
      sort-by="id" :loading="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('hijoEmpleado.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Hijos</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarHijo" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-rey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarHijo">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field dense v-model="hijoEmpleado.nombre" label="Nombre"
                          :error-messages="errors.nombre">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-select dense :items="tipoDocumento" v-model="hijoEmpleado.tipo_documento_id"
                          :error-messages="errors.tipo_documento_id" item-text="nombre" item-value="id"
                          label="Tipo de documento"></v-select>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field dense v-model="hijoEmpleado.documento" label="Documento"
                          :error-messages="errors.documento">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field dense v-model="hijoEmpleado.fecha_nacimiento"
                          :error-messages="errors.fecha_nacimiento" label="Fecha nacimiento" type="date">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field dense v-model="hijoEmpleado.celular" label="Celular"
                          :error-messages="errors.celular">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field dense v-model="hijoEmpleado.telefono" label="Teléfono"
                          :error-messages="errors.telefono">
                        </v-text-field>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-switch dense v-model="hijoEmpleado.comparte_vivienda" label="Comparte vivienda">
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-switch dense v-model="hijoEmpleado.afiliar_caja" label="Afiliar caja">
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-switch dense v-model="hijoEmpleado.afiliar_eps" label="Afiliar eps">
                        </v-switch>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-switch dense v-model="hijoEmpleado.depende_economicamente" label="Depende económicamente">
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
                  <v-btn small color="boton" dark @click="guardarHijo()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.depende_economicamente`]="{ item }">
        <v-chip small :color="chipsControl(item.depende_economicamente)" dark>
          {{ item.depende_economicamente == true ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:[`item.afiliar_eps`]="{ item }">
        <v-chip small :color="chipsControl(item.afiliar_eps)" dark>
          {{ item.afiliar_eps == true ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:[`item.afiliar_caja`]="{ item }">
        <v-chip small :color="chipsControl(item.afiliar_caja)" dark>
          {{ item.afiliar_caja == true ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:[`item.comparte_vivienda`]="{ item }">
        <v-chip small :color="chipsControl(item.comparte_vivienda)" dark>
          {{ item.comparte_vivienda == true ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('hijoEmpleado.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {
    listarHijo,
    guardarHijo,
    actualizarHijo,
  } from '@/api/hijoEmpleados/hijoEmpleado'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('hijoEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonHijosEmpleadosComponente',
    props: ['empleado_id'],
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarHijo: '',
        hijos: [],
        tipoDocumento: [],
        hijoEmpleado: {
          nombre: '',
          celular: '',
          documento: '',
          telefono: '',
          fecha_nacimiento: '',
          comparte_vivienda: false,
          afiliar_caja: false,
          afiliar_eps: false,
          depende_economicamente: false,
          tipo_documento_id: ''
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          celular: '',
          documento: '',
          telefono: '',
          fecha_nacimiento: '',
          comparte_vivienda: false,
          afiliar_caja: false,
          afiliar_eps: false,
          depende_economicamente: false,
          tipo_documento_id: ''
        },
        errors: {
          nombre: '',
          celular: '',
          documento: '',
          telefono: '',
          fecha_nacimiento: '',
          comparte_vivienda: false,
          afiliar_caja: false,
          afiliar_eps: false,
          depende_economicamente: false,
          tipo_documento_id: ''
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
            text: 'Celular',
            value: 'celular'
          },
          {
            text: 'Teléfono',
            value: 'telefono'
          },
          {
            text: 'Fecha nacimiento',
            value: 'fecha_nacimiento'
          },
          {
            text: 'Edad',
            value: 'edad'
          },
          {
            text: 'Comparte vivienda',
            value: 'comparte_vivienda',
            align: 'center'
          },
          {
            text: 'Afiliar a caja de compensación',
            value: 'afiliar_caja',
            align: 'center'
          },
          {
            text: 'Afiliar a EPS',
            value: 'afiliar_eps',
            align: 'center'
          },
          {
            text: 'Depende económicamente',
            value: 'depende_economicamente',
            align: 'center'
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
      this.listarHijo();
      this.listarTipoDocumento()
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear hijo' : 'Editar hijo'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      empleado_id() {
        this.listarHijo();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.hijoEmpleado = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarTipoDocumento() {
        this.$axios.get("/tipo-documento/listar").then((res) => {
          this.tipoDocumento = res.data;
        }).catch((error) => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de documento"
          );
          console.log(error);
        })
      },

      async listarHijo() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarHijo(this.empleado_id))
          this.hijos = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarHijo() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarHijo(this.hijoEmpleado.id), this.hijoEmpleado)
            this.$toast.success(data.mensaje)
            this.listarHijo()
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
            this.hijoEmpleado.empleado_id = this.empleado_id
            const {
              data
            } = await this.$loadingPostRequest(guardarHijo(), this.hijoEmpleado)
            this.$toast.success(data.mensaje)
            this.listarHijo()
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
        this.editedIndex = this.hijos.indexOf(item)
        this.hijoEmpleado = Object.assign({}, item)
        this.dialog = true
      },

      chipsControl(item) {
        if (item == true) return 'info'
        else if (item == false) return 'blue-grey'
        else return 'warning'
      },

    },
  };

</script>
