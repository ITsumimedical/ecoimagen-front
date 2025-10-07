<template>
  <div>
<v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="900px" v-model="modalCambiarEstado" v-if="modalCambiarEstado">
      <v-card>
        <v-alert dense text border="left" type="success">Acciones</v-alert>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6" md="3">
              <v-select dense v-model="formAuditoria.estado" label="Seleccionar acción*" :items="estadosActualizar"
                item-text="nombre" item-value="id"></v-select>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea dense auto-grow v-model="formAuditoria.observacion" label="Observaciones*" rows="2">
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="modalCambiarEstado = false">Cerrar</v-btn>
          <v-btn dark small color="success" @click="enviarEstado()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="350" v-model="dialogoNota" v-if="dialogoNota">
      <v-card>
        <v-alert dense text border="left" type="success">Nota</v-alert>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <h5>Anulacion realizada el día {{datosNota.created_at.substring(0,10)}} </h5>
              <div>
                <h4>Observación</h4>
              </div>
              <div>
                <p>{{datosNota.observacion}}</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="dialogoNota = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="ModalPrestadorprestador" persistent width="550" v-if="$can('actualizar.prestadorServicios')">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Modificar prestador</h4>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete no-data-text="Digite el nombre del prestador para inciar la búsqueda"
              :search-input.sync="prestador" dense v-model="cambioRep.rep_id" :items="listaPrestadores"
              item-text="nombre" return-object label="Prestador*">
            </v-autocomplete>
          </v-col>
          <v-row>
            <v-col cols="12" sm="12" md="12">

            </v-col>
          </v-row>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="ModalPrestadorprestador = false,limpiarData()">
            Cerrar
          </v-btn>
          <v-btn color="success" dark small @click="actualizarRep()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalAnularOrdenes" persistent width="550">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Observacion de anulación</h4>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-textarea auto-grow v-model="ordenAnular.observacionAnular" label="Observación" dense>
            </v-textarea>
          </v-col>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="modalAnularOrdenes = false,limpiarData()">
            Cerrar
          </v-btn>
          <v-btn color="success" dark small @click="anularOrden()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modaldescricionAuditoria" persistent width="550">
      <v-card>
        <v-alert border="left" text dense type="info">
          <h4>Observaciones de auditoria</h4>
        </v-alert>
        <v-container>
          <v-row dense>
            <v-col v-for="item in descripcionAuditoria" :key="item" cols="12" sm="12" md="12">
              <h5>Auditoria realizada el día {{item.created_at.substring(0,10)}} </h5>
              <div>
                <h4>Observación</h4>
              </div>
              <div>
                <p>{{item.observaciones}}</p>
              </div>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="modaldescricionAuditoria = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalEmail" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Enviar Orden</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field v-model="emailEnvio" label="Email" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="emailEnvio = null;datosEnvioEmail = null; modalEmail = false;">Cerrar</v-btn>
          <v-btn color="success" @click="SendEmail()">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent width="1500px" v-model="dialogoDetalleOrden">
      <v-card>
        <v-alert dense text border="left" type="success">Detalle de la orden</v-alert>
        <v-col cols="12" sm="12" md="12">
          <AfiliadoComponent :datos="afiliado" :datosBasicos="true" :camposNoEditables="true"
            :actualizarDatosAfiliado="true" @respuestaComponente="componente = null" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-alert dense text border="left" type="success">Adjuntos</v-alert>
          <v-col cols="12" sm="12" md="12">
            <v-data-table :headers="filesHeaders" :items="listaAdjuntos" dense
              no-data-text="El afiliado no tiene adjuntos">
              <template v-slot:[`item.created_at`]="{ item }">
                <td>
                  {{item.created_at.substring(0,10)}}
                </td>
              </template>
              <template v-slot:[`item.acciones`]="{ item }">

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="consultarAdjunto(item.ruta)">
                      mdi-file-document
                    </v-icon>
                  </template>
                  <span>Gestionar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark small color="red" @click="dialogoDetalleOrden = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card>
      <v-card-text>
        <v-col cols="12" sm="12" md="12">
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-alert dense text border="left" color="info" class="text-center"><b>Histórico de medicamentos ordenados</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field label="Buscar" hint="Puedes realizar la búsqueda por cualquier campo" v-model="search" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-data-table dense :search="search" no-data-text="No hay registros" v-if="ordenes.length >0"
                :headers="headersMedicamentos" :items="ordenes">
                <template v-slot:[`item.fechaCreacion`]="{ item }">
                  <td class="text-center">{{item.created_at.substr(0,10)}}</td>
                </template>
                <template v-slot:[`item.dosis`]="{ item }">
                  <td>tomar {{item.dosis}} {{item.unidad_presentacion}} cada {{item.frecuencia}}
                    {{item.unidad_tiempo}}</td>
                </template>
                <template v-slot:[`item.prestador`]="{ item }">
                  <td @click="openDialog(item)">{{item.rep ? item.rep.nombre:'Sin direccion'}}</td>
                </template>
                <template v-slot:[`item.estado`]="{ item }">
                  <td class="text-center">
                    <v-chip small v-if="parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4"
                      color="success">
                      {{item.estado.nombre}}</v-chip>
                    <v-chip small v-else-if="parseInt(item.estado_id) === 3" color="warning"
                      @click="verNota(item.cambio_orden)">{{item.estado.nombre}}</v-chip>
                    <v-chip small v-else-if="parseInt(item.estado_id) === 5" color="error"
                      @click="verNota(item.cambio_orden)">
                      {{item.estado.nombre}}</v-chip>
                    <v-chip small v-else-if="parseInt(item.estado_id) === 10" color="error"
                      @click="verNota(item.cambio_orden)">
                      {{item.estado.nombre}}</v-chip>
                  </td>
                </template>
                <template v-slot:[`item.detalles`]="{ item }">
                  <v-tooltip bottom v-if="item.estado_id ==1 || item.estado_id ==4 ">
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="info" v-on="on" @click="abrirModalDetalle(item)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Adjuntos</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="(item.estado_id ==1 || item.estado_id ==4 || item.estado_id ==20)">
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="blue-grey" v-on="on" @click="modaldescripcionAuditoria(item)">
                        <v-icon>mdi-message-alert </v-icon>
                      </v-btn>
                    </template>
                    <span>Observaciones de Auditoria</span>
                  </v-tooltip>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                  <td class="text-center">
                    <v-tooltip bottom v-if="item.estado_id ==1 || item.estado_id ==4 ">
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="green" v-on="on" @click="imprimir(item)">
                          <v-icon>mdi-file-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Descargar</span>
                    </v-tooltip>
                    <v-tooltip bottom
                      v-if="(item.estado_id ==1 || item.estado_id ==4) && $can('historico.servicios.anular')">
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="error" v-on="on" @click="modalAnularOrden(item)">
                          <v-icon>mdi-close-circle </v-icon>
                        </v-btn>
                      </template>
                      <span>Anular</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="item.estado_id ==1 || item.estado_id ==4 ">
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="warning" v-on="on" @click="datosEnvioEmail = item;modalEmail = true">
                          <v-icon>mdi-email-fast </v-icon>
                        </v-btn>
                      </template>
                      <span>Enviar Correo</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" class="text--right" dark small @click="$emit('respuestaComponente')">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonHistoricoMedicamentosComponent',
    props: {
      datosCita: Object
    },
    data() {
      return {
            ordenes: [],
        modalServicios: false,
        datosEnvioEmail: null,
      modalAnularOrdenes:false,
      dialogoDetalleOrden: false,
      modaldescricionAuditoria:false,
      listaPrestadores: [],
      dialogoAnular: false,
      emailEnvio: null,
      modalEmail: false,
      dialogoNota: false,
      cargando: false,
      afiliado: [],
      formAuditoria: {
        estado: null,
        observacion: null
      },
      cambioRep: {
        rep_id: null,
      },
      descripcionAuditoria:[],
      ModalPrestadorprestador: false,
      datosNota: {},
      modalCambiarEstado: false,
      dialogoExportar: false,
      search: '',
      formFilter: {
        documento: '',
        tipo: 1,
      },
      ordenes: [],
      tipos: [],
      filesHeaders: [{
          text: "Nombre",
          align: "center",
          value: "nombre"
        },
        {
          text: "Fecha",
          align: "",
          value: "created_at"
        },
        {
          text: "Adjunto",
          align: "center",
          value: "acciones"
        }
      ],
      headersMedicamentos: [{
          text: '# Consecutivo',
          align: 'center',
          sortable: true,
          value: 'id',
        },
        {
          text: '# Orden',
          align: 'center',
          sortable: false,
          value: 'orden_id',
        },
        {
          text: 'Paginacion',
          align: 'center',
          sortable: false,
          value: 'paginacion',
        },
        {
          text: 'Fecha creacion',
          align: 'center',
          sortable: true,
          value: 'fechaCreacion',
        },
        {
          text: 'Fecha vigencia',
          align: 'center',
          sortable: true,
          value: 'fecha_vigencia',
        },
        {
          text: 'Código',
          align: 'center',
          sortable: false,
          value: 'codigo',
        },
        {
          text: 'Nombre',
          align: 'center',
          sortable: false,
          value: 'nombre',
        },
        {
          text: 'Administración',
          align: 'center',
          sortable: false,
          value: 'via',
        },
        {
          text: 'Dosificación',
          align: 'center',
          sortable: false,
          value: 'dosis',
        },
        {
          text: 'Duración',
          align: 'center',
          sortable: false,
          value: 'duracion',
        },
        {
          text: '# total a dispensar',
          align: 'center',
          sortable: false,
          value: 'cantidad_mensual_disponible',
        },
        {
          text: 'Estado',
          align: 'center',
          sortable: false,
          value: 'estado',
        },
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'imprimir',
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'acciones',
        },
      ],
      headersServicios: [{
          text: '# Consecutivo',
          align: 'center',
          sortable: true,
          value: 'id',
        },
        {
          text: '# Orden',
          align: 'center',
          sortable: false,
          value: 'orden_id',
        },
        {
          text: 'Fecha creacion',
          align: 'center',
          sortable: true,
          value: 'fechaCreacion',
        },
        {
          text: 'Fecha vigencia',
          align: 'center',
          sortable: true,
          value: 'fecha_vigencia',
        },
        {
          text: 'Dirección prestador',
          align: 'center',
          value: 'prestador',
        },
        {
          text: 'Codigo',
          align: 'center',
          sortable: false,
          value: 'codigo',
        },
        {
          text: 'Nombre',
          align: 'center',
          sortable: false,
          value: 'nombre',
        },
        {
          text: 'Cantidad',
          align: 'center',
          sortable: false,
          value: 'cantidad',
        },
        {
          text: 'Estado',
          align: 'center',
          sortable: false,
          value: 'estado',
        },
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'imprimir',
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'acciones',
        },
        {
          text: 'Detalles',
          align: 'center',
          sortable: false,
          value: 'detalles',
        },
      ],
      ordenAnular:{
        observacionAnular: null,
      },
      tipoOrden: '',
      prestador: '',
      listaAdjuntos: [],
      reporte: {
        fecha_inicial: '',
        fecha_final: '',
        estado_id: '',
      },
      estados: [{
        nombre: 'PENDIENTE',
        id: 3
      }, {
        nombre: 'INADECUADO',
        id: 20
      }, {
        nombre: 'NEGADO',
        id: 21
      }, {
        nombre: 'ANULADO',
        id: 5
      }, {
        nombre: 'APROBADO SIN AUTORIZACIÓN',
        id: 1
      }, {
        nombre: 'APROBADO CON AUTORIZACIÓN',
        id: 4
      }],
      estadosActualizar: [{
          id: 4,
          nombre: "Autorizado"
        },
        {
          id: 20,
          nombre: "Inadecuado"
        },
        {
          id: 21,
          nombre: "Negado"
        },
        {
          id: 5,
          nombre: "Anulado"
        },
      ],
      preload:false
      };
    },

    mounted() {
      this.buscarServicios();
    },

    methods: {
      validarErrores() {
              return [];
            },
    buscarServicios() {
        this.ordenes = [];
        let Data = {
          'documento': this.datosCita.afiliado.numero_documento,
          'tipo': 1,
        }
        this.preload=true
        this.$axios.post('/ordenamiento/historico', Data).then(
          res => {
            // this.cargando = false;
            this.ordenes = res.data
            this.modalServicios = true
            this.preload=false
          })
      },

      imprimir(item) {
        if (this.formFilter.tipo === 1) {
          this.tipoOrden = 'medicamento'
        } else {
          this.tipoOrden = 'servicio'
        }

        let pdf = {
          tipo: this.tipoOrden,
          id: item.orden_id,
          detalles: {
            id: item.id
          }
        };
        this.$axios.post("/pdf", pdf, {
            responseType: "arraybuffer"
          })
          .then(res => {
            let blob = new Blob([res.data], {
              type: "application/pdf"
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            window.open(link.href, "_blank");
          });
      },

      cambiarEstado(item) {
        this.modalCambiarEstado = true
        this.formAuditoria.id = item.id
        if (this.formFilter.tipo === 1) {
          this.formAuditoria.tipo = 1
        } else {
          this.formAuditoria.tipo = 2
        }
      },

      enviarEstado() {
        let data = this.formAuditoria
        if (data.observacion === null || data.estado === null) {
          return this.$swal.fire({
            title: "¡No puede ser!",
            text: "Debe determinar un estado e ingresar una observación",
            type: "error",
            footer: '<p>Por favor valide la información ingresada</p>'
          });
        }
        this.preload = true
        this.$axios.$post('/auditoria/cambiar-auditoria-estado', data).then(res => {
          this.preload = false
          this.buscarOrdenes();
          this.modalCambiarEstado = false;
          for (const key in this.formAuditoria) {
            this.formAuditoria[key] = "";
          }
        }).catch((e) => {
          this.preload = false
        });
      },

      verNota(item) {
        if (item) {
          if (item.length > 0) {
            this.datosNota = item[0]
            this.dialogoNota = true;
          }
        }
      },

      modalAnularOrden(item){
        this.modalAnularOrdenes = true;
        this.ordenAnular = item
      },

      modaldescripcionAuditoria(item){
        this.modaldescricionAuditoria = true;
        this.descripcionAuditoria = item.auditoria
      },

      anularOrden() {
        this.$swal({
          title: "¿Esta seguro que desea anular la orden?",
          text: "Al aceptar este mensaje, se realizara el cambio del estado",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",

        }).then((result) => {
          if (result.value) {
            this.modalAnularOrdenes = false;
            this.preload = true;
            let Data = {
              'tipo': this.formFilter.tipo,
              'id': this.ordenAnular.id,
              'observacion': this.ordenAnular.observacionAnular,
              'estado': 5
            }
            this.$axios.post("/auditoria/cambiar-auditoria-estado", Data)
              .then((res) => {
                this.$toast.success("Se cambió el estado de la orden correctamente");
                this.preload = false;
                this.buscarOrdenes();
              })
              .catch((error) => {
                this.preload = false;
                this.$toast.error("Error al cambiar el estado de la orden");
              });
          }
        });

      },

      abrirModalDetalle(item) {
        console.log(item);
        this.dialogoDetalleOrden = true;
        this.afiliado = item.orden.consulta.afiliado;
        this.buscarAdjuntos(item.orden.consulta.afiliado.id)
      },

      buscarAdjuntos(item) {
        this.preload = true
        this.$axios.post("transcripciones/buscarAdjuntos", {
            afiliado_id: item
          }).then((res) => {
            this.listaAdjuntos = res.data;
            this.preload = false;
          })
          .catch((e) => {
            this.preload = false
            this.$toast.error(e.response.data.error);
          });
      },

      async consultarAdjunto(ruta) {
        try {
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          console.log(error.Response);
        }
      },

      listarPrestadores() {
        this.cargando = true;
        this.$axios.post('reps/listar?page=0', {
          prestador: this.prestador
        }).then(res => {
          this.cargando = false;
          this.listaPrestadores = res.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
            }
          })
        }).catch(e => {
          this.cargando = false;
          console.log(e);
        })
      },

      openDialog(item) {
        this.ModalPrestadorprestador = true
        this.cambioRep.id = item.id
      },

      actualizarRep() {
        this.preload = true;
        this.$axios.post('ordenamiento/actualizarRep', {
          id: this.cambioRep.id,
          rep_id: this.cambioRep.rep_id.id
        }).then(res => {
          this.preload = false;
          this.limpiarData()
          this.ModalPrestadorprestador = false
          this.dialogDetalle = false
          this.buscarOrdenes()
        }).catch(e => {
          this.preload = false;
          console.log(e);
        })
      },

      limpiarData() {
        for (const key in this.cambioRep) {
          this.cambioRep[key] = null;
        }

      },
      SendEmail() {
        var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (!regex.test(this.emailEnvio)) {
          return this.$swal.fire({
            title: "Debe ingresar un Email valido",
            icon: "warning",
            type: "error",
          });
        }

        let pdf = {
          tipo: 'servicio',
          enviar: true,
          correo: this.emailEnvio,
          detalles: {
            id: this.datosEnvioEmail.id
          }
        }
        this.$axios.post('pdf', pdf).then(res => {
          this.emailEnvio = null;
          this.datosEnvioEmail = null;
          this.modalEmail = false;
          return this.$swal.fire({
            title: "¡Orden enviada con exito!",
            icon: "success",
            type: "success",
          });
        }).catch(err => (err.response));
      }


    },
  };

</script>
