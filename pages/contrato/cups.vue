<template>
  <v-tabs centered color="white" icons-and-text>
    <v-tabs-slider color="primary"></v-tabs-slider>

    <v-tab href="#tab-1" v-if="$can('contratos.servicios.cups')" class="black--text">
      Cups
      <v-icon color="black">mdi-cash</v-icon>
    </v-tab>

    <v-tab href="#tab-2" v-if="$can('contratos.servicios.codigos_propios')" class="black--text">
      Códigos Propios
      <v-icon color="black">mdi-cash</v-icon>
    </v-tab>

    <v-tab href="#tab-3" v-if="$can('contratos.servicios.homologo')" class="black--text">
      Homólogo
      <v-icon color="black">mdi-cash</v-icon>
    </v-tab>

    <v-tab href="#tab-4" v-if="$can('contratos.servicios.paquetes')" class="black--text">
      Paquetes de servicios
      <v-icon color="black">mdi-cash</v-icon>
    </v-tab>

    <!-- contratos -->
    <v-tab-item :value="'tab-1'">
      <ListarCupComponent />
    </v-tab-item>

    <!-- manuales tarifarios -->
    <v-tab-item :value="'tab-2'">
      <ListarCodigoPropioComponent />
    </v-tab-item>

    <!-- salario minimo -->
    <v-tab-item :value="'tab-3'">
      <ListarHomologoComponent />
    </v-tab-item>

    <!-- paquete de servicios -->
    <v-tab-item :value="'tab-4'">
      <ListarPaqueteServicioComponent />
    </v-tab-item>

  </v-tabs>
</template>

<script>
import ListarCupComponent from "@/components/contrato/cups/ListarCupComponent.vue"
import ListarHomologoComponent from "@/components/contrato/homologo/ListarHomologoComponent.vue"
import ListarCodigoPropioComponent from '~/components/contrato/codigosPropios/ListarCodigoPropioComponent.vue';
import ListarPaqueteServicioComponent from '~/components/contrato/PaqueteServicio/ListarPaqueteServicioComponent.vue';
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('contrato.servicios.vista')) {
        return redirect('/');
      }
    },
  name: 'cupsPage',
  components: {
    ListarCupComponent,
    ListarHomologoComponent,
    ListarCodigoPropioComponent,
    ListarPaqueteServicioComponent
  },

}
</script>
