<template>
  <v-card>
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span>Parametrización Prestadores</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-divider inset></v-divider>
    <v-tabs centered color="white" icons-and-text>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab v-if="$can('contrato.prestadores.vista')" href="#tab-1" class="black--text">
        Prestador
        <v-icon color="black">mdi-city</v-icon>
      </v-tab>

      <v-tab href="#tab-3" class="black--text">
        Tipo Prestador
        <v-icon color="black">mdi-city</v-icon>
      </v-tab>

      <!-- prestadores -->
      <v-tab-item :value="'tab-1'">
        <ListarPrestadorComponent />
      </v-tab-item>

      <!-- Tipo prestadores -->
      <v-tab-item :value="'tab-3'">
        <ListarTipoPrestadores />
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>

<script>
  import ListarPrestadorComponent from "@/components/contrato/prestadores/ListarPrestadorComponent.vue"
  import ListarTipoPrestadores from "@/components/contrato/tipoPrestador/ListarTipoPrestadorComponent.vue"

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('contrato.prestadores.vista')) {
        return redirect('/');
      }
    },
    name: 'PrestadorPage',
    components: {
      ListarPrestadorComponent,
      ListarTipoPrestadores,
    },

  }

</script>
