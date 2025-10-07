<template>
  <div>
    <v-row dense class="mt-4">
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          dense
          outlined
          append-icon="mdi-text-box-search-outline"
          label="N° Radicado"
          v-model="filtros.numero_radicado"
          @keyup.enter="listarPQRFPreSolucionados()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          dense
          outlined
          append-icon="mdi-credit-card-search-outline"
          label="N° Documento"
          v-model="filtros.numero_documento"
          @keyup.enter="listarPQRFPreSolucionados()"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-autocomplete
          dense
          outlined
          label="Departamento"
          item-text="nombre"
          item-value="id"
          v-model="filtros.departamento"
          :items="opcionesDepartamentos"
          :loading="loading.departamentos"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-autocomplete
          dense
          outlined
          label="Usuario creó"
          item-text="nombre"
          item-value="id"
          v-model="filtros.usuario_registra"
          :items="opcionesUsuarios"
          :loading="loading.usuarios"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          dense
          outlined
          append-icon="mdi-barcode-scan"
          label="Código SuperSalud"
          v-model="filtros.codigo_super"
          @keyup.enter="listarPQRFPreSolucionados()"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="1" sm="6">
        <v-menu
          dense
          v-model="menu.fechaInicio"
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
              label="Fecha Inicial"
              append-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              v-model="filtros.fecha_inicio"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filtros.fecha_inicio"
            @input="menu.fechaInicio = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="1" sm="6">
        <v-menu
          dense
          v-model="menu.fechaFin"
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
              label="Fecha Final"
              append-icon="mdi-calendar"
              v-bind="attrs"
              v-on="on"
              v-model="filtros.fecha_fin"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filtros.fecha_fin"
            @input="menu.fechaFin = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="1" sm="6">
        <v-autocomplete
          dense
          outlined
          label="Canal"
          v-model="filtros.canal_id"
          :items="opcionesCanal"
          item-text="nombre"
          item-value="id"
          :loading="loading.canalesPQRSF"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="1" sm="6">
        <v-autocomplete
          dense
          outlined
          label="Entidad"
          item-text="nombre"
          item-value="id"
          v-model="filtros.entidad_id"
          :items="opcionesEntidad"
          :loading="loading.entidades"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="12" sm="12" align="right">
        <v-btn
          dark
          small
          color="warning"
          @click="limpiarFiltro"
          :loading="loading.PQRSFPreSolucionados"
          >Limpiar Filtros</v-btn
        >
        <v-btn
          dark
          small
          color="primary"
          @click="listarPQRFPreSolucionados()"
          :loading="loading.PQRSFPreSolucionados"
          >Buscar</v-btn
        >
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-data-table
          disable-pagination
          hide-default-footer
          :items-per-page="paginacion.cantidadRegistros"
          :headers="headersPQRFPreSolucionados"
          :items="PQRSFPreSolucionados"
          :loading="loading.PQRSFPreSolucionados"
          loading-text="Cargando... Por favor espere"
          no-data-text="Sin datos para mostrar"
          dense
        >
          <template v-slot:[`item.entidadAfiliado`]="{ item }">
            <v-chip
              small
              :color="obtenerColorEntidad(item.afiliado.entidad.id)"
              dark
            >
               {{ obtenerNombreEntidad(item?.afiliado?.entidad?.nombre) }}
            </v-chip>
          </template>
          <template v-slot:[`item.asignadoPQRF`]="{ item }">
            <v-menu open-on-hover right offset-y>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-account-badge-outline</v-icon>
              </template>

              <v-list>
                <v-list-item
                  v-for="area in item?.area_responsable"
                  :key="area.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ area?.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <template
                        v-if="area.responsable && area.responsable.length > 0"
                      >
                        <ul>
                          <li
                            v-for="operador in area.responsable"
                            :key="operador.id"
                          >
                            {{ operador?.user?.operador?.nombre_completo }}
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        No hay responsables asignados
                      </template>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-slot:[`item.diasHabiles`]="{ item }">
            <v-chip
              small
              dark
              :color="
                obtenerColorDiasHabiles(item.priorizacion, item.diasHabiles)
              "
            >
              {{ `${item.diasHabiles} DÍA(S)` }}
            </v-chip>
          </template>
          <template v-slot:[`item.created_at`]="{ item }">
            {{ $moment(item.created_at).format("DD-MM-YYYY") }}
          </template>
          <template v-slot:[`item.codigo_super`]="{ item }">
            {{ item.codigo_super ? item.codigo_super : "-" }}
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="abrirModalPreSolucionados(item)"
                  >mdi-eye</v-icon
                >
              </template>
              <span>Gestionar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="12" sm="12" class="mt-4">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="11" sm="11">
        <v-pagination
          v-model="paginacion.pagina"
          :length="paginacion.total"
          :total-visible="9"
          @input="listarPQRFPreSolucionados()"
        ></v-pagination>
      </v-col>
      <v-col cols="12" md="1" sm="1">
        <v-select
          dense
          v-model="paginacion.cantidadRegistros"
          :items="[5, 10, 20, 50, 100]"
          outlined
          label="Registros por Página"
          @change="listarPQRFPreSolucionados()"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Modales -->
    <modalPqrsfPreSolucionados
      :mostrarModalPreSolucionados.sync="mostrarModalPreSolucionados"
      :PQRSFSeleccionada="PQRSFSeleccionada"
      @listarPQRFPreSolucionados="listarPQRFPreSolucionados"
    />
  </div>
</template>
<script>
import modalPqrsfPreSolucionados from "~/components/pqrsf/centralPqrf/modalPqrsfPreSolucionados.vue";

export default {
  components: {
    modalPqrsfPreSolucionados,
  },
  data() {
    return {
      loading: {
        PQRSFPreSolucionados: false,
        canalesPQRSF: false,
        entidades: false,
        departamentos: false,
        usuarios:false,
      },
      headersPQRFPreSolucionados: [
        { text: "Radicado", value: "id", align: "center" },
        { text: "Canal", value: "canal.nombre", align: "center" },
        {
          text: "N° Documento",
          value: "afiliado.numero_documento",
          align: "center",
        },
        {
          text: "Afiliado",
          value: "afiliado.nombre_completo",
          align: "center",
        },
        { text: "Entidad", value: "entidadAfiliado", align: "center" },
        {
          text: "Tipo de Requerimiento",
          value: "solicitud.Solicitud_nombre",
          align: "center",
        },
        {
          text: "Departamento",
          value: "afiliado.departamento_atencion.nombre",
          align: "center",
        },
        { text: "IPS Primaria", value: "afiliado.ips.nombre", align: "center" },
        { text: "Asignado A", value: "asignadoPQRF", align: "center" },
        { text: "Semáforo", value: "diasHabiles", align: "center" },
        { text: "Fecha Generado", value: "created_at", align: "center" },
        { text: "Código SuperSalud", value: "codigo_super", align: "center" },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
          sortable: false,
        },
      ],
      filtros: {
        numero_radicado: null,
        codigo_super: null,
        numero_documento: null,
        entidad_id: null,
        canal_id: null,
        fecha_inicio: null,
        fecha_fin: null,
        departamento: null,
        usuario_registra:null
      },
      menu: {
        fechaInicio: false,
        fechaFin: false,
      },
      opcionesEntidad: [],
      opcionesCanal: [],
      opcionesDepartamentos: [],
      PQRSFPreSolucionados: [],
      paginacion: {
        pagina: 1,
        cantidadRegistros: 10,
        total: 0,
      },
      mostrarModalPreSolucionados: false,
      PQRSFSeleccionada: {},
      opcionesUsuarios:[],
    };
  },
  mounted() {
    this.listarPQRFPreSolucionados();
    this.listarCanalesPQRSF();
    this.listarEntidades();
    this.listarDepartamentos();
    this.listarUsuarios();
  },
  methods: {
    listarPQRFPreSolucionados() {
      const data = {
        filtros: this.filtros,
        paginacion: this.paginacion,
      };

      this.loading.PQRSFPreSolucionados = true;
      this.$axios
        .post("/formularios-pqrsf/listarPresolucionCentral", data)
        .then((res) => {
          this.PQRSFPreSolucionados = res.data.data;
          this.paginacion.total = res.data.last_page;

          // Emitir la cantidad de registros al padre para actualizar el contador
          this.$emit("actualizarConteo", res.data.total);
        })
        .catch((e) => {
          this.$toast.error("Error al cargar las PQRF");
        })
        .finally(() => {
          this.loading.PQRSFPreSolucionados = false;
        });
    },

    limpiarFiltro() {
      this.filtros = {
        numero_radicado: null,
        numero_documento: null,
        fecha_inicio: null,
        fecha_fin: null,
        canal_id: null,
        entidad_id: null,
        codigo_super: null,
        departamento: null,
        usuario_registra: null
      };

      this.listarPQRFPreSolucionados();
    },

    listarCanalesPQRSF() {
      this.loading.canalesPQRSF = true;
      this.$axios
        .post("/canales-pqrsf/listarTodos")
        .then((res) => {
          this.opcionesCanal = res.data;
        })
        .catch(() => {
          this.$toast.error("Error al cargar los canales");
        })
        .finally(() => {
          this.loading.canalesPQRSF = false;
        });
    },

    listarEntidades() {
      this.loading.entidades = true;
      this.$axios
        .get("/entidad/listar")
        .then((res) => {
          this.opcionesEntidad = res.data;
        })
        .catch((e) => {
          this.$toast.error("Error al cargar las entidades");
        })
        .finally(() => {
          this.loading.entidades = false;
        });
    },

    listarDepartamentos() {
      this.loading.departamentos = true;
      this.$axios
        .get("/departamento")
        .then((res) => {
          this.opcionesDepartamentos = res.data;
        })
        .catch((e) => {
          this.$toast.error("Error al cargar los departamentos");
        })
        .finally(() => {
          this.loading.departamentos = false;
        });
    },
    listarUsuarios(){
      this.loading.departamentos = true;
      this.$axios
        .get("operador/listarActivos")
        .then((res) => {
          this.opcionesUsuarios = res.data.map((usuario) => {
                    return {
                        id: usuario.user_id,
                        nombre: `${usuario.documento} - ${usuario.nombre_completo}`
                    }
                })
        })
        .catch((e) => {
          this.$toast.error("Error al cargar los usuarios");
        })
        .finally(() => {
          this.loading.departamentos = false;
        });
    },
    obtenerColorEntidad(entidadId) {
      switch (entidadId) {
        case 1:
          return "blue darken-3";
        case 2:
          return "blue lighten-1";
        case 3:
          return "green lighten-1";
        case 4:
          return "yellow darken-2";
        case 5:
          return "green darken-2";
        case 6:
          return "orange darken-2";
        case 7:
          return "purple darken-2";
        case 8:
          return "brown darken-2";
        case 9:
          return "blue-grey";
        default:
          return "gray";
      }
    },

     obtenerNombreEntidad(nombre) {
      if (nombre === 'Fondo Nacional de Prestaciones Sociales del Magisterio') {
        return 'FOMAG';
      } else if (nombre === 'Fondo de pasivo social de ferrocarriles nacionales de Colombia') {
        return 'Ferrocarriles';
      }
      return nombre;
    },

    obtenerColorDiasHabiles(priorizacion, diasHabiles) {
      let diasLimite;

      switch (priorizacion) {
        case "Riesgo Vital (1 Día)":
          diasLimite = 2;
          break;
        case "Riesgo priorizado (2 Días)":
          diasLimite = 3;
          break;
        case "Riesgo simple (3 Días)":
          diasLimite = 4;
          break;
        case "Peticiones generales (10 Días)":
          diasLimite = 11;
          break;
        default:
          diasLimite = 3; // Ajustar el valor por defecto según el caso.
      }

      return diasHabiles >= diasLimite ? "red" : "green";
    },

    abrirModalPreSolucionados(item) {
      this.mostrarModalPreSolucionados = true;
      this.PQRSFSeleccionada = item;
    },
  },
};
</script>
