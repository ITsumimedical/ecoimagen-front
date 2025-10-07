<template>
    <div>
      <!-- Preload -->
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
  
      <v-row dense class="mt-4 mx-4">
        <v-col v-for="solicitud in tipoSolicitudes" :key="solicitud.id" cols="12" sm="2" md="2">
          <v-alert style="cursor: pointer" dense text :color="solicitud.color" :icon="solicitud.icon" border="left"
            @click="obtenerSolicitudes(solicitud.id)">
            <v-badge color="orange" :content="solicitud.quantity" bordered><b>{{ solicitud.title }}</b></v-badge>
          </v-alert>
        </v-col>
      </v-row>
      <v-row dense class="mx-4">
        <v-col cols="12" sm="6" md="2">
          <v-text-field dense outlined label="N° Radicado" v-model="filtro.numero_radicado"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field dense outlined label="N° Documento Afiliado" v-model="filtro.documento_afiliado"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="1">
          <v-menu dense v-model="menuDesde" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="filtro.fecha_desde" label="Desde" append-icon="mdi-calendar" readonly dense outlined
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="filtro.fecha_desde" @input="menuDesde = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="1">
          <v-menu dense v-model="menuHasta" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="filtro.fecha_hasta" label="Desde" append-icon="mdi-calendar" readonly dense outlined
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="filtro.fecha_hasta" @input="menuHasta = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field dense outlined label="Departamento" v-model="filtro.departamento"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field dense outlined label="Municipio" v-model="filtro.municipio"></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="2" style="display: flex; justify-content: center; gap: 0.5rem">
          <v-btn color="info" dar style="width: 49%" @click="filtrarSolicitudes">BUSCAR</v-btn>
          <v-btn color="error" dark style="width: 49%" @click="limpiarFiltros">LIMPIAR</v-btn>
        </v-col>
  
        <v-col cols="12" sm="12" md="12">
          <v-data-table disable-pagination hide-default-footer dense :headers="headersSolicitudesPendientes"
            :items="solicitudesPendientes.data" loading-text="Cargando..." :loading="loading.tablaSolicitudesPendientes">
            <template v-slot:[`item.estado`]="{ item }">
              <v-chip small :color="item.estado?.id == 10 ? 'warning' : 'success'">
                {{ item.estado?.nombre }}
              </v-chip>
            </template>
  
            <template v-slot:[`item.acciones`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-icon small class="mr-2" color="info" v-bind="attrs" v-on="on" @click="verDetalles(item)">
                    mdi-eye</v-icon>
                </template>
                <span>Ver Detalles</span>
              </v-tooltip>
            </template>
            <template slot="no-data">No hay solicitudes para este tipo.</template>
          </v-data-table>
          <v-pagination class="my-4" v-model="paginationSolicitudes.page" :length="
              Math.ceil(
                paginationSolicitudes.totalItems /
                  paginationSolicitudes.rowsPerPage
              )
            " @input="filtrarSolicitudes" :total-visible="paginationSolicitudes.totalVisible"></v-pagination>
        </v-col>
      </v-row>
  
      <detallesAsignadasPendientes :isOpen="abrirModalDetalles" :solicitud="solicitudSeleccionada"
        @close="cerrarModalDetalles" @enviarGestion="enviarGestion" @registrarBeneficiario="registrarBeneficiario"></detallesAsignadasPendientes>
  
    </div>
  </template>
  
  <script>
    import detallesAsignadasPendientes from '~/components/solicitudes/detallesAsignadasPendientes.vue';
  
    export default {
      name: 'SolicitudesAsignadasPendientes',
      components: {
        detallesAsignadasPendientes
      },
      data() {
        return {
          preload: false,
          tipoSolicitudes: [{
              id: 1,
              color: "#00b297",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Cambio Punto de Atención",
            },
            {
              id: 10,
              color: "orange darken-1",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Transcripción de Medicamentos",
            },
            {
              id: 12,
              color: "blue darken-1",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Transcripción de Servicios",
            },
            {
              id: 13,
              color: "#00b297",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Transcripción de Oncología",
            },
            {
              id: 26,
              color: "orange darken-1",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Registro de Beneficiarios",
            },
            {
              id: 27,
              color: "blue darken-1",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Traslado de Beneficiarios",
            },
            {
              id: 28,
              color: "#00b297",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Retiros",
            },
            {
              id: 29,
              color: "orange darken-1",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Actualización de Datos Básicos",
            },
            {
              id: 30,
              color: "blue darken-2",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Cambio de Beneficiario entre Cotizantes",
            },
            {
              id: 11,
              color: "#00b297",
              icon: "mdi-clipboard-text",
              quantity: "0",
              title: "Transcripción de Incapacidades",
            },
          ],
          headersSolicitudesPendientes: [{
              text: "Radicado",
              value: "id",
            },
            {
              text: "Fecha Radicación",
              value: "created_at",
            },
            {
              text: "Afiliado",
              value: "afiliado.nombre_completo",
            },
            {
              text: "N° Documento",
              value: "afiliado.numero_documento",
            },
            {
              text: "IPS",
              value: "afiliado.ips.nombre",
            },
            {
              text: "Departamento",
              value: "afiliado.departamento_afiliacion.nombre",
            },
            {
              text: "Municipio",
              value: "afiliado.municipio_afiliacion.nombre",
            },
            {
              text: "Tipo de Solicitud",
              value: "tipo_solicitud_red_vital.nombre",
            },
            {
              text: "Estado",
              value: "estado",
              sortable: false,
              align: "center",
            },
            {
              text: "Acciones",
              value: "acciones",
              sortable: false,
              align: "center",
            },
          ],
          solicitudesPendientes: {
            data: [],
          },
          loading: {
            tablaSolicitudesPendientes: false,
          },
          filtro: {
            numero_radicado: null,
            documento_afiliado: null,
            fecha_desde: null,
            fecha_hasta: null,
            departamento: null,
            municipio: null,
            tipo_solicitud_id: null,
          },
          menuDesde: false,
          menuHasta: false,
          paginationSolicitudes: {
            page: 1,
            rowsPerPage: 10,
            totalItems: 0,
            totalVisible: 9,
          },
          abrirModalDetalles: false,
          solicitudSeleccionada: {},
        };
      },
      created() {
        this.obtenerCantidadAsignadasPendientes()
      },
      methods: {
        obtenerCantidadAsignadasPendientes() {
          this.$axios
            .post("/radicacion-online/obtenerCantidadSolicitudesTipo", {
              estado_id: 10
            })
            .then((response) => {
              const cantidades = response.data;
              this.tipoSolicitudes.forEach((solicitud) => {
                solicitud.quantity = cantidades[solicitud.id] || "0";
              });
            })
            .catch((error) => {
              console.error("Error al obtener las cantidades pendientes:", error);
            });
        },
  
        obtenerSolicitudes(tipo_id) {
          this.filtro = {
            numero_radicado: null,
            documento_afiliado: null,
            fecha_desde: null,
            fecha_hasta: null,
            departamento: null,
            municipio: null,
            tipo_solicitud_id: this.filtro.tipo_solicitud_id,
            estado_id: 10,
            page: 1,
            per_page: 10,
          };
          this.filtro.tipo_solicitud_id = tipo_id;
          this.filtro.estado_id = 10;
          this.filtrarSolicitudes();
        },
  
        filtrarSolicitudes() {
          this.loading.tablaSolicitudesPendientes = true;
          this.filtro.page = this.paginationSolicitudes.page;
          this.filtro.per_page = this.paginationSolicitudes.rowsPerPage;
          this.$axios
            .post("/radicacion-online/listarSolicitudesAsignadas", this.filtro)
            .then((res) => {
              this.solicitudesPendientes = res.data;
              this.paginationSolicitudes.totalItems = res.data.total;
            })
            .catch((e) => {
              this.$toast.error("Error al cargar las solicitudes pendientes");
              console.log(e);
            })
            .finally(() => {
              this.loading.tablaSolicitudesPendientes = false;
            });
        },
  
        limpiarFiltros() {
          this.filtro = {
            numero_radicado: null,
            documento_afiliado: null,
            fecha_desde: null,
            fecha_hasta: null,
            departamento: null,
            municipio: null,
            tipo_solicitud_id: this.filtro.tipo_solicitud_id,
            estado_id: 10,
            page: 1,
            per_page: 10,
          };
          this.filtrarSolicitudes();
        },
  
        verDetalles(item) {
          this.solicitudSeleccionada = item;
          this.abrirModalDetalles = true;
        },
  
        cerrarModalDetalles() {
          this.abrirModalDetalles = false;
          this.solicitudSeleccionada = {};
        },
  
        enviarGestion(data) {
          const formData = new FormData();
          this.preload = true;
          switch (data.accion.id) {
            case 1:
            case 2:
              formData.append(`radicacion_online_id`, data.solicitud_id);
              formData.append(`accion`, data.accion.text);
              formData.append(`motivo`, data.observacion);
              formData.append(`gestionando`, data.estaGestionando);
              formData.append(`fecha_inicio`, data.fecha_inicio);
              formData.append(`fecha_final`, data.fecha_final);
              if (data.adjuntos.length >= 1) {
                for (let i = 0; i < data.adjuntos.length; i++) {
                  formData.append(`adjuntos[]`, data.adjuntos[i]);
                }
              } else {
                formData.append(`adjuntos`, null);
              }
  
              this.$axios
                .post("/radicacion-online/comentar", formData)
                .then((res) => {
                  this.$toast.success(res.data);
                  this.obtenerCantidadAsignadasPendientes();
                  this.obtenerSolicitudes(this.filtro.tipo_solicitud_id);
                  this.cerrarModalDetalles();
                })
                .catch((err) => {
                  this.$toast.error("Ocurrió un error al gestionar la solicitud");
                  console.log(err);
                })
                .finally(() => {
                  this.preload = false;
                });
              break;
  
            case 3:
              const form = {
                radicacion_online_id: data.solicitud_id,
                usuarios: data.areas,
                fecha_inicio: data.fecha_inicio,
                fecha_final: data.fecha_final,
                motivo: data.observacion,
              };
  
              this.$axios
                .post("/radicacion-online/devolver", form)
                .then((res) => {
                  this.$toast.success(res.data);
                  this.obtenerCantidadAsignadasPendientes();
                  this.obtenerSolicitudes(this.filtro.tipo_solicitud_id);
                  this.cerrarModalDetalles();
                })
                .catch((err) => {
                  this.$toast.error("Ocurrió un error al gestionar la solicitud");
                  console.log(err);
                })
                .finally(() => {
                  this.preload = false;
                });
              break;
  
            case 4:
              formData.append(`radicacion_online_id`, data.solicitud_id);
              formData.append(`motivo`, data.observacion);
              formData.append(`numero_documento`, data.documento_afiliado);
              formData.append(`fecha_inicio`, data.fecha_inicio);
              formData.append(`fecha_final`, data.fecha_final);
  
              if (data.adjuntos.length >= 1) {
                for (let i = 0; i < data.adjuntos.length; i++) {
                  formData.append(`adjuntos[]`, data.adjuntos[i]);
                }
              } else {
                formData.append(`adjuntos`, null);
              }
  
              this.$axios
                .post("/radicacion-online/respuesta", formData)
                .then((res) => {
                  this.$toast.success(res.data);
                  this.obtenerCantidadAsignadasPendientes();
                  this.obtenerSolicitudes(this.filtro.tipo_solicitud_id);
                  this.cerrarModalDetalles();
                })
                .catch((err) => {
                  this.$toast.error("Ocurrió un error al gestionar la solicitud");
                  console.log(err);
                })
                .finally(() => {
                  this.preload = false;
                });
              break;
  
            default:
              this.$toast.error("Acción no reconocida");
              this.preload = false;
              break;
          }
        },
  
        registrarBeneficiario(data) {
          this.preload = true;
          this.$axios.post("/afiliados/registrarBeneficiario", data).then((res) => {
            this.$toast.success(res.data.mensaje);
          }).catch((err) => {
            this.$toast.error(err.response.data.mensaje);
            console.log(err.response);
            // console.log(err);
          }).finally(() => {
            this.preload = false;
          })
        }
      },
    };
  
  </script>