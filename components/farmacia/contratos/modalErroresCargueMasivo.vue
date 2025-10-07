<template>
  <div>
    <v-dialog v-model="mostrarModalErroresCargueMasivo" persistent max-width="500px" scrollable>
      <v-card>
        <v-alert dense text border="left" color="error" icon="mdi-close-circle-outline" class="text-center">
          <b>Errores en el Cargue Masivo</b>
        </v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" v-for="(item, index) in errores" :key="index">
              <v-alert dense text type="info" color="blue-grey" border="left">
                <b>Fila {{item.fila}}:</b>&nbsp;{{item.mensaje}}
              </v-alert>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small dark @click="cerrarModal">Salir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    mostrarModalErroresCargueMasivo: {
      type: Boolean,
      default: false
    },
    errores: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    cerrarModal() {
      this.$emit('update:mostrarModalErroresCargueMasivo', false);
    }
  }
}
</script>

