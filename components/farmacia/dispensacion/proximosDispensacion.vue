<template>
  <div>
    <v-row dense class="mt-2">
      <v-col cols="12" sm="12" md="12">
        <v-text-field
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          v-model="search"
          no-results-text="No se encontraron resultados para su búsqueda"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-data-table
          dense
          :headers="headersOrdenesProximas"
          :items="ordenesProximas"
          :loading="loading.tablaOrdenesProximas"
          no-data-text="El afiliado no cuenta con Ordenes Próximas"
          loading-text="Cargando... Por favor espere"
          :search="search"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip bottom v-if="$can('farmacia.adelantarDispensacion')">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="abrirModalCambioFecha(item)"
                >
                  mdi-calendar-alert
                </v-icon>
              </template>
              <span>Adelantar Dispensación</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal Cambio Fecha -->
    <modalCambioFecha
      :mostrarModalCambioFecha.sync="mostrarModalCambioFecha"
      :orden="ordenSeleccionada"
      @listarOrdenesProximas="listarOrdenesProximas"
    />
  </div>
</template>

<script>
import modalCambioFecha from "@/components/farmacia/dispensacion/modalCambioFecha.vue";

export default {
  name: "proximosDispensacion",
  props: {
    afiliadoId: {
      type: Number,
      required: true,
    },
  },
  components: {
    modalCambioFecha,
  },
  data() {
    return {
      headersOrdenesProximas: [
        { text: "N° Orden", value: "id", align: "center" },
        { text: "Fecha de Vigencia", value: "fecha_vigencia", align: "center" },
        { text: "Página", value: "paginacion", align: "center" },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
          sortable: false,
        },
      ],
      ordenesProximas: [],
      loading: {
        tablaOrdenesProximas: false,
      },
      search: "",
      mostrarModalCambioFecha: false,
      ordenSeleccionada: {},
    };
  },
  mounted() {
    this.listarOrdenesProximas();
  },
  methods: {
    listarOrdenesProximas() {
      this.loading.tablaOrdenesProximas = true;
      this.$axios
        .get(`/ordenamiento/listar-ordenes-proximas/${this.afiliadoId}`)
        .then((response) => {
          this.ordenesProximas = response.data;
        })
        .catch(() => {
          this.$toast.error(
            "Ocurrió un error al cargar las ordenes próximas del afiliado"
          );
        })
        .finally(() => {
          this.loading.tablaOrdenesProximas = false;
        });
    },

    abrirModalCambioFecha(item) {
      this.ordenSeleccionada = item;
      this.mostrarModalCambioFecha = true;
    },
  },
};
</script>
