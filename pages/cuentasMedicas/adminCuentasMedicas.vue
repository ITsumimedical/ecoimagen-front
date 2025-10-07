<template>
  <div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-card>
        <v-tabs centered>
          <v-tab @click="parametrizacion= true, email=false, listarTiposCuentasMedicas(),listarCodigoGlosa() ">
            <v-icon left>
              mdi-book-cog-outline
            </v-icon>
            Parametrización
          </v-tab>
          <v-tab @click="parametrizacion= false, email=true, listarEmail()">
            <v-icon left>
              mdi-card-account-mail-outline
            </v-icon>
            Correo prestador
          </v-tab>

          <v-tab-item>
            <!-- parametrizacion -->
            <v-col cols="12" sm="12" md="12" v-show="parametrizacion">
              <v-data-table  dense :headers="headersParamatrizacion" :items="codigoGlosa"
                :search="buscar" :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
                <template v-slot:[`item.estado`]="{ item }">
                  <v-chip :color="chipEstado(item.estado)" small dark>
                    {{ item.estado == '1' ? 'Activo' : 'Inactivo' }}
                  </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon  color="red" class="mr-2" v-bind="attrs" v-on="on" @click="CambiarEstado(item.id)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Inhabilitar</span>
                  </v-tooltip>
                </template>
                <template v-slot:top>
                  <v-card-title>
                    <v-toolbar flat>
                      <v-btn color="boton" dark  class="mb-2" @click="dialogoParametrizacion = true">
                        Crear parametrización
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line
                        hide-details>
                      </v-text-field>
                    </v-toolbar>
                  </v-card-title>
                </template>
              </v-data-table>
              <!-- <v-row no-gutters>
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                  <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                    @input="listarCodigoGlosa()">
                  </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                  <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                    @change="listarCodigoGlosa()">
                  </v-select>
                </v-col>
              </v-row> -->

              <v-dialog v-model="dialogoParametrizacion" max-width="800px">
                <v-card :loading="loading" :disabled="loading">
                  <v-card-title class="titulo black--text">
                    <span>Crear Parametrización</span>
                  </v-card-title>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea auto-grow v-model="formParametrización.descripcion" label="Descripción"
                          :error-messages="errorsCodigo.descripcion">
                        </v-textarea>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="formParametrización.tipo_cuenta_medica_id" label="Tipo"
                          :items="tiposCuentasMedicas" item-value="id" item-text="nombre"
                          :error-messages="errorsCodigo.tipo_cuenta_medica_id">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="formParametrización.codigo" label="Código"
                          :error-messages="errorsCodigo.codigo">
                        </v-text-field>
                      </v-col>
                    </v-row>

                  </v-container>
                  <v-alert dense type="info" text>
                    Si no existe el <strong>tipo de parametrización</strong> puede crearlo desde el botón
                    crear tipo
                  </v-alert>
                  <v-card-actions>

                    <v-btn color="boton"  dark @click="dialogoTipo = true">
                      Crear tipo
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark  @click="limpiarCodigoGlosa()">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" dark  @click="guardarCodigoGlosa()">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogoTipo" max-width="500px" persistent>
                <v-card :loading="loading" :disabled="loading">
                  <v-card-title class="titulo black--text">
                    <span>Crear Tipo</span>
                  </v-card-title>
                  <v-container>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="formTipo.nombre" label="Nombre" :error-messages="errorsTipo.nombre">
                      </v-text-field>
                    </v-col>
                  </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error"  dark @click="limpiarTipo()">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary"  dark @click="guardarTipo()">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <!-- email prestador -->
                <v-col cols="12" sm="12" md="12" v-show="email">
                  <v-data-table  dense :headers="headersEmail" :items="listaEmail"
                    :search="buscarEmail" :loading="loading" loading-text="Cargando..."
                    no-data-text="Sin datos para mostrar">
                    <template v-slot:[`item.email`]="props">
                      <v-edit-dialog :return-value.sync="props.item.email" large persistent
                        @save="cambiarEmail(props.item)" cancel-text="Cancelar" save-text="Cambiar">
                        <div>{{ props.item.email }} <v-icon color="warning" >mdi-pencil</v-icon>
                        </div>
                        <template v-slot:input>
                          <v-text-field v-model="props.item.email" single-line></v-text-field>
                        </template>
                      </v-edit-dialog>
                    </template>
                    <template v-slot:top>
                      <v-card-title>
                        <v-toolbar flat>
                          <v-btn  color="boton" dark class="mb-2" @click="dialogoEmail = true">
                            Crear correo prestador
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-text-field v-model="buscarEmail" append-icon="mdi-magnify" label="Buscar..." single-line
                            hide-details>
                          </v-text-field>
                        </v-toolbar>
                      </v-card-title>
                    </template>
                  </v-data-table>

                  <!-- <v-row no-gutters>
                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                      <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarEmail()">
                      </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                      <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarEmail()">
                      </v-select>
                    </v-col>
                  </v-row> -->

                  <v-dialog v-model="dialogoEmail" max-width="500px">
                    <v-card :loading="loading" :disabled="loading">
                      <v-card-title class="titulo black--text">
                        <span>Crear correo prestador</span>
                      </v-card-title>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12" >

                            <v-autocomplete v-model="formEmail.prestador_id" label="Nit-prestador" :items="reps"
                                 item-value="id" item-text="nombre" :search-input.sync="rep" dense
                              :error-messages="errorsEmail.prestador_id">
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" >
                            <v-text-field v-model="formEmail.email" label="Correo" :error-messages="errorsEmail.email" dense>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn  color="error" dark @click="limpiarEmail()">
                          Cancelar
                        </v-btn>
                        <v-btn  color="primary" dark @click="guardarEmailPrestador()">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-col>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </template>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonAdminCuentasMedicas',

    data() {
      return {
        preload: false,
        tab: null,
        parametrizacion: false,
        email: false,
        buscar: null,
        buscarEmail: null,
        loading: false,
        headersParamatrizacion: [{
            text: 'Id',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Descripción',
            align: 'start',
            sortable: false,
            value: 'descripcion',
          },
          {
            text: 'Tipo',
            sortable: false,
            value: 'nombre'
          },
          {
            text: 'Código',
            sortable: false,
            value: 'codigo',
            align: 'center'
          },
          {
            text: 'Estado',
            value: 'estado',
            align: 'center'
          },
          {
            text: 'Acciones',
            value: 'actions',
            align: 'center',
            sortable: false
          }
        ],
        headersEmail: [{
            text: 'Id',
            align: 'start',
            sortable: false,
            value: 'idEmail',
          },
          {
            text: 'Prestador',
            sortable: false,
            value: 'nombreprestador'
          },
          {
            text: 'Email',
            align: 'start',
            sortable: false,
            value: 'email',
          },
        ],
        codigoGlosa: [],
        listaEmail: [],
        tiposCuentasMedicas: [],
        reps: null,
        rep:null,
        dialogoParametrizacion: false,
        dialogoEmail: false,
        dialogoTipo: false,
        formParametrización: {
          descripcion: '',
          tipo_cuenta_medica_id: '',
          codigo: '',
        },
        formEmail: {
          email: '',
          prestador_id: '',
        },
        formTipo: {
          nombre: '',
        },
        errorsTipo: {
          nombre: ''
        },
        errorsEmail: {
          email: '',
          prestador_id: ''
        },
        errorsCodigo: {
          descripcion: '',
          tipo_cuenta_medica_id: '',
          codigo: '',
        },
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
        paginateEmail: {
          total: 0,
          page: 1
        },
      };
    },


    watch:{
    rep(val){
      if(val){
        if (val.length == 4) {
          this.listarReps();
        } else if (val.length < 4) {
          this.reps = null;
        }
      }else{
        this.reps = null;

      }
    }
  },
   mounted() {
      // this.listarReps()
    },

    methods: {

      listarTiposCuentasMedicas() {
        this.preload = true
        this.$axios.get('tipo-cuenta-medica/listar?page=0').then(res => {
          this.tiposCuentasMedicas = res.data
          this.preload = false
        }).catch(e => {
          console.log(e);
          this.preload = false
        })
      },

      guardarTipo() {
        this.preload = true
        this.limpiarError()
        this.$axios.post('tipo-cuenta-medica/guardar', this.formTipo).then(res => {
          this.$toast.success('Se creo el tipo correctamente')
          this.limpiarTipo()
          this.listarTiposCuentasMedicas()
          this.preload = false
        }).catch(e => {
          this.preload = false
          console.log(e);
          this.ErrorEntrada(e.response.data)
        })
      },

      limpiarTipo() {
        this.formTipo.nombre = '',
          this.dialogoTipo = false
        this.limpiarError()
      },

      ErrorEntrada(errors) {
        for (const key in this.errorsTipo) {
          if (key in errors) {
            this.errorsTipo[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errorsTipo) {
          this.errorsTipo[key] = ''
        }
      },

      ErrorEntradaCodigo(errors) {
        for (const key in this.errorsCodigo) {
          if (key in errors) {
            this.errorsCodigo[key] = errors[key].join(',')
          }
        }
      },

      limpiarErrorCodigo() {
        for (const key in this.errorsCodigo) {
          this.errorsCodigo[key] = ''
        }
      },

      listarCodigoGlosa() {
        this.$axios.get('codigo-glosa/listarCodigoGlosas' ).then(
          res => {
            this.codigoGlosa = res.data

          }).catch(e => {
          console.log();
        })
      },

      limpiarCodigoGlosa() {
        this.dialogoParametrizacion = false,
          this.formParametrización.codigo = '',
          this.formParametrización.descripcion = '',
          this.formParametrización.tipo_cuenta_medica_id = '',
          this.limpiarErrorCodigo()
      },

      guardarCodigoGlosa() {
        this.preload = true
        this.limpiarErrorCodigo()
        this.$axios.post('codigo-glosa/guardar', this.formParametrización).then(res => {
          this.$toast.success('Se creo el codigo de la glosa correctamente')
          this.listarCodigoGlosa()
          this.limpiarCodigoGlosa()
          this.preload = false
        }).catch(e => {
          console.log(e);
          this.ErrorEntradaCodigo(e.response.data)
          this.preload = false
        })
      },

      CambiarEstado(idCodigoGlosa) {
        this.$swal({
          title: 'Está Seguro?',
          text: "Inhabilitar código glosa",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Inhabilitar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.preload = true
            this.$axios.put('codigo-glosa/cambiarEstado/' + idCodigoGlosa).then(res => {
              this.$toast.success('Solicitud Enviada!');
              this.listarCodigoGlosa()
              this.preload = false
            }).catch(e => {
              this.preload = false
              console.log(e);
            })
          }
        })
      },


       listarReps() {
        this.preload = true
        this.$axios.post('prestador/listar?page=0',{prestador: this.rep}).then(res => {
             this.reps = res.data.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.nombre_prestador} - ${rep.nit}`,
            }
          })
           this.preload = false
        }).catch(e => {
          this.preload = false
          console.log(e);
        })
      },

      limpiarEmail() {
        this.dialogoEmail = false,
          this.formEmail.email = '',
          this.formEmail.prestador_id = '',
          this.formEmail.rep = null,
          this.limpiarErrorEmail()
      },

      listarEmail() {
        this.$axios.get('email-cuentas-medicas/listar').then(
          res => {
            this.listaEmail = res.data
            // this.total = res.data.last_page
          }).catch(e => {

        })
      },

      ErrorEntradaEmail(errors) {
        for (const key in this.errorsEmail) {
          if (key in errors) {
            this.errorsEmail[key] = errors[key].join(',')
          }
        }
      },

      limpiarErrorEmail() {
        for (const key in this.errorsEmail) {
          this.errorsEmail[key] = ''
        }
      },

      guardarEmailPrestador() {
        this.preload = true
        this.limpiarErrorEmail()
        this.$axios.post('email-cuentas-medicas/crear', this.formEmail).then(res => {
          this.$toast.success('Se creo el email para el prestador correctamente')
          this.limpiarEmail()
          this.listarEmail()
          this.preload = false
        }).catch(e => {
          this.preload = false
          console.log(e);
          this.ErrorEntradaEmail(e.response.data)
        })
      },

      cambiarEmail(datos) {
        this.$axios.put('email-cuentas-medicas/cambiarEmail/' + datos.idEmail, datos).then(res => {
          this.$toast.success('Se actualizo el email correctamente')
          this.listarEmail()
        }).catch(e => {
          console.log(e);
        })
      },

      chipEstado(estado) {
        if (estado == '1') return 'info'
        else if (estado == '0') return 'elerta'
        else return 'warning'
      },



    },
  };

</script>
