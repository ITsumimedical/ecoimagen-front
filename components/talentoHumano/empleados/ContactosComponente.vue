<template>
  <div>
    <v-data-table v-if="$can('contactoEmpleado.listar')" :headers="headers" :search="buscarContacto" :items="contactos"
      sort-by="id" dense :loading="loading" loading-text="Cargando..." hide-default-footer
      no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.contacto_emergencia`]="{ item }">
        <v-chip small :color="chipContatoEmergencia(item.contacto_emergencia)" dark>
          {{ item.contacto_emergencia == '1' ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('contactoEmpleado.crear')" color="boton" class="mb-2 white--text"
            @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Contactos</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarContacto" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-alert text dense border="left" color="blue-rey">{{titulo}}</v-alert>
            <form @submit.prevent="guardarContacto">
              <v-card-text>
                <v-container fluid>
                  <v-row dense>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="contacto.nombre" label="Nombre" :error-messages="errors.nombre">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-select dense v-model="contacto.parentesco" :items="parentescos" label="Parentesco"
                        :error-messages="errors.parentesco">
                      </v-select>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="contacto.celular" label="Celular" :error-messages="errors.celular">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="contacto.telefono" label="Teléfono" :error-messages="errors.telefono">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-text-field dense v-model="contacto.direccion" label="Dirección" :error-messages="errors.direccion">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-autocomplete dense :items="municipios" v-model="contacto.municipio_id"
                        :error-messages="errors.municipio_id" item-text="nombre" item-value="id"
                        label="Municipio residencia"></v-autocomplete>
                    </v-col>
                    <v-col cols="4" sm="4" md="4">
                      <v-checkbox dense v-model="contacto.contacto_emergencia" label="Contacto emergencia">
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="close()">
                  Cancelar
                </v-btn>
                <v-btn small color="boton" dark @click="guardarContacto()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('contactoEmpleado.actualizar')">
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
    listarContacto,
    guardarContacto,
    actualizarContacto,
  } from '@/api/contactosEmpleados/contactoEmpleado'
  import {
    listarMunicipios
  } from "@/api/municipios/municipio";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('contactoEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonContactosComponente',
    props: ['empleado_id'],
    data() {
      return {
        parentescos: ['Sin parentesco', 'Padres', 'Hijos', 'Tíos', 'Primos', 'Sobrinos', 'Abuelos', 'Bisabuelos',
          'Nietos', 'Cónyuge'
        ],
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarContacto: '',
        contactos: [],
        municipios: [],
        contacto: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          parentesco: '',
          contacto_emergencia: false,
          municipio_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          parentesco: '',
          contacto_emergencia: false,
          municipio_id: '',
        },
        errors: {
          nombre: '',
          celular: '',
          telefono: '',
          direccion: '',
          municipio_id: '',
          parentesco: '',
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
            text: 'Dirección',
            value: 'direccion'
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
            text: 'Contacto para emergencia',
            value: 'contacto_emergencia',
            align: 'center',
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
      this.listarContacto();
      this.listarMunicipios();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear contacto' : 'Editar contacto'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      empleado_id() {
        this.listarContacto();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.contacto = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarMunicipios() {
        this.$loadingGetRequest(listarMunicipios()).then(res => {
          this.municipios = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      async listarContacto() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarContacto(this.empleado_id))
          this.contactos = data.data
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      chipContatoEmergencia(contacto_emergencia) {
        if (contacto_emergencia == '1') return 'info'
        else if (contacto_emergencia == '0') return 'elerta'
        else return 'warning'
      },

      async guardarContacto() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarContacto(this.contacto.id), this.contacto)
            this.$toast.success(data.mensaje)
            this.listarContacto()
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
            this.contacto.empleado_id = this.empleado_id
            const {
              data
            } = await this.$loadingPostRequest(guardarContacto(), this.contacto)
            this.$toast.success(data.mensaje)
            this.listarContacto()
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
        this.editedIndex = this.contactos.indexOf(item)
        this.contacto = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
