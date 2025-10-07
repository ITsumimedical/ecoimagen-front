<template>
  <div>
    <v-dialog
      v-model="mostrarArticulosPendientes"
      max-width="1500px"
      persistent
    >
      <v-card>
        <v-alert
          text
          dense
          border="left"
          type="info"
          icon="mdi-pill-off"
          class="text-center"
        >
          <b>Artículos Pendientes - Orden N° {{ orden?.id }}</b>
        </v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-data-table
                dense
                :headers="headersArticulosPendientes"
                :items="articulos"
                :loading="loading.tablaArticulosPendientes"
                loading-text="Cargando... Por favor espere"
                no-data-text="Esta orden no cuenta con articulos pendientes"
              >
                <template v-slot:[`item.estadoOrdenArticulo`]="{ item }">
                  <v-chip
                    small
                    dark
                    :color="obtenerColorEstado(item.estado.id)"
                  >
                    {{ item.estado.nombre }}
                  </v-chip>
                </template>
                <template v-slot:[`item.domicilio`]="{ item }">
                  <v-chip
                    small
                    dark
                    :color="item.domicilio ? 'success' : 'error'"
                  >
                    {{ item.domicilio ? "Si" : "No" }}
                  </v-chip>
                </template>
                <template v-slot:[`item.tipo_domicilio`]="{ item }">
                  {{ item.domicilio ? item.tipo_domicilio : "No Aplica" }}
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                  <div
                    style="display: flex; justify-content: center; gap: 0.4rem"
                  >
                    <v-tooltip bottom v-if="$can('farmacia.consultarLotes')">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="success"
                          v-bind="attrs"
                          v-on="on"
                          @click="consultarLotes(item)"
                        >
                          mdi-package-variant</v-icon
                        >
                      </template>
                      <span>Listar Lotes</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          @click="abrirModalDomicilio(item)"
                        >
                          mdi-truck-fast
                        </v-icon>
                      </template>
                      <span>Parametrizar Domicilio</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark small @click="cerrarModal()">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Lotes -->
    <listarLotesModal
      :mostrarLotesModal.sync="mostrarLotesModal"
      :articulo="articuloSeleccionado"
      :lotes="lotes"
      :farmaciaId="farmaciaId"
      @listarOrdenArticulos="listarOrdenArticulos"
      @recargarOrdenes="recargarOrdenes"
      :esPendiente="true"
    />

    <!-- Modal Domicilio -->
    <modalDomicilio
      :mostrarDomicilioModal.sync="mostrarDomicilioModal"
      :articulo="articuloSeleccionado"
      @listarOrdenArticulos="listarOrdenArticulos"
    />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import listarLotesModal from "@/components/farmacia/dispensacion/listarLotesModal.vue";
import modalDomicilio from "@/components/farmacia/dispensacion/modalDomicilio.vue";

export default {
  props: {
    mostrarArticulosPendientes: {
      type: Boolean,
      required: true,
    },
    orden: {
      type: Object,
      default: () => {},
    },
    farmaciaId: {
      type: Number,
      required: true,
    },
  },
  components: {
    listarLotesModal,
    modalDomicilio,
  },
  data() {
    return {
      loading: {
        tablaArticulosPendientes: false,
      },
      articulos: [],
      headersArticulosPendientes: [
        { text: "Código", value: "codesumi.codigo", align: "center" },
        { text: "Nombre", value: "codesumi.nombre", align: "center" },
        {
          text: "Cantidad",
          value: "cantidad_mensual_disponible",
          align: "center",
        },
        { text: "Fecha de Vigencia", value: "fecha_vigencia", align: "center" },
        { text: "Estado", value: "estadoOrdenArticulo", align: "center" },
        { text: "Domicilio", value: "domicilio", align: "center" },
        { text: "Tipo de Domicilio", value: "tipo_domicilio", align: "center" },
        { text: "Acciones", value: "acciones", align: "center" },
      ],
      mostrarLotesModal: false,
      lotes: [],
      articuloSeleccionado: {},
      mostrarDomicilioModal: false,
    };
  },
  watch: {
    mostrarArticulosPendientes(newVal) {
      if (newVal) {
        this.listarOrdenArticulos(this.orden?.id);
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$emit("update:mostrarArticulosPendientes", false);
    },

    listarOrdenArticulos(ordenId) {
      this.loading.tablaArticulosPendientes = true;
      this.$axios
        .get(`/ordenamiento/listar-articulo-pendientes/${ordenId}`)
        .then((res) => {
          this.articulos = res.data;
        })
        .catch((err) => {
          this.$toast.error(
            "Ocurrió un error al cargar los detalles de la orden"
          );
        })
        .finally(() => {
          this.loading.tablaArticulosPendientes = false;
        });
    },

    obtenerColorEstado(estadoId) {
      switch (estadoId) {
        case 10:
          return "warning";
        case 18:
          return "primary";
        default:
          return "grey";
      }
    },

    consultarLotes(articulo) {
      this.articuloSeleccionado = articulo;
      this.setPreload(true);
      this.$axios
        .get(
          `/bodega-medicamentos/lotesDispensacion/${this.farmaciaId}/${this.articuloSeleccionado.codesumi_id}`
        )
        .then((res) => {
          this.lotes = res.data;
          this.abrirModalLotes();
        })
        .catch((error) => {
          this.$toast.error("Ocurrio un error al cargar los lotes");
          console.log(error);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    abrirModalLotes() {
      if (this.lotes.length < 1) {
        this.$toast.error("El lote no tiene existencias");
        return;
      } else {
        this.mostrarLotesModal = true;
      }
    },

    abrirModalDomicilio(item) {
      this.articuloSeleccionado = item;
      this.mostrarDomicilioModal = true;
    },

    recargarOrdenes() {
      this.$emit("listarOrdenesPendientes");
    },
  },
};
</script>
