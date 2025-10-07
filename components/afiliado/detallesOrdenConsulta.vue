<template>
  <v-dialog v-model="mostrarDetallesOrden" max-width="800px" persistent>
    <v-card>
      <v-alert
        dense
        text
        border="left"
        icon="mdi-comment-eye-outline"
        type="info"
      >
        <b>Detalles la Orden</b>
      </v-alert>
      <v-card-text v-if="detallesOrden">
        <span>
          <b class="text-subtitle-1 font-weight-bold">N° Orden</b>
          <br />
          <p class="text-body-2">{{ detallesOrden?.orden_id }}</p>
        </span>
        <v-divider></v-divider>
        <span>
          <b class="text-subtitle-1 font-weight-bold">Tipo de Orden</b>
          <br />
          <p class="text-body-2">{{ detallesOrden?.tipo }}</p>
        </span>
         <span>
          <b class="text-subtitle-1 font-weight-bold">Cantidad usada</b>
          <br />
          <p class="text-body-2">{{ detallesOrden?.cantidad }}</p>
        </span>
         <span>
          <b class="text-subtitle-1 font-weight-bold">Usuario asigna</b>
          <br />
          <p class="text-body-2">{{ detallesOrden?.user }}</p>
        </span>
        <v-divider></v-divider>
        <span>
          <b class="text-subtitle-1 font-weight-bold">Servicio</b>
          <br />
          <p class="text-body-2">
            {{ detallesOrden?.cup_codigo }} - {{ detallesOrden?.cup_nombre }}
          </p>
        </span>
        <span>
          <b class="text-subtitle-1 font-weight-bold">Observación(es)</b>
          <br />
          <p class="text-body-2">
            {{ detallesOrden?.observacion }}
          </p>
        </span>
        <v-divider></v-divider>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small dark @click="cerrarModal" color="error">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: {
    mostrarDetallesOrden: {
      type: Boolean,
      required: true,
    },
    consultaActiva: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detallesOrden: {},
    };
  },
  watch: {
    mostrarDetallesOrden(newValue) {
      if (newValue) {
        this.buscarDetallesOrdenConsulta();
      }
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    cerrarModal() {
      this.$emit("update:mostrarDetallesOrden", false);
    },

    buscarDetallesOrdenConsulta() {
      this.setPreload(true);
      this.$axios
        .get(`/consultas/detallesOrdenConsulta/${this.consultaActiva.id}`)
        .then((res) => {
          this.detallesOrden = res.data;
        })
        .catch((err) => {
          this.$toast.error(
            "Ocurrió un error al cargar los detalles de la orden"
          );
          console.log(err);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },
  },
};
</script>
