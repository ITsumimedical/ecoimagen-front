<template>
  <div>
    <v-row>
      <v-col v-for="ben in beneficiosOtorgados" :key="ben.color" cols="12" sm="3" md="3">
        <Widget :color="ben.color" :icon="ben.icon" :title="ben.title" :subTitle="ben.subTitle"
          :supTitle="ben.supTitle" />
      </v-col>
    </v-row>
    <v-row>
      <v-data-table dense :headers="headers" :search="buscarBeneficio" :items="beneficiosEmpleados" class="elevation-1"
        :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
        <template v-slot:[`item.estadoBeneficio`]="{ item }">
          <v-chip small v-if="item.estado_id == 3" :color="getColor(item.estado_id)" dark>
            {{ 'Pendiente autorización' }}
          </v-chip>
          <v-chip small v-if="item.estado_id == 5" :color="getColor(item.estado_id)" dark>
            {{ 'Anulado' }}
          </v-chip>
          <v-chip small v-if="item.estado_id == 4" :color="getColor(item.estado_id)" dark>
            {{ 'Autorizado' }}
          </v-chip>
        </template>
        <template v-slot:top>
          <v-card-title>
            <v-btn small color="boton" v-if="$can('beneficioEmpleado.crear')" class="mb-2 white--text" @click="dialog = true">
              Nuevo
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-if="$can('beneficioEmpleado.listar')" @click="excel" color="success" dark v-bind="attrs" v-on="on">
                  mdi-file-excel
                </v-icon>
              </template>
              <span>Exportar beneficios</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-text-field v-model="buscarBeneficio" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
            </v-text-field>
          </v-card-title>
          <v-dialog v-model="dialog" max-width="800px">
            <v-container fluid class="pa-0">
              <v-card>
                <v-card-title class="titulo">
                  <span class="black--text text-h5">{{titulo}}</span>
                </v-card-title>
                <form @submit.prevent="guardarBeneficio">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete :error-messages="errors.empleado_id" :items="listaEmpleados"
                            :item-text="concatenar" item-value="id" v-model="beneficio.empleado_id" label="Empleado"
                            dense>
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select dense :error-messages="errors.beneficio_id" v-model="beneficio.beneficio_id"
                            :items="beneficios" label="Tipo de beneficio" item-text="nombre" item-value="id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="beneficio.fecha_disfrute" :error-messages="errors.fecha_disfrute"
                            label="Fecha de disfrute" type="date">
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea v-model="beneficio.observaciones" label="Observaciones"
                            :error-messages="errors.observaciones">
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="close()">
                      Cerrar
                    </v-btn>
                    <v-btn small v-if="beneficio.estado_id != 5" color="boton" dark @click="guardarBeneficio()">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </form>
              </v-card>
            </v-container>
          </v-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top v-if="$can('beneficioEmpleado.actualizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip top v-if="$can('beneficioEmpleado.autorizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="green" small class="mr-2" v-bind="attrs" v-on="on" @click="autorizar(item)">
                mdi-check
              </v-icon>
            </template>
            <span>Autorizar</span>
          </v-tooltip>
          <v-tooltip top v-if="$can('beneficioEmpleado.anular')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="red" small class="mr-2" v-bind="attrs" v-on="on" @click="anular(item)">
                mdi-block-helper
              </v-icon>
            </template>
            <span>Anular</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>

<script>
  import Widget from '~/components/widget/Widget.vue'
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('beneficioEmpleado.listar')) {
        return redirect('/');
      }
    },
    components: {
      Widget
    },
    name: 'WorkspaceJsonbeneficios',
    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarBeneficio: '',
        beneficios: [],
        beneficiosEmpleados: [],
        listaEmpleados: [],
        beneficiosOtorgados: [{
            color: '#0288D1',
            icon: 'mdi-gift-outline',
            title: '0',
            subTitle: 'Beneficios otorgados',
          },
          {
            color: '#FF9800',
            icon: 'mdi-alert-outline',
            title: '0',
            subTitle: 'Pendientes por autorización',
          },
          {
            color: '#4CAF50',
            icon: 'mdi-checkbox-marked-circle-outline',
            title: '0',
            subTitle: 'Autorizados',
          },
          {
            color: '#E53935',
            icon: 'mdi-close-circle-outline',
            title: '0',
            subTitle: 'Anulados',
          },
        ],
        beneficio: {
          observaciones: '',
          beneficio_id: '',
          empleado_id: '',
          fecha_disfrute: '',
        },
        editedIndex: -1,
        defecto: {
          observaciones: '',
          beneficio_id: '',
          empleado_id: '',
          fecha_disfrute: '',
        },
        errors: {
          observaciones: '',
          beneficio_id: '',
          empleado_id: '',
          fecha_disfrute: '',
        },
        paginate: {
          total: 0,
          page: 1
        },
        headers: [{
            text: 'ID',
            value: 'id'
          },
          {
            text: 'Documento',
            value: 'empleado.documento',
            alingn: 'center',
          },
          {
            text: 'Empleado',
            value: 'empleado.nombre_completo',
            alingn: 'center',
          },
          {
            text: 'Fecha nacimiento',
            value: 'empleado.fecha_nacimiento',
            alingn: 'center',
          },
          {
            text: 'Edad',
            value: 'empleado.edad',
            alingn: 'center',
          },
          {
            text: 'Celular',
            value: 'empleado.celular',
            alingn: 'center',
          },
          {
            text: 'Correo personal',
            value: 'empleado.email_personal',
            alingn: 'center',
          },
          {
            text: 'Correo corporativo',
            value: 'empleado.email_corporativo',
            alingn: 'center',
          },
          {
            text: 'Beneficio otorgado',
            value: 'beneficio.nombre',
            alingn: 'center',
          },
          {
            text: 'Fecha disfrute',
            value: 'fecha_disfrute',
            alingn: 'center',
          },
          {
            text: 'Horas',
            value: 'beneficio.horas',
            alingn: 'center',
          },
          {
            text: 'Observaciones',
            value: 'observaciones',
            alingn: 'center',
          },
          {
            text: 'Estado',
            sortable: false,
            value: 'estadoBeneficio',
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
      this.listarBeneficio();
      this.listarBeneficios();
      this.listarEmpleados();
      this.consultar();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear beneficio laboral' : 'Editar beneficio laboral'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      }
    },

    methods: {

      getColor(estado_id) {
        if (estado_id == 3) return 'orange';
        else if (estado_id == 5) return 'red'
        else if (estado_id == 4) return 'green'
        else return 'blue'
      },

      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },

      excel() {
        this.$axios({
          method: 'get',
          url: '/beneficios-empleados/exportar',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.download = 'beneficios_empleados.xlsx';
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

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.beneficio = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarBeneficios() {
        this.$axios.get('/beneficios/listar').then(res => {
          this.beneficios = res.data.data;
        })
      },

      listarBeneficio() {
        this.$axios.get('/beneficios-empleados/listar').then(res => {
          this.beneficiosEmpleados = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      listarEmpleados() {
        this.$axios.get('/empleados/listar').then(res => {
          this.listaEmpleados = res.data.data

        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      guardarBeneficio() {
        this.beneficio.estado_id = 3
        if (this.editedIndex > -1) {
          this.$axios.put('/beneficios-empleados/' + this.beneficio.id, this.beneficio).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarBeneficio()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.$axios.post('/beneficios-empleados/crear', this.beneficio).then(res => {
            this.$toast.success(res.data.mensaje)
            this.dialog = false
            this.listarBeneficio()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }
        this.listarBeneficio()
        this.consultar()
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
        this.editedIndex = this.beneficiosEmpleados.indexOf(item)
        this.beneficio = Object.assign({}, item)
        this.dialog = true
      },

      consultar() {
        this.$axios.get('beneficios-empleados/contadores-beneficios').then(res => {
          this.beneficiosOtorgados[0].title = `${res.data[0]}`;
          this.beneficiosOtorgados[1].title = `${res.data[1]}`;
          this.beneficiosOtorgados[2].title = `${res.data[2]}`;
          this.beneficiosOtorgados[3].title = `${res.data[3]}`;
        });
      },

      async autorizar(item) {
        try {
          this.$swal({
            title: "¡Beneficio autorizado!",
            text: ` `,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('beneficios-empleados/autorizar/' + item.id)
          this.listarBeneficio()
          this.$toast.success('Se ha autorizado el beneficio correctamente.')
          this.consultar()
        } catch (error) {
          console.log(error);
        }
      },

      async anular(item) {
        try {
          this.$swal({
            title: "¡Beneficio anulado!",
            text: ` `,
            timer: 2000,
            type: "success",
          });
          await this.$axios.put('beneficios-empleados/anular/' + item.id)
          this.listarBeneficio()
          this.$toast.success('Se ha anulado el beneficio correctamente.')
          this.consultar()
        } catch (error) {
          console.log(error);
        }
      },

    },
  };

</script>
