<template>
  <v-menu open-on-hover offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on" color="primary">
        mdi-file-document-arrow-right-outline
      </v-icon>
    </template>

    <v-card outlined class="mx-auto pa-2" max-width="480">
      <v-card-title class="text-subtitle-2 font-weight-bold">OBSERVACIÓN:</v-card-title>
      <v-card-text>
        <ul style="margin: 0; padding-left: 1em; white-space: normal; overflow: visible; text-overflow: unset; word-break: break-word;">
          <li>{{ observacion }}</li>
        </ul>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'ObservacionComponente',
  props: {
    observacion: {
      type: String,
      default: '',
    },
  },
}
</script>
