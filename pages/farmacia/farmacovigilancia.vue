<template>
  <div>
    <!-- Preload -->
    <!-- <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template> -->

    <v-tabs centered color="white" icons-and-text>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab href="#tab-1" class="black--text" v-if="$can('farmacovigilancia.perfil')">
        Perfil Farmacoterapéutico
      </v-tab>

      <v-tab href="#tab-2" class="black--text" v-if="$can('farmacovigilancia.alertas')">
        Alertas Farmacoterapéuticas
      </v-tab>

      <v-tab href="#tab-3" class="black--text" v-if="$can('farmacovigilancia.seguimientoAlertas')">
        Seguimiento Alertas
      </v-tab>

      <!-- Perfil Farmacoteraputico -->
      <v-tab-item :value="'tab-1'">
      </v-tab-item>

      <!-- Alertas Farmacoterapeuticas -->
      <v-tab-item :value="'tab-2'">
        <alertasFarmacovigilancia/>
      </v-tab-item>

      <!-- Seguimiento Alertas -->
      <v-tab-item :value="'tab-3'">
        <seguimientoAlertas/>
      </v-tab-item>
    </v-tabs>

  </div>
</template>

<script setup>
import alertasFarmacovigilancia  from "~/components/farmacia/farmacovigilancia/alertasFarmacovigilancia.vue";
import seguimientoAlertas  from "~/components/farmacia/farmacovigilancia/seguimientoAlertas.vue";


</script>
