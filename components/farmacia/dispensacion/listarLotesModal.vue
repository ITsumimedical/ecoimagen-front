<template>
  <v-dialog v-model="mostrarLotesModal" persistent max-width="1200px">
    <v-card>
      <v-alert
        text
        dense
        border="left"
        type="info"
        icon="mdi-package-variant"
        class="text-center"
      >
        <b>Lista de Lotes</b>
      </v-alert>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="3" sm="3">
            <v-alert
              dense
              text
              color="blue-grey"
              border="left"
              icon="mdi-pill"
              style="display: flex; gap: 0.5rem"
            >
              <b>Artículo:</b>
              {{ articulo?.codesumi?.nombre }}
            </v-alert>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-alert
              dense
              text
              color="red darken-3"
              border="left"
              icon="mdi-pill"
              style="display: flex; gap: 0.5rem"
            >
              <b>Cantidad a Entregar:</b>
              {{ calcularEntrega() }}
            </v-alert>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-alert
              dense
              text
              color="blue darken-3"
              border="left"
              icon="mdi-pill"
              style="display: flex; gap: 0.5rem"
            >
              <b>Cantidad Ordenada:</b>
              {{ articulo?.cantidad_medico }}
            </v-alert>
          </v-col>
          <v-col cols="12" md="3" sm="3">
            <v-alert dense text color="warning" border="left" icon="mdi-pill">
              <b>Pendiente:</b>
              {{ articulo?.cantidad_medico - articulo?.cantidad_entregada }}
            </v-alert>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-data-table dense :headers="headersLotes" :items="lotes">
              <template v-slot:[`item.dispensar`]="{ item }">
                <v-text-field
                  dense
                  type="number"
                  v-model="item.cantidadDispensar"
                ></v-text-field>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
        <v-btn
          color="success"
          dark
          small
          @click="dispensarMedicamento()"
          :disabled="!puedeDispensar()"
          >Dispensar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarLotesModal: {
      type: Boolean,
      required: true,
    },
    lotes: {
      type: Array,
      default: () => [],
    },
    articulo: {
      type: Object,
      default: () => {},
    },
    farmaciaId: {
      type: Number,
      required: true,
    },
    esPendiente: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      headersLotes: [
        { text: "Lote", value: "codigo", sortable: false, align: "center" },
        {
          text: "Fecha Vencimiento",
          value: "fecha_vencimiento",
          sortable: false,
          align: "center",
        },
        {
          text: "CUM",
          value: "bodega_medicamento.medicamento.cum",
          sortable: false,
          align: "center",
        },
        {
          text: "Titular",
          value: "bodega_medicamento.medicamento.invima.titular",
          sortable: false,
          align: "center",
        },
        {
          text: "Cantidad Disponible",
          value: "cantidad",
          sortable: false,
          align: "center",
        },
        {
          text: "Cantidad Dispensar",
          value: "dispensar",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$emit("update:mostrarLotesModal", false);
    },

    calcularEntrega() {
      return this.lotes.reduce((accumulator, object) => {
        let value = isNaN(parseInt(object.cantidadDispensar))
          ? 0
          : parseInt(object.cantidadDispensar);
        return accumulator + value;
      }, 0);
    },

    puedeDispensar() {
      return this.lotes.some((lote) => parseInt(lote.cantidadDispensar) > 0);
    },

    dispensarMedicamento() {
      let lotesDispensar = this.lotes
        .filter((lote) => lote.cantidadDispensar != null)
        .map((item) => {
          if (item.hasOwnProperty("cantidadDispensar")) {
            if (item.cantidadDispensar > 0) {
              return {
                id: item.id,
                cantidad: item.cantidadDispensar,
              };
            }
          }
        });

      if (
        this.calcularEntrega() >
        this.articulo.cantidad_medico - this.articulo.cantidad_entregada
      ) {
        this.$toast.error("la dispensación supera la cantidad ordenada!");
        return;
      }

      const request = {
        orden_articulo_id: this.articulo.id,
        orden_id: this.articulo.orden_id,
        bodega_id: this.farmaciaId,
        lotes: lotesDispensar,
      };

      //   console.log("Dispensar", request);
      this.setPreload(true);

      const ruta = this.esPendiente
        ? "/ordenamiento/dispensarPendiente"
        : "/ordenamiento/dispensar";

      this.$axios
        .post(ruta, request)
        .then((res) => {
          this.$emit("listarOrdenArticulos", this.articulo.orden_id);
          this.$emit("recargarOrdenes");
          this.cerrarModal();
          this.$toast.success("Medicamento dispensado con éxito");
        })
        .catch((err) => {
          this.$toast.error("Ocurrió un error al dispensar el medicamento");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
