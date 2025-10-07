<template>
  <div>
    <div class="text-center">
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Tranquilo procesamos tu solicitud !
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogReporte" width="800">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Reporte Conteos
          </v-card-title>

          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">
                      #
                    </th>
                    <th class="text-center">
                      Bodega
                    </th>
                    <th class="text-center">
                      Fecha Creación
                    </th>
                    <th class="text-center">
                      Estado
                    </th>
                    <th class="text-center">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inventario in inventarios" :key="inventario.id">
                    <td class="text-center">{{ inventario.id}}</td>
                    <td class="text-center">{{ inventario.bodega.nombre }}</td>
                    <td class="text-center">{{ inventario.created_at.substr(0,10) }}</td>
                    <td class="text-center">
                      <v-chip small color="success">{{inventario.estado.nombre}}</v-chip>
                    </td>
                    <td class="text-center">
                      <v-btn color="primary" small @click="descargarDetalle(inventario)">Descargar</v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" dark @click="dialogReporte = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-card>
      <v-dialog v-if="datosInventarioBodega" v-model="dialogoInventario" fullscreen hide-overlay
        transition="dialog-bottom-transition" persistent>

        <v-dialog v-model="dialogAgregarMedicamento" width="800" persistent>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Agregar Medicamento/Lote
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">

                    <v-autocomplete :items="listaMedicamentos" v-model="formMedicamento.medicamento" :loading="loading"
                      label="Medicamento/Vademecum" :search-input.sync="filtroMedicamentos"
                      no-data-text="Digite el nombre del medicamento" item-text="nombre" item-value="id"
                      @input="buscarLote($event)">
                    </v-autocomplete>

                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field v-model="formMedicamento.lote" label="Lote"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field type="date" v-model="formMedicamento.fecha_vencimiento" label="Fecha Vencimiento">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-btn small color="success" dark class="mt-4" @click="agregarLote()">Agregar</v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">
                              Lote
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="lote in listaLotes0" :key="lote.id">
                            <td class="text-center">{{lote.codigo}}&nbsp;&nbsp;&nbsp;<v-btn v-if="!formMedicamento.lote"
                                x-small color="success" dark
                                @click="formMedicamento.loteExistente = lote.id;agregarLote()">Agregar</v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" dark @click="limpiarFormLote()">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="limpiarForms()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Inventario de la bodega: <b>{{datosInventarioBodega.cabecera.bodega.nombre}}</b>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-icon>mdi-folder-lock</v-icon>
            </v-toolbar-items>
          </v-toolbar>
          <v-col cols="12" md="12">
            <v-row>
              <v-col cols="12" sm="12" md="4">
                <Widget :color="'#3bc4ba'"
                  :title="String(datosInventarioBodega.detalles.filter(s => s.conteo1 === null || s.conteo1 === undefined || isNaN(s.conteo1) || parseInt(s.conteo1) < -1).length)"
                  subTitle="Conteo 1 Pendientes" />
              </v-col>

              <v-col cols="12" sm="12" md="4">
                <Widget :color="'#3bb168'"
                  :title="String(datosInventarioBodega.detalles.filter(s => (parseInt(s.conteo1) !== parseInt(s.cantidad) && (!s.conteo2 || s.conteo2 === undefined || isNaN(s.conteo2) || parseInt(s.conteo2) < -1))).length)"
                  subTitle="Conteo 2 Pendientes" />
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <Widget :color="'#3b96b1e0'"
                  :title="String(datosInventarioBodega.detalles.filter(s => (parseInt(s.cantidad) !== parseInt(s.conteo1) && parseInt(s.cantidad) !== parseInt(s.conteo2) && parseInt(s.conteo1) !== parseInt(s.conteo2) &&(!s.conteo3 || s.conteo3 === undefined  ||isNaN(s.conteo3) || parseInt(s.conteo3) < -1))).length)"
                  subTitle="Conteo 3 Pendientes" />

              </v-col>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <v-card-title>
            <v-btn class="ma-2" color="primary" :disabled="parseInt(datosInventarioBodega.cabecera.estado_id)!==1"
              @click="finalizarConteo(1)">Cerrar Conteo 1</v-btn>
            <v-btn class="ma-2" color="primary" :disabled="parseInt(datosInventarioBodega.cabecera.estado_id) !== 40"
              @click="finalizarConteo(2)">Cerrar Conteo 2</v-btn>
            <v-btn class="ma-2" color="primary" :disabled="parseInt(datosInventarioBodega.cabecera.estado_id) !== 41"
              @click="finalizarConteo(3)">Cerrar Conteo 3</v-btn>
            <v-divider class="ml-6" vertical></v-divider>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" class="ml-6" fab dark small color="success" @click="guardarProgreso()">
                  <v-icon dark>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Guardar Progreso</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" class="ml-2" fab dark small color="primary" @click="dialogAgregarMedicamento = true">
                  <v-icon dark>mdi-pill</v-icon>
                </v-btn>
              </template>
              <span>Agregar Medicamento/Lote</span>
            </v-tooltip>
            <v-spacer></v-spacer>

            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-card-text class="table-container">
            <v-data-table :headers="$can('conteo.CantidadInicial')?headersInventarioInicial:headersInventario"
              :items="datosInventarioBodega.detalles" :search="search">
              <template v-slot:item.conteo1form="{ item }">
                <v-text-field :rules="rules" min="0" hide-spin-buttons :type="parseInt(datosInventarioBodega.cabecera.estado_id)!==1?'password':'number'"
                  v-model="item.conteo1" :disabled="parseInt(datosInventarioBodega.cabecera.estado_id)!==1"
                  @input="progreso(item,$event)"></v-text-field>
              </template>
              <template v-slot:item.conteo2form="{ item }">
                <v-text-field :rules="rules" min="0" hide-spin-buttons :type="parseInt(datosInventarioBodega.cabecera.estado_id) !== 40?'password':'number'"
                  v-if="parseInt(item.conteo1) !== parseInt(item.cantidad)" v-model="item.conteo2"
                  :disabled="parseInt(datosInventarioBodega.cabecera.estado_id) !== 40" @input="progreso(item,$event)">
                </v-text-field>
              </template>
              <template v-slot:item.conteo3form="{ item }">
                <v-text-field :rules="rules" min="0" hide-spin-buttons
                  v-if="(parseInt(item.conteo1) !== parseInt(item.conteo2)) && (parseInt(item.conteo1) !== parseInt(item.cantidad)) && (parseInt(item.conteo2) !== parseInt(item.cantidad))"
                  type="number" v-model="item.conteo3"
                  :disabled="parseInt(datosInventarioBodega.cabecera.estado_id) !== 41" @input="progreso(item,$event)">
                </v-text-field>
              </template>
              <template v-slot:item.resultado="{ item }">
                <td v-if="parseInt(item.conteo1) === parseInt(item.conteo2)">{{item.conteo1}}</td>
                <td
                  v-else-if="parseInt(item.conteo1) === parseInt(item.cantidad) || parseInt(item.conteo2) === parseInt(item.cantidad)">
                  {{item.cantidad}}</td>
                <td v-else>{{item.conteo3}}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-dialog>


	  <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>INVENTARIO DE BODEGAS</b></v-alert>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="5">
            <v-autocomplete dense :items="bodegas" item-text="nombre" item-value="id" v-model="bodega_id"
              label="Selecciona la bodega" outlined></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="7">
            <v-btn small color="success" @click="registrarInventario()">
              Generar inventario
            </v-btn>
            <v-btn v-if="$can('conteo.reporte')" small color="warning" @click="listarInventarios()">
              Reporte
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-card-title>
              Inventarios generados
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
              </v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="inventariosActivos" :search="search">
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn depressed small color="warning" @click="reanudarInventario(item)">
                  Reanudar
                </v-btn>
              </template>
              <template v-slot:[`item.estado`]="{ item }">
                <td class="text-center">
                  <v-chip small color="primary">{{item.estado}}</v-chip>
                </td>
              </template>

            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonInventario',

    data() {
      return {
		rules: [
        	(valor) => valor >= 0 || "El valor no puede ser negativo",
      	],
        inventarios: [],
        dialogReporte: false,
        preload: false,
        listaLotes0: [],
        filtroMedicamentos: null,
        listaMedicamentos: [],
        loading: false,
        formMedicamento: {
          fecha_vencimiento: null,
          loteExistente: null,
          lote: null,
          medicamento: null,
        },
        dialogAgregarMedicamento: false,
        modificados: {},
        search: '',
        bodegas: [],
        datosInventarioBodega: null,
        bodega_id: null,
        inventariosActivos: [],
        dialogoInventario: false,
        medPendientesLasa: [{
            color: '#3bc4ba',
            title: '0',
            subTitle: 'Conteo 1 Pendientes',
          },
          {
            color: '#3bb168',
            title: '0',
            subTitle: 'Conteo 2 Pendientes',
          },
          {
            color: '#3b96b1e0',
            title: '0',
            subTitle: 'Conteo 3 Pendientes',
          },
        ],
        headers: [{
            text: 'Id',
            align: 'center',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Bodega',
            value: 'nombre',
            align: 'center',
          },
          {
            text: 'Fecha creación',
            align: 'center',
            value: 'created_at'
          },
          {
            text: 'Estado',
            align: 'center',
            value: 'estado'
          },
          {
            text: '',
            align: 'center',
            value: 'actions',
            sortable: false
          },
        ],
        headersInventarioInicial: [{
            text: '#',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Codigo',
            value: 'codigo_medicamento'
          },
          {
            text: 'Producto',
            value: 'producto'
          },
          {
            text: 'Titular',
            value: 'titular'
          },
          {
            text: 'Numlote',
            value: 'codigo'
          },
          {
            text: 'Fecha Vencimiento',
            value: 'fecha_vencimiento'
          },
          {
            text: 'Cantida Disponible',
            value: 'cantidad'
          },
          {
            text: 'Conteo 1',
            value: 'conteo1form'
          },
          {
            text: 'Conteo 2',
            value: 'conteo2form'
          },
          {
            text: 'Conteo 3',
            value: 'conteo3form'
          },
          {
            text: 'Resultado conteo',
            value: 'resultado',
            sortable: false
          },
        ],
        headersInventario: [{
            text: '#',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Codigo',
            value: 'codigo_medicamento'
          },
          {
            text: 'Producto',
            value: 'producto'
          },
          {
            text: 'Titular',
            value: 'titular'
          },
          {
            text: 'Numlote',
            value: 'codigo'
          },
          {
            text: 'Fecha Vencimiento',
            value: 'fecha_vencimiento'
          },
          {
            text: 'Conteo 1',
            value: 'conteo1form'
          },
          {
            text: 'Conteo 2',
            value: 'conteo2form'
          },
          {
            text: 'Conteo 3',
            value: 'conteo3form'
          },
          {
            text: 'Resultado conteo',
            value: 'resultado',
            sortable: false
          },
        ],
      };
    },
    watch: {
      filtroMedicamentos(val) {
        if (val && val.length === 4) {
          this.medicamentos();
        }
      }
    },
    created() {
      this.listarInventariosActivos()
      this.listarBodegas();
    },

    methods: {
      listarInventarios() {
        this.preload = true;
        this.$axios.get('inventario-farmacia/inventarios').then(res => {
          this.inventarios = res.data
          this.dialogReporte = true;
        }).catch(e => console.log(e.response)).finally(() => this.preload = false);
      },
      descargarDetalle(item) {
        this.preload = true;
        this.$axios.get('inventario-farmacia/reporte-detalle/' + item.id, {
          responseType: 'blob'
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = `InformeInventario.xlsx`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }).catch(e => console.log(e.response)).finally(() => this.preload = false);
      },
      listarBodegas() {
        this.preload = true;
        this.$axios.get('/bodegas/listarBodegasAsociadas').then(res => {
          this.bodegas = res.data;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },

      listarInventariosActivos() {
        this.preload = true;
        this.$axios.get('/inventario-farmacia/inventarioActivo').then(res => {
          this.inventariosActivos = res.data;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },

      registrarInventario() {
        this.preload = true;
        const data = {
          bodega_id: this.bodega_id
        }
        this.$axios.post('/inventario-farmacia/registrarInventario', data).then(res => {
          this.datosInventarioBodega = res.data
          this.dialogoInventario = true
          this.preload = false;
        }).catch(e => {
          this.$toast.error(e.response.data.mensaje)
          this.preload = false;
        })
      },

      reanudarInventario(item) {
        this.preload = true;
        this.$axios.get('inventario-farmacia/detalle-inventario/' + item.id).then(res => {
          this.datosInventarioBodega = res.data;
          this.dialogoInventario = true;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },
      finalizarConteo(conteo) {
        this.preload = true;
        if (parseInt(this.datosInventarioBodega.cabecera.estado_id) === 1 && this.datosInventarioBodega.detalles.filter(
            s => s.conteo1 === null || s.conteo1 === undefined || isNaN(s.conteo1) || parseInt(s.conteo1) < 0
          ).length > 0) {
          this.preload = false;
          return this.$toast.error('Hay valores pendiente en el primer conteo');
        }
        if (parseInt(this.datosInventarioBodega.cabecera.estado_id) === 40 && this.datosInventarioBodega.detalles
          .filter(s => (parseInt(s.conteo1) !== parseInt(s.cantidad) && (!s.conteo2 || s.conteo2 === undefined || isNaN(
            s.conteo2) || parseInt(s
            .conteo2) < -1))).length > 0) {
          this.preload = false;
          return this.$toast.error('Hay valores pendiente en el segundo conteo');
        }
        if (parseInt(this.datosInventarioBodega.cabecera.estado_id) === 41 && this.datosInventarioBodega.detalles
          .filter(s => ((parseInt(s.conteo1) !== parseInt(s.conteo2) && parseInt(s.conteo1) !== parseInt(s.cantidad) &&
            parseInt(s.conteo2) !== parseInt(s.cantidad)) && (!s.conteo3 || s.conteo3 === undefined || isNaN(s
            .conteo3) || parseInt(s
            .conteo3) < -1))).length > 0) {
          this.preload = false;
          return this.$toast.error('Hay valores pendiente en el tercer conteo');
        }
        this.$axios.post('inventario-farmacia/finalizar-conteo-' + conteo, this.datosInventarioBodega.detalles).then(
          res => {
            this.$toast.success(res.data.mensaje);
            this.datosInventarioBodega.cabecera = res.data.cabecera;
            this.preload = false;
            if (parseInt(res.data.cabecera.estado_id) === 22) {
              this.finalizarInventario();
            }
          }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },
      finalizarInventario() {
        this.preload = true;
        this.$axios.put('inventario-farmacia/finalizar-inventario/' + this.datosInventarioBodega.cabecera.id).then(
          res => {
            this.$toast.success(res.data.mensaje);
            this.limpiarForms();
            this.preload = false;
          }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },
      limpiarForms() {
        this.dialogoInventario = false;
        this.datosInventarioBodega = null;
        this.bodega_id = null;
        this.inventariosActivos = [];
        this.listarInventariosActivos();
        this.limpiarFormLote();
      },
      limpiarFormLote() {
        this.listaLotes0 = [];
        this.filtroMedicamentos = null;
        this.listaMedicamentos = [];
        this.loading = false;
        this.formMedicamento.fecha_vencimiento = null;
        this.formMedicamento.loteExistente = null;
        this.formMedicamento.lote = null;
        this.formMedicamento.medicamento = null;
        this.dialogAgregarMedicamento = false;
      },
      guardarProgreso() {
        this.preload = true;
        this.$axios.post('inventario-farmacia/guardar-progreso/' + this.datosInventarioBodega.cabecera.estado_id, this
          .modificados).then(res => {
          this.$toast.success(res.data.mensaje);
          this.modificados = {};
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },
      progreso(item, valor) {
        if (valor && !isNaN(valor) && parseInt(valor) >= 0) {
          this.modificados[item['id']] = valor;
        } else {
          delete this.modificados[item['id']];
        }
      },
      medicamentos() {
        this.loading = true;
        this.preload = true;
        this.$axios
          .get('inventario-farmacia/medicamentos-bodega/' + this.datosInventarioBodega.cabecera.bodega_id + '/' + this
            .filtroMedicamentos)
          .then((res) => {
            this.listaMedicamentos = res.data;
          })
          .catch((error) => {
            this.preload = false;
            console.log(error);
          })
          .finally(() => {
            this.preload = false;
            this.loading = false;
          });
      },
      buscarLote(id) {
        this.preload = true;
        this.$axios.get('inventario-farmacia/buscar-lotes/' + this.datosInventarioBodega.cabecera.id + '/' + id).then(
          res => {
            this.listaLotes0 = res.data
            this.preload = false;
          }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      },
      agregarLote() {
        this.preload = true;
        if (!this.formMedicamento.medicamento) {
          this.preload = false;
          return this.$toast.error('El campo "medicamento" es requerido.');
        }
        if (!this.formMedicamento.loteExistente && !this.formMedicamento.lote) {
          this.preload = false;
          return this.$toast.error('El campo "Lote" es requerido.');
        }
        if (!this.formMedicamento.loteExistente && !this.formMedicamento.fecha_vencimiento) {
          this.preload = false;
          return this.$toast.error('El campo "Fecha Vencimiento" es requerido.');
        }
        this.$axios.post('inventario-farmacia/agregar-lote/' + this.datosInventarioBodega.cabecera.id, this
          .formMedicamento).then(res => {
          this.datosInventarioBodega.detalles.push(res.data);
          this.limpiarFormLote();
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          console.log(e.response)
        })
      }
    }
  };

</script>

<style lang="scss" scoped>
  .app {
    background: lightgrey !important;
    height: 100vh;
    overflow: hidden;
  }

  .view {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }

  .card-top {
    padding: 20px;
  }

  .table-container {
    display: flex;
    margin-top: 20px;
    flex-grow: 1;
    overflow: hidden;
  }

  .flex-table {
    display: flex;
    flex-grow: 1;
    width: 100%;
  }

  .flex-table>div {
    width: 100%;
  }

</style>
