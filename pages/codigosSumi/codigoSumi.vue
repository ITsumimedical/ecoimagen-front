<template>
  <v-card>

    <v-tabs grow>
      <v-tab>
        Productos
      </v-tab>
      <v-tab>
        Parametrización productos
      </v-tab>



      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <listarProductos />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <parametrizacion />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>


<script>

import listarProductos from '@/pages/codigosSumi/crearCodigoSumi.vue';
import parametrizacion from '@/pages/codigosSumi/parametrizacionCodesumis.vue'


export default {
  components: {
    listarProductos,
    parametrizacion

  },
  data() {
    return {
    };
  },
  methods: {
  },
};

</script>
