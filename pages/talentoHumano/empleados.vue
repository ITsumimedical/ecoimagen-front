<template>
  <v-card class="pa-3 text-body-1" flat>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="Empleados" height="50px" width="50px" />
              <span>Empleados</span>
            </div>
          </v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>

        </v-toolbar>
          <v-row dense class="align-center justify-start" style="width: calc(100% - 250px); margin-left: 5px;">
            <v-col cols="12" sm="3" md="3" class="d-flex justify-center">
              <v-alert text dense color="#78909C" icon="mdi-human-male-female" border="left">
                <v-badge color="#546E7A" :content="empleados[0].title">ACTIVOS</v-badge>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="d-flex justify-center">
              <v-alert text dense color="#B71C1C" icon="mdi-file-document-remove-outline" border="left">
                <v-badge color="red" :content="empleados[3].title">RETIRADOS</v-badge>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="d-flex justify-center">
              <v-alert text dense color="#00897B" icon="mdi-airplane-takeoff" border="left">
                <v-badge color="#546E7A" :content="empleados[1].title">VACACIONES</v-badge>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="d-flex justify-center">
              <v-alert text dense color="#00ACC1" icon="mdi-account-injury" border="left">
                <v-badge color="#546E7A" :content="empleados[2].title">INCAPACIDADES</v-badge>
              </v-alert>
            </v-col>
          </v-row>
      </v-card-title>

    </v-card>
    <v-card-title>
      <v-col cols="12" sm="6" md="auto">
        <v-text-field dense outlined clearable @click:clear="limpiarData()" @keyup.enter="consultarDatos(filtro)"
          v-model="filtro.cedula" label="Búsqueda por cédula"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="auto">
        <v-text-field dense outlined clearable @click:clear="limpiarData()" @keyup.enter="consultarDatos(filtro)"
          v-model="filtro.nombreCompleto" label="Búsqueda por nombre">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="auto">
        <v-text-field dense outlined clearable @click:clear="limpiarData()" @keyup.enter="consultarDatos(filtro)"
          v-model="filtro.correo" label="Búsqueda por correo"></v-text-field>
      </v-col>

      <v-card-actions class="pb-9">
        <v-btn color="info" small @click="consultarDatos(filtro)">Buscar
        </v-btn>
        <v-btn color="red" dark small @click="limpiarData()">limpiar
        </v-btn>
        <v-btn color="success" dark small @click="formularioCreacion()">Crear
        </v-btn>
        <!-- <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon @click="imprimirExcel" color="success" dark v-bind="attrs" v-on="on">
              mdi-file-excel
            </v-icon>
          </template>
          <span>Exportar empleados</span>
        </v-tooltip> -->
      </v-card-actions>
      <v-spacer></v-spacer>
    </v-card-title>
    <div>
      <EmpleadosComponente :datosEmpleado="datosEmpleado" v-if="datosEmpleado" />
    </div>
    <v-card-text>
      <component v-if="!datosEmpleado" :is="componente" @respuestaComponente="componente = null" />
    </v-card-text>
    <div>
      <v-dialog v-model="dialogEmpleados" width="800">
        <v-card>
          <v-alert text dense border="left" color="blue-grey" icon="mdi-cursor-pointer">
            Selecciona el empleado
          </v-alert>

          <v-card-text>
            <v-autocomplete dense :items="empleadosPorNombre" return-object
              @input="datosEmpleado = $event; dialogEmpleados = false"
              :item-text="u => u.documento + ' - '+ u.nombre_completo">
            </v-autocomplete>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" small @click="dialogEmpleados = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </v-card>

</template>

<script>
  import EmpleadosComponente from '~/components/talentoHumano/empleados/EmpleadosComponente.vue';
  import GuardarEmpleadoComponente from '~/components/talentoHumano/empleados/GuardarEmpleadoComponente.vue';
  import Widget from '~/components/widget/Widget.vue';
  import {
    mapActions
  } from "vuex";

  export default {
    components: {
      EmpleadosComponente,
      Widget,
      GuardarEmpleadoComponente,
    },

    name: 'WorkspaceJsonEmpleados',
    middleware({
      $can,
      redirect
    }) {
      if (!$can('empleado.listar')) {
        return redirect('/');
      }
    },
    data() {
      return {
        filtro: {
          cedula: '',
          nombreCompleto: '',
          correo: ''
        },
        dialogEmpleados: false,
        listadoEmpleados: [],
        preload: false,
        direction: 'right',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: false,
        bottom: false,
        left: false,
        transition: 'scale-transition',
        componente: null,
        documento: '',
        datosEmpleado: null,
        empleadosPorNombre: [],
        empleados: [{
            color: '#00b297',
            icon: 'mdi-account-multiple-outline',
            title: '0',
            subTitle: 'Empleados activos',
          },
          {
            color: '#ffb601e8',
            icon: 'mdi-airplane-takeoff',
            title: '0',
            subTitle: 'Vacaciones pendientes'
          },
          {
            color: '#78909C',
            icon: 'mdi-account-injury',
            title: '0',
            subTitle: 'Incapacidades',
          },
          {
            color: '#d300009c',
            icon: 'mdi-account-off',
            title: '0',
            subTitle: 'Empleados retirados'
          },
        ],
      };
    },

    watch: {
      top(val) {
        this.bottom = !val
      },
      right(val) {
        this.left = !val
      },
      bottom(val) {
        this.top = !val
      },
      left(val) {
        this.right = !val
      },
    },

    created() {
      this.consultar()
    },

    methods: {

      ...mapActions("app", ["setPreload"]),

      formularioCreacion() {
        this.componente = 'GuardarEmpleadoComponente'
      },

      consultarDatos() {
        this.setPreload(true)
        const {
          cedula,
          nombreCompleto,
          correo
        } = this.filtro;

        if (!cedula && !nombreCompleto && !correo) {
          return this.$swal({
            type: 'error',
            title: "Error!",
            text: 'Debe seleccionar un tipo de búsqueda',
          });
        }

        this.$axios.post('/empleados/consultar-empleado-con-filtro/', this.filtro)
          .then(res => {

             this.setPreload(false)

            if (res.data.length === 0) {
              return this.$swal({
                type: 'error',
                title: "¡No puede ser!",
                text: 'El empleado no se encuentra en la base de datos',
              });
            }

            if (res.data.length === 1) {
              const empleado = res.data[0];

              if (cedula && !empleado.documento) {
                return this.$swal({
                  type: 'error',
                  title: "¡No puede ser!",
                  text: 'El documento ingresado no se encuentra registrado',
                });
              }
              if (correo && !empleado.email_corporativo) {
                return this.$swal({
                  type: 'error',
                  title: "¡No puede ser!",
                  text: 'El correo ingresado no se encuentra registrado',
                });
              }

              this.datosEmpleado = empleado;
            } else {
              this.dialogEmpleados = true;
              this.empleadosPorNombre = res.data;
            }
          })
          .catch(error => {
            return this.$swal({
              type: 'error',
              title: "¡No puede ser!",
              text: 'El empleado no se encuentra en la base de datos',
            });
          }).finally(() => {
            this.setPreload(false);
          });;
      },

      limpiarData() {
        this.datosEmpleado = null
        for (const key in this.filtro) {
          this.filtro[key] = '';
        }
        this.empleadosPorNombre = [];
        this.componente = []
      },

      listarEmpleados() {
        this.$axios.get('/empleados/listar').then(res => {
          this.listadoEmpleados = res.data.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },

      formularioRegistro() {
        try {
          this.datosEmpleado = null
          this.documento = ''
        } catch (error) {

        }
      },

      consultar() {
        this.$axios.get('empleados/contadoresEmpleados').then(res => {
          this.empleados[0].title = `${res.data[0]}`;
          this.empleados[3].title = `${res.data[1]}`;
          this.empleados[2].title = `${res.data[2]}`;
          this.empleados[1].title = `${res.data[3]}`;
        });
      },

      imprimirExcel() {
        this.$axios({
          method: 'get',
          url: '/empleados/exportar/',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'empleados.xlsx';
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
    },
  };

</script>
