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
    <v-data-table disable-pagination dense :headers="headers" :search="buscarConsultorio" :items="consultorios"
      sort-by="id" hide-default-footer no-data-text="Sin datos para mostrar" :loading="cargando" loading-text="Cargando... Espere por favor">
      <template v-slot:[`item.nombreEstado`]="{ item }">
        <v-chip label small :color="chipEstado(item.estadoId)" dark>{{ item.estadoId == '1' ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-row class="mx-2">
            <v-col md="5" lg="5" xl="5" sm="6" cols>
              <v-text-field outlined dense v-model="filtro.nombre" label="Nombre consultorio">
              </v-text-field>
            </v-col>
            <v-col md="5" lg="5" xl="5" sm="6" cols>
              <v-text-field outlined dense v-model="filtro.nombre_reps" label="Nombre sede (REP)">
              </v-text-field>
            </v-col>
            <v-col md="2" lg="2" xl="2" sm="6" cols>
              <v-btn-toggle background-color="white" dark>
                <v-btn small color="success" @click="listarConsultorios()">Filtrar</v-btn>
                <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn v-if="$can('consultorio.crear')" small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-dialog v-model="dialog" max-width="750px" persistent>
          <v-card>
            <v-alert text border="left" dense type="info" icon="mdi-door">
                <b>{{titulo}}</b>
            </v-alert>
            <form @submit.prevent="guardarConsultorio">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" sm="12" md="9">
                    <v-text-field dense v-model="consultorio.nombre" label="Nombre" :error-messages="errors.nombre">
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="3">
                    <v-text-field :error-messages="errors.cantidad_paciente" dense hide-spin-buttons type="number"
                      v-model="consultorio.cantidad_paciente" label="Cupo máximo pacientes">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-autocomplete no-data-text="Escriba el nombre del prestador para iniciar la búsqueda" dense
                      :error-messages="errors.rep_id" :items="reps" item-text="nombre" item-value="id"
                      v-model="consultorio.rep_id" label="Prestador" :search-input.sync="rep">
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="close()">
                  Cancelar
                </v-btn>
                <v-btn small color="boton" dark @click="guardarConsultorio()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
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
        <v-tooltip top v-if="$can('consultorio.cambiarEstado')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="item.estadoId == 1 ? 'error' : 'success'" class="mr-2" v-bind="attrs" v-on="on" @click="cambiarEstado(item)">
              {{ item.estadoId == 1 ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
            </v-icon>
          </template>
          <span>{{ item.estadoId == 1 ? 'Inactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarConsultorios()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarConsultorios()">
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
  import {
    guardarConsultorio,
    actualizarConsultorio,
  } from '@/api/consultorios/consultorio'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('consultorio.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonConsultorios',

    data() {
      return {
        dialog: false,
        dialogoEditar: false,
        buscarConsultorio: '',
        consultorios: [],
        estados: [],
        reps: [],
        rep: null,
        preload: false,
        pagina: 1,
        total: 0,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 5,
        cargando: false,
        filtro: {
          nombre: null,
          nombre_reps: null,
        },
        consultorio: {
          nombre: '',
          cantidad_paciente: '',
          rep_id: '',
          estado_id: '',
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          cantidad_paciente: '',
          rep_id: '',
          estado_id: '',
        },
        errors: {
          nombre: '',
          cantidad_paciente: '',
          rep_id: '',
          estado_id: '',
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
            text: 'Sede (REP)',
            value: 'nombreReps'
          },
          {
            text: 'Capacidad máxima',
            value: 'cantidad_paciente',
            align: 'center'
          },
          {
            text: 'Estado',
            value: 'nombreEstado'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    created() {
      this.listarEstados();
    },

    mounted() {
      this.listarConsultorios();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Creación de consultorio' : 'Actualización de consultorio'
      },
    },

    watch: {
      rep(val) {
        if (val) {
          if (val.length === 5) {
            this.listarReps();
          } else if (val.length < 5) {
            this.reps = null;
          }
        } else {
          this.reps = null;
        }
      },
    },

    methods: {
      ...mapActions('app', ['setPreload']),
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.consultorio = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarReps() {
        this.preload = true;
        this.$axios.post('reps/listarConfiltro?page=0', {
          rep: this.rep
        }).then(res => {
          if (res.data.length >= 2) {
            this.preload = false;
            this.reps = res.data.map((rep) => {
              return {
                id: rep.id,
                nombre: `${rep.nombre}`,
              }
            })
          }
        }).catch(e => {
          this.preload = false;
          console.log(e);
        })
      },

      limpiar() {
        this.preload = true;
        for (const prop of Object.getOwnPropertyNames(this.filtro)) {
          this.filtro[prop] = null;
        }
        for (const key in this.consultorios) {
          this.consultorios[key] = ''
        }
        this.editedIndex = -1
        this.dialog = false
        this.preload = false;
        this.listarConsultorios();
      },

      async listarEstados() {
        try {
          const response = await this.$loadingGetRequest('/estados/listar')
          this.estados = response.data.data
        } catch (error) {
          this.$toast.error('No se ha podido cargar los estados!')
        }
      },

      async listarConsultorios() {
        this.cargando = true;
        this.setPreload(true);
        this.$axios.post('/consultorios/listar?page=' + this.pagina + '&cant=' + this.opcionActual, this.filtro).then(
          res => {
            this.consultorios = res.data.data;
            this.total = res.data.last_page;
            this.setPreload(false);
            this.cargando = false;
          }).catch(e => {
          console.log(e);
            this.$toast.error('Error al cargar los consultorios');
        }).finally(() => {
          this.setPreload(false);
        });
      },

      chipEstado(estadoId) {
        if (estadoId == '1') return 'success'
        else return 'error'
      },

      async guardarConsultorio() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const {
              data
            } = await this.$loadingPutRequest(actualizarConsultorio(this.consultorio.id), this.consultorio)
            this.$toast.success(data.mensaje)
            this.listarConsultorios()
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
            this.consultorio.estado_id = 1
            const {
              data
            } = await this.$loadingPostRequest(guardarConsultorio(), this.consultorio)
            this.$toast.success(data.mensaje)
            this.listarConsultorios()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data.errors)
            }
          }
        }

      },

      cambiarEstado(item) {
        return this.$swal({
          title: "¿Está Seguro?",
          text: "Deseas cambiar el estado de este consultorio",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.value) {
            const request = {
              'estado_id': item.estadoId == 1 ? 2 : 1,
            };
            this.$axios.put('/consultorios/' + item.id, request).then(res => {
              this.$toast.success(res.data.mensaje)
              this.listarConsultorios()
            }).catch(error => {
              if (error.response.data.error) {
                this.$toast.error(error.response.data.error)
              } else if (error.response.data) {
                this.ErrorEntrada(error.response.data)
              }
            });
          }
        });

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
        this.editedIndex = this.consultorios.indexOf(item)
        this.consultorio = Object.assign({}, item)

        this.rep = item.nombreReps.slice(0, 5)
        this.listarReps()
        this.listarConsultorios();
        this.consultorio.rep_id = item.rep_id

        this.dialog = true
        this.consultorio.estado_id = parseInt(item.estadoId)
      },

    },
  };

</script>
