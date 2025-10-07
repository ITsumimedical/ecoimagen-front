<template>
  <div>
    <v-data-table v-if="$can('estudioEmpleado.listar')" :headers="headers" :search="buscarEstudios" :items="estudios" sort-by="id" dense
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.prerrogativa`]="{ item }">
        <v-chip :color="chipContatoEmergencia(item.prerrogativa)" dark>
          {{ item.prerrogativa == '1' ? 'Si' : 'No' }}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn small v-if="$can('estudioEmpleado.crear')" color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-subheader>Estudios</v-subheader>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarEstudios" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="800px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-alert text dense border="left" color="blue-rey">{{titulo}}</v-alert>
              <form @submit.prevent="guardarEstudio">
                <v-card-text>
                  <v-container fluid>
                    <v-row dense>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="estudio.titulo_obtenido" label="Título obtenido"
                          :error-messages="errors.titulo_obtenido">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select dense v-model="estudio.nivel_estudio" :items="nivelesEstudios" label="Nivel estudio"
                          :error-messages="errors.nivel_estudio">
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="estudio.institucion" label="Institución"
                          :error-messages="errors.institucion">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="estudio.fecha_inicio" :error-messages="errors.fecha_inicio"
                          label="Fecha inicio" type="date">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field dense v-model="estudio.fecha_graduacion" :error-messages="errors.fecha_graduacion"
                          label="Fecha graduación" type="date">
                        </v-text-field>
                      </v-col>
                      <!-- <v-col cols="2" sm="2" md="2">
                        <v-checkbox v-model="estudio.prerrogativa" label="Prerrogativa">
                        </v-checkbox>
                      </v-col>
                      <v-col v-show="estudio.prerrogativa == 1" cols="12" sm="6" md="4">
                        <v-text-field v-model="estudio.descripcion_prerrogativa" label="Descripción prerrogativa"
                          :error-messages="errors.descripcion_prerrogativa">
                        </v-text-field>
                      </v-col> -->
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small color="error" @click="close()">
                    Cancelar
                  </v-btn>
                  <v-btn small color="boton" dark @click="guardarEstudio()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top v-if="$can('estudioEmpleado.actualizar')">
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
    listarEstudio,
    guardarEstudio,
    actualizarEstudio,
  } from '@/api/estudiosEmpleados/estudioEmpleado'
  import {
    listarMunicipios
  } from "@/api/municipios/municipio";
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('estudioEmpleado.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonEstudiosComponente',
    props: ['empleado_id'],
    data() {
      return {
        nivelesEstudios: ['Bachillerato','Técnico', 'Tecnólogo', 'Profesional', 'Especialización', 'Maestría', 'Doctorado'],
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarEstudios: '',
        estudios: [],
        municipios: [],
        estudio: {
          titulo_obtenido: '',
          nivel_estudio: '',
          institucion: '',
          fecha_inicio: '',
          fecha_graduacion: '',
          // prerrogativa: false,
          // descripcion_prerrogativa: '',
        },
        editedIndex: -1,
        defecto: {
          titulo_obtenido: '',
          nivel_estudio: '',
          institucion: '',
          fecha_inicio: '',
          fecha_graduacion: '',
          // prerrogativa: false,
          // descripcion_prerrogativa: '',
        },
        errors: {
          titulo_obtenido: '',
          nivel_estudio: '',
          institucion: '',
          fecha_inicio: '',
          fecha_graduacion: '',
          // descripcion_prerrogativa: '',
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
            text: 'Título obtenido',
            value: 'titulo_obtenido'
          },
          {
            text: 'Nivel estudio obtenido',
            value: 'nivel_estudio',
          },
          {
            text: 'Institución',
            value: 'institucion',
          },
          {
            text: 'Fecha de graduación',
            value: 'fecha_graduacion',
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
      this.listarEstudio();
      this.listarMunicipios();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear estudio' : 'Editar estudio'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      },
      empleado_id() {
        this.listarEstudio();
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.estudio = Object.assign({}, this.defecto)
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

      async listarEstudio() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarEstudio(this.empleado_id))
          this.estudios = data.data
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

      async guardarEstudio() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarEstudio(this.estudio.id), this.estudio)
            this.$toast.success(data.mensaje)
            this.listarEstudio()
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
            this.estudio.empleado_id = this.empleado_id
            const {
              data
            } = await this.$loadingPostRequest(guardarEstudio(), this.estudio)
            this.$toast.success(data.mensaje)
            this.listarEstudio()
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
        this.editedIndex = this.estudios.indexOf(item)
        this.estudio = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
