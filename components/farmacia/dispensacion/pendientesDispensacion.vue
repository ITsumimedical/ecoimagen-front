<template>
  <div>
    <v-row dense class="mt-2">
      <v-col cols="12" md="12" sm="12">
        <v-text-field
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          v-model="search"
          no-results-text="No se encontraron resultados para su búsqueda"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="12" sm="12">
        <v-data-table
          dense
          :headers="headersOrdenesPendientes"
          :items="ordenesPendientes"
          :loading="loading.tablaOrdenesPendientes"
          no-data-text="El afiliado no cuenta con Ordenes Pendientes"
          loading-text="Cargando... Por favor espere"
          :search="search"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <div style="display: flex; justify-content: center; gap: 0.2rem">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="abrirModalDetalles(item)"
                  >
                    mdi-file-eye
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
                    @click="descargarOrden(item)"
                  >
                    mdi-file-download
                  </v-icon>
                </template>
                <span>Descargar Orden</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal Detalles -->
    <modalArticuloPendiente
      :mostrarArticulosPendientes.sync="mostrarArticulosPendientes"
      :orden.sync="ordenSeleccionada"
      :farmaciaId="farmaciaId"
      @listarOrdenesPendientes="listarOrdenesPendientes"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalArticuloPendiente from "@/components/farmacia/dispensacion/modalArticuloPendiente.vue";

export default {
  name: "pendientesDispensacion",
  components: {
    modalArticuloPendiente,
  },
  props: {
    afiliadoId: {
      type: Number,
      required: true,
    },
    farmaciaId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      headersOrdenesPendientes: [
        {
          text: "N° Orden ",
          value: "id",
          align: "center",
        },
        {
          text: "Página",
          value: "paginacion",
          align: "center",
        },
        {
          text: "Fecha de Vigencia - Orden",
          value: "fecha_vigencia",
          align: "center",
        },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
        },
      ],
      ordenesPendientes: [],
      loading: {
        tablaOrdenesPendientes: false,
      },
      search: "",
      mostrarArticulosPendientes: false,
      ordenSeleccionada: {},
    };
  },
  mounted() {
    this.listarOrdenesPendientes();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarOrdenesPendientes() {
      this.loading.tablaOrdenesPendientes = true;
      this.$axios
        .get(`/ordenamiento/listar-ordenes-pendientes/${this.afiliadoId}`)
        .then((res) => {
          this.ordenesPendientes = res.data;
        })
        .catch(() => {
          this.$toast.error(
            "Ocurrió un error al cargar las ordenes pendientes"
          );
        })
        .finally(() => {
          this.loading.tablaOrdenesPendientes = false;
        });
    },

    descargarOrden(item) {
      const data = {
        orden_id: item.id,
        tipo: "medicamentoPendiente",
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
          this.$toast.error("Ocurrió un error al descargar la orden");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    abrirModalDetalles(item) {
      this.ordenSeleccionada = item;
      this.mostrarArticulosPendientes = true;
    },
  },
};
</script>
