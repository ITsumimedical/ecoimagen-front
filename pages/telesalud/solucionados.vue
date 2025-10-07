<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Solucionados - Telesalud</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-form ref="formBuscarAfiliado">
          <v-row>
            <v-col cols="12" md="5" sm="12">
              <v-autocomplete
                dense
                outlined
                label="Tipo de Documento"
                :items="tiposDocumentos"
                :loading="loading.tiposDocumentos"
                no-data-text="No hay resultados"
                item-value="id"
                item-text="nombre"
                v-model="datosBuscarAfiliado.tipo_documento"
                hint="Ingresa el tipo de documento del afiliado"
                :rules="[(v) => !!v || 'Este campo es requerido']"
              />
            </v-col>
            <v-col cols="12" md="5" sm="12">
              <v-text-field
                dense
                outlined
                label="Número Documento"
                @keyup.enter="listarTeleapoyosSolucionados()"
                v-model="datosBuscarAfiliado.numero_documento"
                hint="Ingresa el número de documento del afiliado"
                :rules="[(v) => !!v || 'Este campo es requerido']"
              />
            </v-col>
            <v-col cols="12" md="2" sm="12" style="display: flex; gap: 0.2rem">
              <v-btn
                color="primary"
                dark
                @click="listarTeleapoyosSolucionados()"
                style="min-width: fit-content"
                >Consultar <v-icon right>mdi-magnify</v-icon></v-btn
              >
              <v-btn
                color="red"
                dark
                @click="limpiarAfiliado()"
                style="min-width: fit-content"
                >Limpiar<v-icon right>mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-form>

        <!-- Filtros -->
        <v-row dense>
          <v-col cols="12" md="12" sm="12" class="my-4">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-select
              dense
              outlined
              append-icon="mdi-filter-variant"
              label="Tipo de Solicitud"
              :items="opcionesTipoSolicitudes"
              v-model="filtros.tipo_solicitud_id"
              item-text="nombre"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3" sm="3">
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
                @input="menu.fechaInicio = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3" sm="3">
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
                @input="menu.fechaFin = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-select
              dense
              outlined
              append-icon="mdi-filter-variant"
              label="Especialidad"
              :items="opcionesEspecialidades"
              v-model="filtros.especialidad_id"
              item-text="nombre"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col cols="12" md="12" sm="12" align="right">
            <v-btn color="primary" @click="listarTeleapoyosSolucionados()" small
              >Filtrar</v-btn
            >
            <v-btn color="error" @click="limpiarFiltros()" small
              >Limpiar Filtro</v-btn
            >
          </v-col>
        </v-row>

        <!-- Tabla -->
        <v-row dense>
          <v-col cols="12" md="12" sm="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-data-table
              :headers="headersTeleapoyos"
              :items="teleapoyosAfiliado"
              :items-per-page="paginacion.cantidadRegistros"
              :loading="loading.teleapoyos"
              disable-pagination
              hide-default-footer
              dense
              loading-text="Cargando... Por favor espere"
              no-data-text="Sin datos para mostrar"
            >
              <template v-slot:[`item.tipoSolicitud`]="{ item }">
                <v-chip
                  small
                  :color="item.tipo_solicitud.id === 1 ? 'success' : 'error'"
                  dark
                >
                  {{ item.tipo_solicitud.nombre }}
                </v-chip>
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="success"
                      class="mr-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="abrirModalGestionar(item)"
                    >
                      mdi-file-document-check-outline
                    </v-icon>
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
              @input="listarTeleapoyosSolucionados()"
            ></v-pagination>
          </v-col>
          <v-col cols="12" md="1" sm="1">
            <v-select
              dense
              v-model="paginacion.cantidadRegistros"
              :items="[5, 10, 20, 50, 100]"
              outlined
              label="Registros por Página"
              @change="listarTeleapoyosSolucionados()"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <modalGestionTelesalud
      :banderaRespuestaEspecialista="true"
      :mostrar-modal-gestion.sync="mostrarModalGestion"
      :teleapoyo="teleapoyoSeleccionado"
      :mostrarBotonResponder="false"
    />
  </div>
</template>
<script>
import modalGestionTelesalud from "@/components/telesalud/modalGestionTelesalud.vue";
import { mapActions } from "vuex";

export default {
  middleware({ $can, redirect }) {
    if (!$can("teleapoyo.vista")) {
      return redirect("/");
    }
  },
  components: {
    modalGestionTelesalud,
  },
  data() {
    return {
      loading: {
        tiposDocumentos: false,
        tiposSolicitud: false,
        especialidades: false,
        teleapoyos: false,
      },
      datosBuscarAfiliado: {
        numero_documento: null,
        tipo_documento: null,
      },
      tiposDocumentos: [],
      teleapoyosAfiliado: [],
      paginacion: {
        pagina: 1,
        cantidadRegistros: 10,
        total: 0,
      },
      headersTeleapoyos: [
        { text: "N°", value: "id", align: "center" },
        {
          text: "N° de Documento",
          value: "afiliado.numero_documento",
          align: "center",
        },
        {
          text: "Afiliado",
          value: "afiliado.nombre_completo",
          align: "center",
        },
        { text: "Especialidad", value: "especialidad.nombre", align: "center" },
        {
          text: "Tipo de Estrategia",
          value: "tipo_estrategia",
          align: "center",
        },
        { text: "Fecha de Registro", value: "created_at", align: "center" },
        { text: "Tipo de Solicitud", value: "tipoSolicitud", align: "center" },
        {
          text: "Médico Solicitante",
          value: "user_crea.operador.nombre_completo",
          align: "center",
        },
        {
          text: "Sede",
          value: "afiliado.ips.nombre",
          align: "center",
        },
        {
          text: "Acciones",
          value: "acciones",
          sortable: false,
          align: "center",
        },
      ],

      mostrarModalGestion: false,
      teleapoyoSeleccionado: {},
      menu: {
        fechaInicio: false,
        fechaFin: false,
      },
      filtros: {
        fecha_inicio: null,
        fecha_fin: null,
        tipo_solicitud_id: null,
        especialidad_id: null,
      },
      opcionesTipoSolicitudes: [],
      opcionesEspecialidades: [],
    };
  },
  mounted() {
    this.listarTiposDocumentos();
    this.listarTiposSolicitud();
    this.listarOpcionesEspecialidades();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarTiposDocumentos() {
      this.loading.tiposDocumentos = true;
      this.$axios
        .get("/tipo-documento/listar")
        .then((res) => {
          this.tiposDocumentos = res.data;
        })
        .catch((error) => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de documento"
          );
          console.log(error);
        })
        .finally(() => {
          this.loading.tiposDocumentos = false;
        });
    },

    listarTeleapoyosSolucionados() {
      if (!this.$refs.formBuscarAfiliado.validate()) {
        this.$toast.error("Por favor ingrese el tipo y número de documento.");
        return;
      }

      const data = {
        afiliado: {
          numero_documento: this.datosBuscarAfiliado.numero_documento,
          tipo_documento: this.datosBuscarAfiliado.tipo_documento,
        },
        paginacion: this.paginacion,
        filtros: this.filtros,
      };

      this.teleapoyosAfiliado = [];
      this.loading.teleapoyos = true;
      this.$axios
        .post("/teleapoyo/listarTeleapoyosSolucionados", data)
        .then((res) => {
          if (res.data.status === false) {
            this.$toast.error(res.data.message);
          } else {
            this.teleapoyosAfiliado = res.data.teleapoyos.data;
            res.data.teleapoyos.data.length > 0
              ? this.$toast.success(res.data.message)
              : this.$toast.error(res.data.message);
          }
        })
        .catch((error) => {
          this.$toast.error("Ocurrío un error al listar los teleapoyos");
          console.log(error);
        })
        .finally(() => {
          this.loading.teleapoyos = false;
        });
    },

    limpiarAfiliado() {
      this.datosBuscarAfiliado = {
        numero_documento: null,
        tipo_documento: null,
      };
      this.teleapoyosAfiliado = [];

      this.$refs.formBuscarAfiliado.resetValidation();
      this.filtros = {
        fecha_inicio: null,
        fecha_fin: null,
        tipo_solicitud_id: null,
        especialidad_id: null,
      };
    },

    abrirModalGestionar(item) {
      this.teleapoyoSeleccionado = item;
      this.mostrarModalGestion = true;
    },

    listarTiposSolicitud() {
      this.loading.tiposSolicitud = true;
      this.$axios
        .get("/tipo-solicitud/listarActivos")
        .then((res) => {
          this.opcionesTipoSolicitudes = res.data.data;
        })
        .catch(() => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de solicitud"
          );
        })
        .finally(() => {
          this.loading.tiposSolicitud = false;
        });
    },

    listarOpcionesEspecialidades() {
      this.loading.especialidades = true;
      this.$axios
        .post("/especialidades/listarTodas")
        .then((res) => {
          const idsEspecialidadesTelesalud = [8, 11, 15, 19, 25, 34];
          this.opcionesEspecialidades = res.data.filter((especialidad) =>
            idsEspecialidadesTelesalud.includes(especialidad.id)
          );
          this.loading.especialidades = false;
        })
        .catch(() => {
          this.loading.especialidades = false;
        });
    },

    limpiarFiltros() {
      this.filtros = {
        fecha_inicio: null,
        fecha_fin: null,
        tipo_solicitud_id: null,
        especialidad_id: null,
      };

      this.listarTeleapoyosSolucionados();
    },
  },
};
</script>
