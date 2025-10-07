<template>
  <div>
    <v-card>
      <v-alert
        class="text-center"
        type="info"
        icon="mdi-checkbox-marked-circle-plus-outline"
        dense
        text
        border="left"
      >
        <b>RADICADOS</b></v-alert
      >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filtro.fecha_desde"
              label="Fehca desde"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="filtro.fecha_hasta"
              label="Fehca hasta"
              type="date"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="9">
            <v-autocomplete
              v-model="filtro.prestador_id"
              label="Nit-prestador"
              :items="reps"
              item-value="id"
              item-text="nombre"
              :search-input.sync="rep"
              dense
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="2" sm="2" md="2">
            <v-btn @click="buscarRadicados()" small dark color="info"
              >Filtrar</v-btn
            >
          </v-col>
          <v-spacer class="mt-3"></v-spacer>
        </v-row>
      </v-card-text>
      <v-data-table
        no-data-text="Aún no hay registros"
        dense
        :headers="headers"
        :items="listaPaquetes"
        class="elevation-1"
      >
        <template v-slot:[`item.estado`]="{ item }">
          <!-- <v-chip small :color="chipsEstado(item.estado)" dark>{{ item.estado == 1 ? 'Activa' : 'Inactiva' }}
          </v-chip> -->
          <td class="text-xs-center" v-if="item.parcial">
            <v-chip text-color="white" color="deep-purple accent-4"
              >Parcial</v-chip
            >
          </td>
          <td class="text-xs-center" v-else>
            <v-chip
              color="warning"
              text-color="white"
              v-if="parseInt(item.estado_id) === 13"
              small
              >Por Autorizar
            </v-chip>
            <v-chip
              color="success"
              text-color="white"
              v-else-if="parseInt(item.estado_id) === 14"
              small
            >
              Confirmado
            </v-chip>
            <v-chip
              color="error"
              text-color="white"
              v-else-if="parseInt(item.estado_id) === 30"
              small
            >
              Rechazado</v-chip
            >
          </td>
        </template>
        <template v-slot:[`item.valor`]="{ item }">
          <td>$ {{ Math.trunc(item.valor).toLocaleString("es-CO") }}</td>
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          <td>
            {{ item.created_at.substring(0, 10) }}
          </td>
        </template>
        <template v-slot:[`item.updated_at`]="{ item }">
          <td>
            {{ item.updated_at.substring(0, 10) }}
          </td>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="primary"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="cargarAf(item)"
              >
                mdi-eye
              </v-icon>
            </template>
            <span>Detalle</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('rips.descarga.json')">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                color="deep-orange darken-2"
                @click="descargarArchivo(item.id, item.url_json)"
              >
                <v-icon>mdi-code-json</v-icon>
              </v-btn>
            </template>
            <span>Descargar JSON</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('rips.descarga.cuv')">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                color="indigo darken-2"
                @click="descargarArchivo(item.id, item.url_cuv)"
              >
                <v-icon>mdi-code-block-braces</v-icon>
              </v-btn>
            </template>
            <span>Descargar CUV</span>
          </v-tooltip>

          <v-tooltip bottom v-if="$can('rips.descarga.xml')">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                icon
                color="purple darken-2"
                @click="descargarArchivo(item.id, item.url_xml)"
              >
                <v-icon>mdi-xml</v-icon>
              </v-btn>
            </template>
            <span>Descargar xml</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="warning"
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                v-if="parseInt(item.estado_id) !== 30"
                @click="
                  imprimir({
                    tipo: 'certificadoRips',
                    id: item.id,
                    tipoRip: item.parcial ? 2 : 1,
                  })
                "
              >
                mdi-download
              </v-icon>
            </template>
            <span>Imprimir certificado</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Tranquilo procesamos tu solicitud !
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isActiveAfDialog"
      persistent
      v-if="isActiveAfDialog"
      max-width="1250"
    >
      <v-alert border="top" colored-border type="info" elevation="2">
        <b>{{ repsDialog.razonSocial }}</b>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <span class="display-1 font-weight-bold"></span>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <span>
              <em
                >Cod. Hab. {{ repsDialog.code }} -
                {{ repsDialog.documentType }}
                {{ repsDialog.documentNumber }}</em
              >
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-layout row wrap justify-center>
              <span class="title font-weight-medium"
                >Archivo 'AF{{ paqCode }}'</span
              >
            </v-layout>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-data-table
              no-data-text="Aún no hay registros"
              dense
              :headers="afHeader"
              :items="afDialog"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:[`item.valor_neto`]="{ item }">
                <td>
                  $
                  {{ Math.trunc(item.valor_neto).toLocaleString("es-CO") }}
                </td>
              </template>
            </v-data-table>
          </v-col>
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <span class="title"
                >Número de facturas: {{ afDialog.length }}</span
              >
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" sm="6" md="6">
              <span class="title"
                >Valor de radicación: $
                {{ Math.trunc(totalValor).toLocaleString("es-CO") }}</span
              >
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="parseInt(estado) === 30">
              <v-label>
                <h4>Motivo Rechazo</h4>
              </v-label>
              <p>{{ Rip }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="12" md="12">
              <v-alert
                text
                dense
                color="teal"
                icon="mdi-clock-fast"
                border="left"
              >
                Soportes de la radicación
                <v-spacer></v-spacer>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
              <v-btn small color="warning" dark @click="descargarSoporte()">
                <v-icon left>mdi-download</v-icon> Descargar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="isActiveAfDialog = false" small
            >Cerrar</v-btn
          >
          <v-btn
            color="warning"
            dark
            @click="dialogoRechazar = true"
            small
            v-if="$can('rips.pendientes.rechazar') && parseInt(estado) === 13"
            >Rechazar</v-btn
          >
          <v-btn
            color="success"
            dark
            @click="acepartarRips()"
            small
            v-if="$can('rips.pendientes.guardar') && parseInt(estado) === 13"
            >Guardar facturas</v-btn
          >
          <v-btn
            color="warning"
            dark
            @click="pendientesRips()"
            small
            v-if="$can('rips.pendientes.guardar') && parseInt(estado) === 14"
            >Pendiente</v-btn
          >
        </v-card-actions>
      </v-alert>
    </v-dialog>
    <v-dialog
      v-model="dialogoRechazar"
      persistent
      v-if="dialogoRechazar"
      max-width="650"
    >
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <span class="display-1 font-weight-bold">Rechazar</span>
          </v-col>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-textarea v-model="motivoRechazoRip" label="Motivo">
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            dark
            @click="(dialogoRechazar = false), (motivoRechazoRip = '')"
            small
            >Cerrar</v-btn
          >
          <v-btn color="success" dark @click="rechazarRips()" small
            >Confirmar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "WorkspaceJsonRadicados",

  data() {
    return {
      nombreSoporte: null,
      filtro: {
        fecha_desde: moment().format("YYYY-MM-") + "01",
        fecha_hasta: moment().format("YYYY-MM-") + moment().daysInMonth(),
        prestador_id: "",
      },
      reps: null,
      rep: null,
      preload: false,
      listaPaquetes: [],
      headers: [
        {
          text: "# Radicado",
          align: "left",
          sortable: false,
          value: "id",
        },
        {
          text: "Paquete",
          align: "left",
          sortable: false,
          value: "nombre",
        },
        {
          text: "Entidad",
          align: "left",
          sortable: false,
          value: "afs[0].codigo_entidad",
        },
        {
          text: "Prestador",
          align: "left",
          sortable: false,
          value: "sede",
        },
        {
          text: "Valor",
          align: "rigth",
          sortable: false,
          value: "valor",
        },
        {
          text: "Fecha Carga",
          align: "rigth",
          sortable: false,
          value: "created_at",
        },
        {
          text: "Fecha Auditoria",
          align: "rigth",
          sortable: false,
          value: "updated_at",
        },
        {
          text: "Estado",
          align: "left",
          sortable: false,
          value: "estado",
        },
        {
          text: "Acciones",
          align: "center",
          sortable: false,
          value: "acciones",
        },
      ],
      id: null,
      parcialFacturas: null,
      Rip: "",
      estado: null,
      repsDialog: {},
      paqCode: "",
      afDialog: [],
      isActiveAfDialog: false,
      totalValor: 0,
      afHeader: [
        {
          text: "Número de factura",
          align: "center",
          value: "numero_factura",
          width: "5px",
          sortable: false,
          fixed: true,
        },
        {
          text: "Valor neto",
          align: "left",
          value: "valor_neto",
          width: "5px",
          sortable: false,
          fixed: true,
        },
      ],
      dialogoRechazar: false,
      motivoRechazoRip: "",
    };
  },

  mounted() {
    this.buscarRadicados();
  },

  watch: {
    rep(val) {
      if (val) {
        if (val.length == 4) {
          this.listarReps();
        } else if (val.length < 4) {
          this.reps = null;
        }
      } else {
        this.reps = null;
      }
    },
  },

  methods: {
    ...mapActions("app", ["setPreload"]),
    listarReps() {
      this.preload = true;
      this.$axios
        .post("prestador/listar?page=0", {
          prestador: this.rep,
        })
        .then((res) => {
          this.reps = res.data.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.nombre_prestador} - ${rep.nit}`,
            };
          });
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
          console.log(e);
        });
    },

    buscarRadicados() {
      this.preload = true;
      this.$axios
        .post("rips/obtenerRadicados", this.filtro)
        .then((res) => {
          this.listaPaquetes = res.data;
          console.log(this.listaPaquetes);

          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
        });
    },

    cargarAf(item) {

      this.Rip = item.motivo;
      this.parcialFacturas = item.parcial;
      this.estado = item.estado_id;
      this.id = item.id;
      this.repsDialog.razonSocial = item.sede;
      this.repsDialog.code = item.codigo_habilitacion;
      this.repsDialog.documentType = "NIT";
      this.repsDialog.documentNumber = item.nit;
      this.paqCode = item.nombre;
      this.afDialog = item.afs.sort();
      this.totalValor = item.valor;
      this.isActiveAfDialog = true;
    },

    rechazarRips() {
      if (!this.motivoRechazoRip) {
        return this.$swal({
          title: "¡Error!",
          text: "Debe poner un motivo",
          type: "warning",
        });
      }
      this.preload = true;
      this.$axios
        .post("rips/rechazarRips", {
          id: this.id,
          motivo: this.motivoRechazoRip,
        })
        .then((res) => {
          this.isActiveAfDialog = false;
          this.dialogoRechazar = false;
          this.motivoRechazoRip = "";
          this.buscarRadicados();
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
        });
    },

    acepartarRips() {
      return this.$swal({
        title: "",
        text: "Esta seguro de aceptar los archivos RIPS?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.value) {
          this.$axios
            .post("rips/aceptarRips", {
              id: this.id,
            })
            .then((res) => {
              this.isActiveAfDialog = false;
              this.buscarRadicados();
              this.preload = false;
            })
            .catch((error) => {
              this.preload = false;
            });
        }
      });
    },

    pendientesRips() {
      return this.$swal({
        title: "",
        text: "Esta seguro de devolver a pendiente los archivos RIPS?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.value) {
          this.$axios
            .post("rips/pendienteRips", {
              id: this.id,
            })
            .then((res) => {
              this.isActiveAfDialog = false;
              this.buscarRadicados();
              this.preload = false;
            })
            .catch((error) => {
              this.preload = false;
            });
        }
      });
    },

    imprimir(data) {
      this.$axios
        .post("pdf", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
    },

    descargarSoporte() {
      this.setPreload(true);
      this.$axios
        .post("rips/consultar-nombre-soporte", { adjuntoId: this.id })
        .then((res) => {
          for (const element of res.data) {
            this.setPreload(true);
            const data = {
              nombre_archivo: element,
              nombre_carpeta: `rips/sumimedical/${this.id}`,
              tiempo: 5,
            };
            this.$axios
              .post("adjuntos/generar-url-descarga-s3", data)
              .then((res2) => {
                window.open(res2.data, "_blank");
              })
              .catch((e2) => {
                console.log(e2);
              })
              .finally(() => this.setPreload(false));
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => this.setPreload(false));
    },
    descargarArchivo(id, ruta) {
      this.$axios
        .post("rips/descargar-soportes-json", {
          adjuntoId: id,
          ruta: ruta,
        })
        .then((res) => {
          const { nombreArchivo, contenidoBase64 } = res.data;

          // Crear un blob desde el base64
          const byteCharacters = atob(contenidoBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray]);

          // Crear URL para descargar
          const url = window.URL.createObjectURL(blob);

          // Crear un enlace temporal para descargar
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", nombreArchivo);
          document.body.appendChild(link);
          link.click();

          // Limpiar
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
