<template>
  <div>
    <v-card class="mx-100">
      <!-- Direccionamiento detalle -->
      <v-dialog v-model="dialogs.parametros" persistent max-width="700">
        <v-card>
          <v-alert text dense outlined type="info">
            Parametros de direccionamiento de {{nombreParametros}}
          </v-alert>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="9">
                <v-autocomplete v-model="parametros.rep_id" label="Nit o Nombre del Prestador" :items="reps2"
                  item-value="id" item-text="nombre" :search-input.sync="rep2" dense
                  :error-messages="errorsParametros.rep_id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field dense label="Posicion" type="number" v-model="parametros.posicion"
                  :error-messages="errorsParametros.posicion"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="boton" dark @click="guardarParametros()">
              Agregar
            </v-btn>
          </v-card-actions>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchParametros" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table :headers="headersParametros" :items="direccionamientoParametros" :search="searchParametros"
            dense :loading="preload" loading-text="cargando..." no-data-text="Sin datos para mostrar">
            <template v-slot:[`item.posicion`]="props">
              <v-edit-dialog :return-value.sync="props.item.posicion" large persistent
                @save="actualizarPosicion(props.item)" @cancel="cancel" cancel-text="Cancelar" save-text="Cambiar"
                @open="open" @close="close">
                <div>{{ props.item.posicion }}</div>
                <template v-slot:input>
                  <div class="mt-4 text-h6">
                    Cambiar Posición
                  </div>
                  <v-text-field v-model="props.item.posicion" label="Edit" single-line autofocus></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:[`item.accion`]="props">
              <v-tooltip top v-if="$can('contrato.direccionamiento.actualizar')">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="error" small v-bind="attrs" v-on="on" @click="eliminarParametro(props.item)">
                    mdi-delete
                  </v-icon>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="cerrarModaleditar()">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Direccionamiento PGP -->
      <v-dialog v-model="dialogs.parametrosPGP" persistent max-width="700">
        <v-card>
          <v-alert text dense outlined type="info">
            Parametros de direccionamiento de PGP
          </v-alert>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="9">
                <v-autocomplete v-model="parametros.rep_id" label="Nit o Nombre del Prestador" :items="reps2"
                  item-value="id" item-text="nombre" :search-input.sync="rep2" dense
                  :error-messages="errorsParametros.rep_id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field dense label="Posicion" type="number" v-model="parametros.posicion"
                  :error-messages="errorsParametros.posicion"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="boton" dark @click="guardarParametrosPGP()">
              Agregar
            </v-btn>
          </v-card-actions>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchParametros" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table :headers="headersParametrosPGP" :items="direccionamientoParametrosPGP" :search="searchParametros"
            dense :loading="preload" loading-text="cargando..." no-data-text="Sin datos para mostrar">
            <template v-slot:[`item.posicion`]="props">
              <v-edit-dialog :return-value.sync="props.item.posicion" large persistent
                @save="actualizarPosicion(props.item)" @cancel="cancel" cancel-text="Cancelar" save-text="Cambiar"
                @open="open" @close="close">
                <div>{{ props.item.posicion }}</div>
                <template v-slot:input>
                  <div class="mt-4 text-h6">
                    Cambiar Posición
                  </div>
                  <v-text-field v-model="props.item.posicion" label="Edit" single-line autofocus></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:[`item.accion`]="props">
              <v-tooltip top v-if="$can('contrato.direccionamiento.actualizar')">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="error" small v-bind="attrs" v-on="on" @click="eliminarParametroPgp(props.item)">
                    mdi-delete
                  </v-icon>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="dialogs.parametrosPGP = false">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Crear cabecera direccionamiento -->
      <v-dialog v-model="dialogs.form" persistent max-width="700px">
        <v-card>
          <v-card-title class="titulo black--text">
            Crear Direccionamiento
          </v-card-title>
          <form @submit.prevent="submit">
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete :items="georeferenciaciones" item-value="geo_id" item-text="nombre_georeferencia"
                    v-model="form.georeferenciacion_id" label="Zona *" :error-messages="errors.georeferenciacion_id">
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete v-model="form.rep_id" label="Nit o Nombre del Prestador (Sede Primaria)" :items="reps"
                    item-value="id" item-text="nombre" :search-input.sync="rep" dense :loading="cargandoRep"
                    :error-messages="errors.rep_id">
                  </v-autocomplete>
                </v-col>
              </v-row>

              <p>Campos obligatorios *</p>

              <v-card-actions class="justify-end">
                <v-btn color="error" @click="limpiar()">cerrar
                </v-btn>
                <v-btn color="boton" dark @click="guardarDireccionamiento()">Guardar</v-btn>
              </v-card-actions>
            </v-card-text>
          </form>
        </v-card>
      </v-dialog>

      <!-- tabla de direccionamiento -->
      <v-card-title>
        <v-text-field v-model="searchDireccionamiento" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" class="white--text ma-2 px-6" small @click="modalDireccionamientoPGP()">Direccionamiento PGP
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        <v-btn color="success" class="white--text ma-2 px-6" small @click="modalCrear()">Crear
            <v-icon>mdi-plus</v-icon>
          </v-btn>
      </v-card-title>
      <v-divider class="mt-2"></v-divider>
      <v-data-table :headers="headers" dense :items="direcionamiento" :search="searchDireccionamiento"
        :loading="loading" loading-text="cargando..." no-data-text="Sin datos para mostrar">
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
              item.activo ? "Activo" : "Inactivo"
            }}
          </v-chip>
        </template>
        <template v-slot:[`item.accion`]="{ item }">
          <v-tooltip top v-if="$can('contrato.direccionamiento.actualizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.activo ? 'error' : 'success'" small v-bind="attrs" v-on="on"
                @click="cambiarEstado(item.id)">
                mdi-account-convert
              </v-icon>
            </template>
            <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
          </v-tooltip>

          <v-tooltip top v-if="$can('cups.guardar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" small v-bind="attrs" v-on="on" @click="ModalEditar(item)">
                mdi-grease-pencil
              </v-icon>
            </template>
            <span>Parametros</span>
          </v-tooltip>

          <v-tooltip top v-if="$can('contrato.direccionamiento.cargue_masivo')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="blue" v-bind="attrs" v-on="on" @click="subirDireccionamiento(item)">
                mdi-cloud-upload
              </v-icon>
            </template>
            <span>Subir Direccionamiento</span>
          </v-tooltip>

        </template>
      </v-data-table>
    </v-card>

    <!-- Subir tarifas-->
    <v-dialog v-model="dialogs.subirDireccionamiento" persistent max-width="800">
      <v-card>
        <v-card-title class="titulo black--text"> Subir o actualizar Direccionamiento
          <v-spacer></v-spacer>
          <v-btn @click="descargarPlantillaDireccionamiento()" color="success" dark small>Plantilla de cargue</v-btn>
        </v-card-title>
        <v-card-text>
          <v-file-input v-model="file" @change="manejoError" show-size accept=".xlsx" label="Selecccione el archivo">
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <!-- <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert> -->
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark :disabled="preload" @click="(dialogs.subirDireccionamiento = false), (file = null)">
            cerrar
          </v-btn>
          <v-btn color="primary" dark :disabled="preload" @click="cargarArchivo()">
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preload -->
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
  </div>
</template>

<script>
  import {
    listarDepartamento
  } from "@/api/departamentos/departamento";

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can("contrato.direccionamiento.listar")) {
        return redirect("/");
      }
    },

    name: "ListarDireccionamientoComponent",

    data() {
      return {
        headers: [{
            text: "Id",
			sortable: false,
			align: 'center',
            value: "id"
          },
          {
            text: "Georeferencia",
			sortable: false,
			align: 'center',
            value: "georeferenciacion.zona.nombre"
          },
          {
            text: "Municipio",
			sortable: false,
			align: 'center',
            value: "georeferenciacion.municipio.nombre"
          },
          {
            text: "Departamento",
			sortable: false,
			align: 'center',
            value: "georeferenciacion.municipio.departamento.nombre"
          },
          {
            text: "Entidad",
			sortable: false,
			align: 'center',
            value: "georeferenciacion.entidad.nombre"
          },
          {
            text: "Sede Principal",
			sortable: false,
			align: 'center',
            value: "rep.nombre"
          },
          {
            text: "Estado",
			sortable: false,
			align: 'center',
            value: "activo"
          },
          {
            text: "Acciones",
			sortable: false,
			align: 'center',
            value: "accion"
          },
        ],
        headersParametros: [{
            text: "Sede",
            value: "rep.nombre",
            align: 'center'
          },
          {
            text: "Posición",
            value: "posicion",
            align: 'center'
          },
          {
            text: "Acciones",
            value: "accion"
          },
        ],
        headersParametrosPGP:[{
            text: "Sede",
            value: "rep.nombre",
            align: 'center'
          },
          {
            text: "Posición",
            value: "posicion",
            align: 'center'
          },
          {
            text: "Acciones",
            value: "accion",
			align: 'center'
          },
        ],
        direcionamiento: [],
        searchDireccionamiento: null,
        searchParametros: null,
        opciones: [5, 10, 15, 20, 50, 100],
        opcionActual: 15,
        pagina: 1,
        total: 0,
        opciones2: [5, 10, 15, 20, 50, 100],
        opcionActual2: 15,
        pagina2: 1,
        total2: 0,
        direccionamiento_id: null,
        manejoError:[],
        nombreParametros: '',
        loading: false,
        preload: false,
        cargandoRep: false,
        dialogs: {
          form: false,
          parametros: false,
          subirDireccionamiento: false,
          parametrosPGP: false,
        },
        parametros: {
          rep_id: null,
          posicion: null,
        },
        file: null,
        zonas: [
          "ATRATO",
          "BAJO CAUCA",
          "CENTRO",
          "MAGDALENA MEDIO",
          "NORDES",
          "NOROCCIDENTAL",
          "NORTE",
          "OCCIDENTE",
          "ORIENTE O METROPOLITANA",
          "ORIENTE",
          "PACIFICO NORTE",
          "PACIFICO SUR",
          "SAN JUAN",
          "SUR",
          "SUROCCIDENTE",
          "SUROESTE",
          "SURORIENTE",
          "URABA CHOCUANO",
          "URABA",
          "VALLE DE ABURRA"
        ],
        entidades: [],
        reps: [],
        rep: null,
        reps2: [],
        rep2: null,
        municipios: [],
        departamentos: [],
        georeferenciaciones: [],
        direccionamientoParametros: [],
        direccionamientoParametrosPGP:[],
        direcionamiento_id: null,
        filtro: {
          zona: null,
          departamento_id: null,
          entidad_id: null,
          municipio_id: null,
        },
        filtroParametros: {
          direccionamiento_id: null,
        },
        form: {
          georeferenciacion_id: null,
          rep_id: null,
        },
        errors: {
          georeferenciacion_id: null,
          rep_id: null,
        },
        errorsParametros: {
          rep_id: null,
          posicion: null,
        }
      };
    },

    watch: {
      rep(val) {
        if (val) {
          if (val.length > 4) {
            this.listarReps();
          } else if (val.length < 4) {
            this.reps = null;
          }
        } else {
          this.reps = null;
        }
      },

      rep2(val) {
        if (val) {
          if (val.length > 4) {
            this.listarReps2();
          } else if (val.length < 4) {
            this.reps2 = null;
          }
        } else {
          this.reps2 = null;
        }
      }

    },

    mounted() {
      this.getDirecionamiento();
      this.getGeoreferenciacion();
      this.listarEntidades();
      this.listarDepartamentos();
    },

    methods: {

      getDirecionamiento() {
        this.preload = true;
        this.$axios.post("/direccionamiento/listar")
          .then(res => {
            this.direcionamiento = res.data;
            this.preload = false;
          }).catch(error => {
            this.preload = false;
            this.$toast.error(error.response.data.mensaje);
          });
      },

      getParametrosPGP(){
        this.preload = true;
        this.$axios.post("/direccionamiento/listar-parametros-pgp").then(res => {
          this.direccionamientoParametrosPGP = res.data;
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
      },

      getParametros() {
        this.preload = true;
        this.$axios.post("/direccionamiento/listarParametros", this.filtroParametros).then(res => {
          this.direccionamientoParametros = res.data;
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
      },

      guardarParametros() {
        this.preload = true;
        this.parametros.direccionamiento_id = this.filtroParametros.direccionamiento_id;
        this.parametros.posicion = parseInt(this.parametros.posicion);
        this.$axios.post("/direccionamiento/crearParametro", this.parametros).then(res => {
          this.$toast.success(res.data.mensaje)
          this.parametros.rep_id = null;
          this.parametros.posicion = null;
          this.getParametros();
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.Error2(error.response.data);
          }
        });
      },


      guardarParametrosPGP(){
        this.preload = true;
        this.parametros.posicion = parseInt(this.parametros.posicion);
        this.$axios.post("/direccionamiento/crear-parametro-pgp", this.parametros).then(res => {
          this.$toast.success(res.data.mensaje)
          this.parametros.rep_id = null;
          this.parametros.posicion = null;
          this.getParametrosPGP();
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.Error2(error.response.data);
          }
        });
      },

      ModalEditar(item) {
        this.dialogs.parametros = true
        this.nombreParametros = item.rep.nombre
        this.filtroParametros.direccionamiento_id = item.id
        this.getParametros();

      },

      cerrarModaleditar() {
        this.dialogs.parametros = false
        this.direccionamientoParametros = []
        this.pagina2 = 1;
        this.total2 = 0;
      },

      guardarDireccionamiento() {
        this.preload = true;
        this.$axios.post("/direccionamiento", this.form).then(res => {
          this.$toast.success(res.data.mensaje)
          this.limpiar();
          this.getDirecionamiento();
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.Error(error.response.data);
          }
        });
      },

      /**
       * listar errores
       * @return errors objeto
       * @author kobatime
       */
      Error(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(",");
          }
        }
      },

      /**
       * listar errores
       * @return errors objeto
       * @author kobatime
       */
      Error2(errors) {
        for (const key in this.errorsParametros) {
          if (key in errors) {
            this.errorsParametros[key] = errors[key].join(",");
          }
        }
      },

      listarReps() {
        this.cargandoRep = true;
        this.$axios.post('reps/listarConfiltro?page=0', {
          rep: this.rep
        }).then(res => {
          if (res.data.length >= 2) {
            this.cargandoRep = false;
            this.reps = res.data.map((rep) => {
              return {
                id: rep.id,
                 nombre: `${rep.codigo_habilitacion_completo} - ${rep.nombre} - (${rep.municipio.nombre})`,
              }
            })
          } else if (res.data.length == 1) {
            this.cargandoRep = false;
            this.filtro.prestador_id = res.data[0].prestador_id
            this.reps = res.data.map((rep) => {
              return {
                id: rep.id,
                 nombre: `${rep.codigo_habilitacion_completo} - ${rep.nombre} - (${rep.municipio.nombre})`,
              }
            })
          }
          this.cargandoRep = false;
        }).catch(e => {
          this.cargandoRep = false;
          console.log(e);
        })
      },

      listarReps2() {
        this.cargandoRep = true;
        this.$axios.post('reps/listarConfiltro?page=0', {
          rep: this.rep2
        }).then(res => {
          if (res.data.length >= 2) {
            this.cargandoRep = false;
            this.reps2 = res.data.map((rep) => {
              return {
                id: rep.id,
                nombre: `${rep.nombre} - (${rep.municipio.nombre})`,
              }
            })
          } else if (res.data.length == 1) {
            this.cargandoRep = false;
            this.filtro.prestador_id = res.data[0].prestador_id
            this.reps2 = res.data.map((rep) => {
              return {
                id: rep.id,
                nombre: `${rep.nombre} - (${rep.municipio.nombre})`,
              }
            })
          }
          this.cargandoRep = false;
        }).catch(e => {
          this.cargandoRep = false;
          console.log(e);
        })
      },

      getGeoreferenciacion() {
        this.preload = true;
        this.$axios.post('/georreferencia/listar?page=0').then(res => {
          this.georeferenciaciones = res.data;
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          this.$toast.error("Error al cargar los datos");
        });
      },

      /**
       * listar entidades
       * @return objeto entidades
       * @author kobatime
       */
      listarEntidades() {
        this.$axios.get("/entidad/listar").then((res) => {
          this.entidades = res.data;
        }).catch((error) => {
          console.log(error);
        });
      },

      modalCrear() {
        this.dialogs.form = true;
      },

      /**
       * listar departamentos
       * @return departamento objeto
       * @author kobatime
       */
      async listarDepartamentos() {
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarDepartamento());
          this.departamentos = data;
        } catch (error) {
          console.log(error);
        }
      },

      /**
       * listar municipio con filer de departamento
       * @param data number
       * @return municipio objeto
       * @author kobatime
       */
      listarMunicipios(data) {
        return this.departamentos
          .filter((item) => item.id == data)
          .map((municipios) => {
            return (this.municipios = municipios.municipios);
          });
      },

      limpiar() {
        this.preload = true;
        for (const prop of Object.getOwnPropertyNames(this.filtro)) {
          this.filtro[prop] = null;
        }
        for (const prop of Object.getOwnPropertyNames(this.form)) {
          this.form[prop] = null;
        }
        this.dialogs.form = false;
        this.preload = false;
        this.getGeoreferenciacion();
      },

      actualizarPosicion(data) {
        this.preload = true;
        this.$axios.post('/direccionamiento/actualizarParametros', data).then(res => {
          this.$toast.success(res.data.mensaje);
          this.getParametros()
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.Error(error.response.data);
          }
        });
      },

      cambiarEstado(data) {
        this.$swal({
          title: "Desea cambiarle el estado ha este direccionamiento?",
          text: "Al aceptar este mensaje, se realizara el cambio",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            this.$axios.get('/direccionamiento/inactivarDireccionamiento/' + data).then(res => {
              this.$toast.success(res.data.mensaje);
              this.preload = false;
              this.getDirecionamiento()
            }).catch(error => {
              this.preload = false;
              if (error.response.data.mensaje) {
                this.$toast.error(error.response.data.mensaje);
              } else if (error.response.data) {
                this.Error(error.response.data);
              }
            });
          }
        });
      },

      eliminarParametro(data) {
        this.$swal({
          title: "Desea eliminar esta parametrización?",
          text: "Al aceptar este mensaje, se realizara el cambio y no se podra reversar",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            this.$axios.post('/direccionamiento/eliminaParametro', data).then(res => {
              this.$toast.success(res.data.mensaje);
              this.getParametros()
              this.preload = false;
            }).catch(error => {
              this.preload = false;
              if (error.response.data.mensaje) {
                this.$toast.error(error.response.data.mensaje);
              } else if (error.response.data) {
                this.Error(error.response.data);
              }
            });
          }
        });
      },

      eliminarParametroPgp(data){
        this.$swal({
          title: "Desea eliminar esta parametrización?",
          text: "Al aceptar este mensaje, se realizara el cambio y no se podra reversar",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            this.$axios.post('/direccionamiento/elimina-parametro-pgp', data).then(res => {
              this.$toast.success(res.data.mensaje);
              this.getParametrosPGP()
              this.preload = false;
            }).catch(error => {
              this.preload = false;
              if (error.response.data.mensaje) {
                this.$toast.error(error.response.data.mensaje);
              } else if (error.response.data) {
                this.Error(error.response.data);
              }
            });
          }
        });
      },

      subirDireccionamiento(item) {
        this.dialogs.subirDireccionamiento = true
        this.direccionamiento_id = item.id
      },

      descargarPlantillaDireccionamiento() {
        this.preload = true
        this.$axios.get("/direccionamiento/descargarPlantillaDireccionamiento", {
            responseType: 'blob',
          }).then(res => {
            this.preload = false;
            let blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = 'PlantillaDireccionamiento.xlsx';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.preload = false
          })
          .catch((error) => {
            this.preload = false;
            this.$toast.error(error.response.data.mensaje);
          });
      },

      cargarArchivo() {
        if (!this.file) {
          this.$toast.error("El archivo de carga es requerido");
          return;
        }
        this.preload = true;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("direccionamiento_id", this.direccionamiento_id);
        this.$axios.post("/direccionamiento/subirArchivo", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: 'blob',
          }).then(res => {
            this.preload = false;
            let blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = 'InformeErroresCarga.xlsx';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.dialogs.subirDireccionamiento = false;
            this.file = null;
            this.$toast.success('Se cargaron exitosamente el direccionamiento');
          })
          .catch((error) => {
            this.preload = false;
            this.errorMessage = error.response.data.mensaje;
            this.file = null;
          });
      },

      modalDireccionamientoPGP(){
        this.dialogs.parametrosPGP = true
        this.getParametrosPGP();
      }


    },
  };

</script>
