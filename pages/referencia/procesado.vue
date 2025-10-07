<template>
  <div>
    <v-card v-if="$can('referencia.seguimiento.prestador')">
        <ProcesandoReferenciaPrestadorComponet />
    </v-card>
    <v-card v-if="$can('referencia.seguimiento.todo')">
        <ProcesandoReferenciaComponet />
    </v-card>
  </div>
</template>
<script>

import ProcesandoReferenciaPrestadorComponet from "~/components/referencia/ProcesadoReferenciaPrestadorComponent.vue";
import ProcesandoReferenciaComponet from "~/components/referencia/ProcesadoReferenciaComponet.vue"

export default {
  middleware({
               $can,
               redirect
             }) {
    if (!$can('referencia.procesado')) {
      return redirect('/');
    }
  },
  name: 'procesadoReferencia',
  components: {
    ProcesandoReferenciaPrestadorComponet,
    ProcesandoReferenciaComponet
  },

  data() {
    return {
      componente: null,
    }
  },
  methods: {
  }
}

</script>

