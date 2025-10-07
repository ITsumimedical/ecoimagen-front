<template>
  <div>
    <v-row dense class="mt-4">
      <v-col cols="12" md="12" sm="12" class="mb-2">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <v-select
          dense
          outlined
          append-icon="mdi-filter-variant"
          label="Tipo de Solicitud"
          :items="opcionesTiposSolicitud"
          v-model="filtros.tipo_solicitud_id"
          item-text="nombre"
          item-value="id"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <v-menu
          dense
          v-model="menu.fecha_inicio"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              outlined
              label="Fecha Inicio"
              v-model="filtros.fecha_inicio"
              append-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              readonly
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filtros.fecha_inicio"
            @input="menu.fecha_inicio = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <v-menu
          dense
          v-model="menu.fecha_fin"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              dense
              outlined
              label="Fecha Fin"
              v-model="filtros.fecha_fin"
              append-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              readonly
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filtros.fecha_fin"
            @input="menu.fecha_fin = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="3" sm="3">
        <v-autocomplete
          dense
          outlined
          v-model="filtros.ips_id"
          label="Sede"
          item-text="nombre"
          item-value="id"
          :search-input.sync="campoBusquedaIps"
          :loading="loading.ips"
          :items="opcionesIps"
          no-data-text="Digite el nombre de la sede para iniciar la búsqueda."
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3" sm="3">
        <v-text-field
          dense
          outlined
          label="N° de Documento"
          v-model="filtros.numero_documento"
          @keyup.enter="listarTelesaludSolucionadas()"
          single-line
          clearable
          hide-details
          @click:clear="listarTelesaludSolucionadas()"
          append-icon="mdi-account-search"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="12" sm="12" align="right">
        <v-btn color="primary" @click="listarTelesaludSolucionadas()" small
          >Filtrar</v-btn
        >
        <v-btn color="warning" @click="limpiarFiltro()" small
          >Limpiar Filtro</v-btn
        >
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-data-table
          disable-pagination
          hide-default-footer
          dense
          :headers="headersSolucionadas"
          :items="telesaludSolucionadas"
          :loading="loading.telesaludSolucionadas"
          :items-per-page="paginacion.cantidadRegistros"
          loading-text="Cargando... Por favor espere"
          no-data-text="Sin datos para mostrar"
        >
          <template v-slot:[`item.fecha_registro`]="{ item }">
            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
          </template>
          <template v-slot:[`item.tipo_solicitud_telesalud`]="{ item }">
            <v-chip
              small
              dark
              :color="item.tipo_solicitud.id == 1 ? 'success' : 'error'"
            >
              {{ item.tipo_solicitud.nombre }}
            </v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <div style="display: flex; justify-content: center; gap: 0.4rem">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="info"
                    v-bind="attrs"
                    v-on="on"
                    @click="abrirModalSolucionada(item)"
                  >
                    mdi-file-document-alert-outline
                  </v-icon>
                </template>
                <span>Ver Detalles</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="success"
                    v-bind="attrs"
                    v-on="on"
                    @click="imprimirTelesalud(item)"
                  >
                    mdi-file-download-outline
                  </v-icon>
                </template>
                <span>Imprimir</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="12" sm="12" class="mt-2">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="11" sm="11">
        <v-pagination
          v-model="paginacion.pagina"
          :length="paginacion.total"
          :total-visible="9"
          @input="listarTelesaludSolucionadas()"
        ></v-pagination>
      </v-col>
      <v-col cols="12" md="1" sm="1">
        <v-select
          dense
          v-model="paginacion.cantidadRegistros"
          :items="[5, 10, 20, 50, 100]"
          outlined
          label="Registros por Página"
          @change="listarTelesaludSolucionadas()"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Modal Telesalud Solucionada -->
    <modalTelesaludSolucionada
      :telesaludSeleccionada="telesaludSeleccionada"
      :mostrarModalSolucionada.sync="mostrarModalSolucionada"
    />
  </div>
</template>
<script>
import modalTelesaludSolucionada from "@/components/telesalud/modalTelesaludSolucionada.vue";
import { mapActions } from "vuex";

export default {
  components: {
    modalTelesaludSolucionada,
  },
  data() {
    return {
      filtros: {
        tipo_solicitud_id: null,
        ips_id: null,
        numero_documento: null,
        fecha_inicio: null,
        fecha_fin: null,
      },
      telesaludSolucionadas: [],
      headersSolucionadas: [
        { text: "ID", value: "id", align: "center" },
        {
          text: "Afiliado",
          value: "afiliado.nombre_completo",
          align: "center",
        },
        {
          text: "N° de Documento",
          value: "afiliado.numero_documento",
          align: "center",
        },
        { text: "Especialidad", value: "especialidad.nombre", align: "center" },
        {
          text: "Tipo de Estrategia",
          value: "tipo_estrategia.nombre",
          align: "center",
        },
        { text: "Fecha de Registro", value: "fecha_registro", align: "center" },
        {
          text: "Tipo de Solicitud",
          value: "tipo_solicitud_telesalud",
          align: "center",
        },
        {
          text: "Medico Solicitante",
          value: "funcionario_crea.operador.nombre_completo",
          align: "center",
        },
        { text: "Sede", value: "afiliado.ips.nombre", align: "center" },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
          sortable: false,
        },
      ],
      loading: {
        telesaludSolucionadas: false,
        ips: false,
        tipoSolicitud: false,
      },
      menu: {
        fecha_inicio: false,
        fecha_fin: false,
      },
      opcionesTiposSolicitud: [],
      opcionesIps: [],
      campoBusquedaIps: null,
      paginacion: {
        pagina: 1,
        cantidadRegistros: 10,
        total: 0,
      },
      mostrarModalSolucionada: false,
      telesaludSeleccionada: {},
    };
  },
  watch: {
    campoBusquedaIps(newValue) {
      if (newValue && newValue.length === 4) {
        this.listarOpcionesIps();
      }
    },
  },
  mounted() {
    this.listarTelesaludSolucionadas();
    this.listarOpcionesTiposSolicitud();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarOpcionesTiposSolicitud() {
      this.loading.tipoSolicitud = true;
      this.$axios
        .get("tipo-solicitud/listarActivos")
        .then((res) => {
          this.opcionesTiposSolicitud = res.data.data;
        })
        .catch(() => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de solicitud"
          );
        })
        .finally(() => {
          this.loading.tipoSolicitud = false;
        });
    },
    listarOpcionesIps() {
      this.loading.ips = true;
      this.$axios
        .get(`/reps/buscarRep/${this.campoBusquedaIps}`)
        .then((res) => {
          this.opcionesIps = res.data.map((ips) => {
            return {
              id: ips.id,
              nombre: `${ips.nombre} - ${ips.codigo_habilitacion_completo}`,
            };
          });
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar las sedes");
        })
        .finally(() => {
          this.loading.ips = false;
        });
    },

    listarTelesaludSolucionadas() {
      const data = {
        filtros: this.filtros,
        paginacion: this.paginacion,
      };

      this.loading.telesaludSolucionadas = true;
      this.$axios
        .post("/telesalud/listarSolucionadas", data)
        .then((res) => {
          this.telesaludSolucionadas = res.data.data;
          this.paginacion.total = res.data.last_page;

          // Emitir la cantidad de registros al padre para actualizar el contador
          this.$emit("actualizarConteo", res.data.total);
        })
        .catch(() => {
          this.$toast.error("Error al cargar los registros de telesalud");
        })
        .finally(() => {
          this.loading.telesaludSolucionadas = false;
        });
    },

    limpiarFiltro() {
      for (const prop of Object.getOwnPropertyNames(this.filtros)) {
        this.filtros[prop] = null;
      }
      this.listarTelesaludSolucionadas();
    },

    abrirModalSolucionada(item) {
      this.telesaludSeleccionada = item;
      this.mostrarModalSolucionada = true;
    },

    imprimirTelesalud(item) {
      const data = {
        telesalud_id: item.id,
        tipo: "telesalud",
      };

      this.setPreload(true);

      this.$axios
        .post("/pdf", data, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        })
        .catch(() => {
          this.$toast.error("Ocurrió un error al imprimir");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
