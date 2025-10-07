<template>
  <div>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <v-card>

          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="primary" icon="mdi-text-box-multiple-outline" class="text-center">
              <b>TESORERIA</b>
            </v-alert>
          </v-col>

          <v-bottom-navigation :value="true" color="primary">
            <v-btn @click="relacionPagos= true, estadoCuenta=false, cargaRelacionPagos = false">
              <h3>Relación de pagos</h3>
            </v-btn>

            <v-btn @click="relacionPagos= false, estadoCuenta=true, cargaRelacionPagos = false">
              <h3>Estado de cuenta</h3>
            </v-btn>

            <v-btn @click="relacionPagos= false, estadoCuenta=false, cargaRelacionPagos = true"
              v-if="$can('cuentasMedicas.cargapagos')">
              <h3>Carga relación pagos</h3>
            </v-btn>

          </v-bottom-navigation>

          <v-col cols="12" sm="12" md="12" v-show="relacionPagos">
            <v-alert dense type="info" outlined text>
              Determine el <strong>mes</strong> para buscar las relaciones de pago
            </v-alert>
            <v-row dense>
              <v-col cols="12" sm="6" md="3">
                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field dense v-model="fechaDesde" label="Año y mes" prepend-icon="mdi-calendar" readonly
                      v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker locale="es" color="info" v-model="fechaDesde" type="month" @input="menu2 = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="1">
                <v-btn color="success" @click="buscarPagosPrestador()">
                  Buscar
                </v-btn>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-data-table :headers="headersCarga" dense :items="pagoCargadoPrestador" hide-default-footer
                  disable-pagination no-data-text="Sin datos para mostrar">
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" v-bind="attrs" v-on="on" @click="imprimirAdjuntoFactura(item)">
                          mdi-file-document
                        </v-icon>
                      </template>
                      <span>Adjunto factura</span>
                    </v-tooltip>
                  </template>

                </v-data-table>
                 <v-row no-gutters>
                  <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                      @input="buscarPagosPrestador()">
                    </v-pagination>
                  </v-col>
                  <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                      @change="buscarPagosPrestador()">
                    </v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

          </v-col>



          <v-col cols="12" sm="12" md="12" v-show="estadoCuenta">
            <v-alert dense type="info" outlined text>
              Determine la <strong>fecha</strong> de corte
            </v-alert>
            <v-row dense>
              <v-col cols="12" sm="6" md="6">

                <v-text-field dense v-model="fechaCorte" label="Fecha de corte" type="date">
                </v-text-field>

              </v-col>
              <v-col cols="12" sm="6" md="1">
                <v-btn color="success" @click="generarCorte()">
                  Generar
                </v-btn>
              </v-col>
            </v-row>

          </v-col>

          <v-col cols="12" sm="12" md="12" v-show="cargaRelacionPagos">
            <v-row dense>
              <v-col cols="12" sm="6" md="5">
                <v-autocomplete label="Nit-prestador" v-model="prestador" :items="reps2" item-text="nombre"
                  item-value="id" :error-messages="errors.prestador_id" dense :search-input.sync="rep2">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field dense v-model="fechaDesdeCarga" label="Año y mes" prepend-icon="mdi-calendar" readonly
                      v-on="on" :error-messages="errors.fecha">
                    </v-text-field>
                  </template>
                  <v-date-picker locale="es" color="info" v-model="fechaDesdeCarga" type="month" @input="menu3 = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="1">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed color="success" rounded v-on="on" @click="buscarPagos()">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                  <span>Filtrar</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed color="info" rounded v-on="on" @click="dialogoAdjunto = true">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Cargar adjunto</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-data-table :headers="headersCarga" dense :items="pagoCargado" hide-default-footer disable-pagination
                  no-data-text="Sin datos para mostrar">
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" v-bind="attrs" v-on="on" @click="imprimirAdjuntoFactura(item)">
                          mdi-file-document
                        </v-icon>
                      </template>
                      <span>Adjunto factura</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" v-bind="attrs" v-on="on" @click="EliminarAdjunto(item)">
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>Eliminar</span>
                    </v-tooltip>
                  </template>

                </v-data-table>
              </v-col>
              <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                  <v-pagination v-model="pagina2" class="my-4" :length="total2" :total-visible="9" @input="buscarPagos">
                  </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                  <v-select class="my-4" v-model="opcionActual2" :items="opciones2" dense solo @change="buscarPagos">
                  </v-select>
                </v-col>
              </v-row>
            </v-row>

            <v-dialog v-model="dialogoAdjunto" v-if="dialogoAdjunto" persistent width="750">
              <v-card>
                <v-toolbar dense dark color="titulo black--text">
                  <v-toolbar-title>Carga adjunto relación pagos</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-autocomplete v-model="prestadorCarga" :items="reps" item-value="id" item-text="nombre"
                            label="Nit-prestador" :error-messages="errorsCarga.prestador_id" :search-input.sync="rep"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on }">
                              <v-text-field v-model="fechaDesdeAdjunto" label="Año y mes" prepend-icon="mdi-calendar"
                                readonly v-on="on" :error-messages="errorsCarga.fecha">
                              </v-text-field>
                            </template>
                            <v-date-picker locale="es" color="info" v-model="fechaDesdeAdjunto" type="month"
                              @input="menu = false">
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <input ref="adjuntos" type="file" multiple />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="limpiarDialogoAdjunto()">
                    Cerrar
                  </v-btn>
                  <v-btn color="success" @click="cargaPagos()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonTesoreria',

    data() {
      return {
        relacionPagos: false,
        estadoCuenta: false,
        cargaRelacionPagos: false,
        fechaDesde: '',
        fechaDesdeCarga: '',
        fechaDesdeAdjunto: '',
        fechaCorte: '',
        menu: false,
        menu2: false,
        menu3: false,
        dialogoAdjunto: false,
        reps: null,
        rep: null,
        reps2: null,
        rep2: null,
        pagoCargado: [],
        pagoCargadoPrestador: [],
        adjuntos: [],
        prestador: '',
        prestadorCarga: '',
        pagina: 1,
        total: 0,
        opcionActual: 5,
        opciones: [5, 10, 20, 50, 100],
        pagina2: 1,
        total2: 0,
        opcionActual2: 5,
        opciones2: [5, 10, 20, 50, 100],
        headersCarga: [{
            text: 'id',
            align: 'left',
            value: 'id'
          },
          {
            text: 'Nombre',
            align: 'left',
            value: 'nombre'
          },
          {
            text: 'Fecha',
            align: 'left',
            value: 'fecha'
          },
          {
            text: 'Acciones',
            align: 'left',
            value: 'actions'
          }
        ],
        errors: {
          fecha: '',
          prestador_id: ''
        },
        errorsCarga: {
          fecha: '',
          prestador_id: ''
        }
      };
    },

    mounted() {
      // this.listarReps();
    },

    watch: {
      rep(val) {
        if (val) {
          if (val.length == 4 && this.prestadorCarga === '') {
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
          if (val.length == 4 && this.prestador === '') {
            this.listarReps2();
          } else if (val.length < 4) {
            this.reps2 = null;
          }
        } else {
          this.reps2 = null;

        }
      },
    },

    methods: {
      // listarReps() {
      //   this.preload = true
      //   this.$axios.post('prestador/listar?page=0', {
      //     prestador: 'prestador'
      //   }).then(res => {
      //     console.log('dfd', res.data);
      //     this.reps = res.data.data.map((rep) => {
      //       return {
      //         id: rep.id,
      //         nombre: `${rep.nombre_prestador} - ${rep.nit}`,
      //       }
      //     })
      //     this.reps2 = res.data.data.map((rep) => {
      //       return {
      //         id: rep.id,
      //         nombre: `${rep.nombre_prestador} - ${rep.nit}`,
      //       }
      //     })
      //     this.preload = false
      //   }).catch(e => {
      //     this.preload = false
      //     console.log(e);
      //   })
      // },


      listarReps() {
        this.$axios.post('reps/listar?page=0',{prestador: this.rep}).then(res => {
             this.reps = res.data.map((rep) => {
             return {
              id: rep.prestador_id,
              nombre: `${rep.prestadores.nombre_prestador} - ${rep.prestadores.nit}`,
             }
          })
        }).catch(e => {
          console.log(e);
        })
      },

      listarReps2() {
        this.$axios.post('reps/listar?page=0',{prestador: this.rep2}).then(res => {
             this.reps2 = res.data.map((rep) => {
             return {
              id: rep.prestador_id,
              nombre: `${rep.prestadores.nombre_prestador} - ${rep.prestadores.nit}`,
             }
          })
        }).catch(e => {
          console.log(e);
        })
      },



      buscarPagosPrestador() {
        const data = {
          fecha: this.fechaDesde
        }
        this.$axios.post('adjunto-relacion-pago/buscarPagosPrestador?page=' + this.pagina + '&cantidad=' + this
          .opcionActual, data).then(res => {
          this.pagoCargadoPrestador = res.data.data
          this.total = res.data.last_page
        }).catch(e => {
          console.log(e);
          this.ErrorEntrada(e.response.data)
        })
      },

      buscarPagos() {
        this.limpiarError()
        const data = {
          prestador_id: this.prestador,
          fecha: this.fechaDesdeCarga
        }
        this.$axios.post('adjunto-relacion-pago/buscarCargaPagos?page=' + this.pagina2 + '&cantidad=' + this
          .opcionActual2, data).then(res => {
          this.pagoCargado = res.data.data
          this.total2 = res.data.last_page
        }).catch(e => {
          console.log(e);
          this.ErrorEntrada(e.response.data)
        })
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

      limpiarDialogoAdjunto() {
        this.dialogoAdjunto = false
        this.$refs.adjuntos.value = ''
        this.fechaDesdeAdjunto = ''
        this.prestadorCarga = ''
      },

      cargaPagos() {
        this.limpiarErrorCargaPagos()
        this.adjuntos = this.$refs.adjuntos.files
        if (this.adjuntos.length <= 0) {
          this.$toast.error("Debe seleccionar un adjunto como minimo.");
          return;
        }
        const formData = new FormData();
        formData.append('prestador_id', this.prestadorCarga)
        formData.append('fecha', this.fechaDesdeAdjunto)
        for (let i = 0; i < this.adjuntos.length; i++) {
          formData.append(`adjuntos[]`, this.adjuntos[i]);
        }
        this.$axios.post('adjunto-relacion-pago/guardarCargaPagos', formData).then(res => {
          this.$toast.success(res.data)
          this.limpiarDialogoAdjunto()
        }).catch(error => {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntradaCargaPagos(error.response.data)
          }
        })
      },


      ErrorEntradaCargaPagos(errors) {
        for (const key in this.errorsCarga) {
          if (key in errors) {
            this.errorsCarga[key] = errors[key].join(',')
          }
        }
      },

      limpiarErrorCargaPagos() {
        for (const key in this.errorsCarga) {
          this.errorsCarga[key] = ''
        }
      },

      async imprimirAdjuntoFactura(item) {

        try {
          let adj = await this.$adjuntos(item.ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          this.$toast.error('El adjunto de la factura no existe!')
          console.log(error.response);
        }
      },

      EliminarAdjunto(item) {
        this.$axios.put('adjunto-relacion-pago/eliminar/' + item.id).then(res => {
          this.buscarPagos();
          this.$toast.success('Adjunto relación pagos eliminado con exito!')
        }).catch(e => {
          console.log(e);
        })
      },

      generarCorte() {
        this.$axios({
          method: 'post',
          params: {
            fecha: this.fechaCorte
          },
          url: '/adjunto-relacion-pago/estadoCuenta/',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'EstadodeCuenta';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false
          this.clear();
        }).catch(err => {
          console.log(err)
        })
      }


    },
  };

</script>

<style lang="scss" scoped>

</style>
